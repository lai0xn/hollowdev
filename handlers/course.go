package handlers

import (
	"io"
	"net/http"
	"os"
	"path/filepath"

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
  file,err  := c.FormFile("trailer")
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
  f,err := os.Create("uploads/trailers/"+file.Filename)
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
  src,err := file.Open()
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
  io.Copy(f,src)
	err = co.srv.CreateCourse(models.Course{
		ID:          primitive.NewObjectID(),
		Title:       payload.Title,
		Description: payload.Description,
		Price:       payload.Price,
		User:        claims.ID,
    Parts: []models.Part{},
    Enrollements: []models.Enrollment{},
    TrailerVid: c.Request().Host + "/uploads/trailers/"+filepath.Clean(file.Filename),
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



func (co *CourseController) CreatePart(c echo.Context) error {
	payload := new(PartPayload)
	if err := c.Bind(payload); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
  id := c.Param("id")
  _id,err := primitive.ObjectIDFromHex(id)
  	if err := c.Bind(payload); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

  file,err  := c.FormFile("video")
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
 
  
  f,err := os.Create("uploads/courses/"+filepath.Clean(file.Filename))
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
  src,err := file.Open()
  if err != nil {
    return echo.NewHTTPError(http.StatusBadRequest,err.Error())
  }
  io.Copy(f,src)
	err = co.srv.CreatePart(models.Part{
		ID:          primitive.NewObjectID(),
		Title:       payload.Title,
		Description: payload.Description,
		Number:       payload.Number,
		CourseID:     _id   ,
    VideoPath: c.Request().URL.Host + "uploads/courses/" +filepath.Clean(file.Filename),
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, Response{
		Message: "Part Created",
		Error:   "no errors",
		Data:    "",
	})
}
