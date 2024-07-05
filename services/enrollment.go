package services

import (
	"context"
	"time"

	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EnrollService struct{}

func (s *EnrollService) FindByID(id string) (*models.Enrollment, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var course models.Enrollment
	err = db.DB.Collection("Enrollments").FindOne(ctx, bson.M{"_id": _id}).Decode(&course)
	if err != nil {
		return nil, err
	}
	return &course, nil

}
