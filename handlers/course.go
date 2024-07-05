package handlers

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/services"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CourseController struct {
	srv services.CourseService
}

func (co *CourseController) CreateCourse(c echo.Context) error {
	payload := new(CoursePayload)
	if err := c.Bind(payload); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*CustomClaims)
	err := co.srv.CreateCourse(models.Course{
		ID:          primitive.NewObjectID(),
		Title:       payload.Title,
		Description: payload.Description,
		Price:       payload.Price,
		User:        claims.ID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, Response{
		Message: "Course Created",
		Error:   "no errors",
		Data:    "",
	})
}
