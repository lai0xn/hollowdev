package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main(){
  e := echo.New()
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())
  e.GET("/",func(c echo.Context) error {
    c.String(http.StatusOK,"Hello Echo!")
    return nil
  })
  e.Start(":8080")
}
