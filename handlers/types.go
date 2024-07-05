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

type CoursePayload struct {
	Title       string             `json:"title"`
	Description string             `json:"description"`
	TrailerVid  string             `json:"vid_path"`
	Reviews     float32            `json:"reviews"`
	User        primitive.ObjectID `json:"user_id"`
	Price       int                `json:"price"`
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
