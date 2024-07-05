package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lain0xn/challenge-8/config"
	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/graph"
	"github.com/lain0xn/challenge-8/routes"
	"github.com/swaggo/echo-swagger"
	_ "github.com/swaggo/echo-swagger/example/docs"
)

// @title Swagger Example API
// @version 1.0
// @description ELearning platform.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host petstore.swagger.io
// @BasePath /v2
func main() {
	config.Execute()
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	e.GET("/", func(c echo.Context) error {
		c.String(http.StatusOK, "Hello Echo!")
		return nil
	})
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	routes.Execute(e)
	db.Connect()
	db.Setup()
	data, err := json.MarshalIndent(e.Routes(), "", "  ")
	if err != nil {
		panic(err)
	}
	os.WriteFile("routes.json", data, 0644)
	go graph.Execute()
	e.Start(":8080")
}
