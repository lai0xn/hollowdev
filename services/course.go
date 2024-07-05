package services

import (
	"context"
	"time"

	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CourseService struct {

}

func (s *CourseService) CreateCourse(course models.Course)error{
   ctx,cancel := context.WithTimeout(context.Background(),time.Second * 10)
   defer cancel()
   
   _,err := db.DB.Collection("Courses").InsertOne(ctx,course)
   if err != nil {
    return err
   }
   return nil
  
}


func (s *CourseService) FindCourseByID(id string)(*models.Course,error){
   ctx,cancel := context.WithTimeout(context.Background(),time.Second * 10)
   defer cancel()
  _id,err := primitive.ObjectIDFromHex(id)
  if err != nil {
    return nil,err
  }
   var course models.Course
   err = db.DB.Collection("Courses").FindOne(ctx,bson.M{"_id":_id}).Decode(&course)
   if err != nil {
    return nil,err
   }
   return &course,nil
  
}

