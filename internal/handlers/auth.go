package handlers

import (
	"context"
	"log"
	"time"

	"github.com/lai0xn/hollowmeet/internal/db"
	"github.com/lai0xn/hollowmeet/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id" json:"_id" validate:"required"`
	Username string             `json:"username,omitempty" validate:"required"`
	Email    string             `json:"email,omitempty" validate:"required"`
	Password string             `json:"password,omitempty" validate:"required"`
}

type CustomClaims struct {
	Username string
	Email    string
	ID       primitive.ObjectID
	jwt.RegisteredClaims
}

func Login(c *fiber.Ctx) error {
	return c.Render("login", nil, "layouts/main")
}

func Register(c *fiber.Ctx) error {
	return c.Render("register", nil, "layouts/main")
}

func RegisterPost(c *fiber.Ctx) error {
	email := c.FormValue("email")
	username := c.FormValue("username")
	passowrd := c.FormValue("password")
	user := User{
		ID:       primitive.NewObjectID(),
		Username: username,
		Email:    email,
		Password: passowrd,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	enc, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	user.Password = string(enc)
	if err != nil {
		return err
	}
	r, err := db.DB.Collection("Users").InsertOne(ctx, user)
	log.Println(r)
	if err != nil {
		return err
	}
	return c.Redirect("/login")

}

func LoginPost(c *fiber.Ctx) error {
	log.Println(c.Request().URI())
	email := c.FormValue("email")
	password := c.FormValue("password")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var user User
	err := db.DB.Collection("Users").FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return c.Redirect("/login")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return c.Redirect("/login")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &CustomClaims{
		user.Username,
		user.Email,
		user.ID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	})
	token_string, err := token.SignedString([]byte(config.JWT_SECRET))
	cookie := &fiber.Cookie{
		Name:     "token",
		Value:    token_string,
		Expires:  time.Now().Add(time.Hour * 72),
		Secure:   true,
		HTTPOnly: true,
	}
	c.Cookie(cookie)
	return c.Redirect("/")
}

func AuthMiddleware(c *fiber.Ctx) error {
  log.Println(c.Request().URI())
	token_string := c.Cookies("token")
	if token_string == "" {
		return c.Redirect("/login")
	}
	claims := new(CustomClaims)
	token, err := jwt.ParseWithClaims(token_string, claims, func(token *jwt.Token) (interface{}, error) {

		return []byte(config.JWT_SECRET), nil
	})
	if err != nil {
		return c.Redirect("/login")
	}
	claims = token.Claims.(*CustomClaims)
	c.Locals("user", claims)
	return c.Next()
}
