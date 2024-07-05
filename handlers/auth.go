package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/lain0xn/challenge-8/config"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/services"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthController struct {
	srv services.AuthService
}

func (auth *AuthController) Login(c echo.Context) error {
	var payload = new(LoginPayload)
	if err := c.Bind(payload); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())

	}
	user, err := auth.srv.CheckUser(payload.Email, payload.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &CustomClaims{
		user.Username,
		user.Email,
		user.ID,
		user.Is_Admin,
		user.Is_Sub_Admin,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	})
	token_string, err := token.SignedString([]byte(config.JwtSecret()))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())

	}
	return c.JSON(http.StatusOK, Response{
		Message: "Success",
		Error:   "No Error",
		Data:    "token " + token_string,
	})
}

func (auth *AuthController) Register(c echo.Context) error {
	var payload = new(RegistrationPayload)
	if err := c.Bind(payload); err != nil {
		log.Println(err)
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())

	}
	if err := auth.srv.CreateUser(models.User{
		ID:           primitive.NewObjectID(),
		Username:     payload.Username,
		Email:        payload.Email,
		Password:     payload.Password,
		Is_Admin:     false,
		Is_Sub_Admin: false,
	}); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())

	}
	return c.JSON(http.StatusOK, Response{
		Message: "Success",
		Error:   "No Error",
		Data:    "Register Page",
	})
}
