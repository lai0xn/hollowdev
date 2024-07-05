package utils

import (
	"log"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lain0xn/challenge-8/config"
	"github.com/lain0xn/challenge-8/handlers"
)

func ParseToken(tokenString string) (*jwt.Token, error) {
	claims := new(handlers.CustomClaims)
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {

		return []byte(config.JwtSecret()), nil
	})
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return token, nil
}
