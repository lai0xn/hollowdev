package handlers

import (
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type H map[string]interface{}

type CustomClaims struct {
	Username     string
	Email        string
	ID           primitive.ObjectID
	Is_admin     bool
	Is_sub_admin bool
	jwt.RegisteredClaims
}

type PartPayload struct {
	Title       string `json:"title" form:"title"`
	Description string `json:"description" form:"description"`
	Video       string `json:"video" form:"video"`
	Number      int    `json:"part_number" form:"number"`
}
type CoursePayload struct {
	Title       string             `json:"title" form:"title"`
	Description string             `json:"description" form:"description"`
	TrailerVid  string             `json:"trailer" form:"trailer"`
	Reviews     float32            `json:"reviews" form:"reviews"`
	User        primitive.ObjectID `json:"user_id" form:"user_id"`
	Price       int                `json:"price" form:"price"`
}

type Response struct {
	Message string `json:"message"`
	Error   string `json:"error"`
	Data    interface{}
}

type RegistrationPayload struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
