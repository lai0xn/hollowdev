package routes

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/lain0xn/challenge-8/config"
	"github.com/lain0xn/challenge-8/handlers"
	"github.com/lain0xn/challenge-8/middlewares"
)

func Execute(e *echo.Echo) {
  e.POST("/webhook/:uid/:cid",handlers.WebHook)
	authController := handlers.AuthController{}
	auth := e.Group("/auth")
	auth.POST("/register", authController.Register)
	auth.POST("/login", authController.Login)

	courseController := handlers.CourseController{}
	courseAdmin := e.Group("/courses")
	courseAdmin.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: []byte(config.JwtSecret()),
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(handlers.CustomClaims)
		},
	}))
	courseAdmin.Use(middlewares.AdminMiddleware)
	courseAdmin.POST("/create", courseController.CreateCourse)
  courseAdmin.POST("/parts/create/:id", courseController.CreatePart)


}
