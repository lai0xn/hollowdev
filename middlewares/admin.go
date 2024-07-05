package middlewares

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/lain0xn/challenge-8/handlers"
)

func AdminMiddleware(next echo.HandlerFunc)echo.HandlerFunc{
  return echo.HandlerFunc(func(c echo.Context) error {
    token := c.Get("user").(*jwt.Token)
    claims := token.Claims.(*handlers.CustomClaims)
    if claims.Is_admin || claims.Is_sub_admin {
      return next(c)
      
    }
    return echo.NewHTTPError(http.StatusUnauthorized,"you don't have access to this endpoint")
    
})}
