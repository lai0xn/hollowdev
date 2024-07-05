package services

import (
	"context"
	"errors"
	"time"

	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CourseService struct {
}

func (s *CourseService) CreateCourse(course models.Course) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	_, err := db.DB.Collection("Courses").InsertOne(ctx, course)
	if err != nil {
		return err
	}
	return nil

}

func (s *CourseService) SearchCourse(text string) ([]models.Course, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()


  model := mongo.IndexModel{Keys: bson.D{{"title", "text"}}}
  _, err := db.DB.Collection("Courses").Indexes().CreateOne(ctx, model)

  if err != nil {
	 panic(err)
   }
  filter := bson.D{{"$text", bson.D{{"$search", text}}}}
  cursor,err := db.DB.Collection("Courses").Find(ctx,filter)
  if err != nil {
     return nil,err
  }

  var courses []models.Course
  for cursor.Next(ctx){
      var course models.Course
      err := cursor.Decode(&course)
      if err != nil {
      return nil,err
      }
      courses = append(courses,course)
  }
  return courses,nil
	
}


func (s *CourseService) FindCourseByID(id string) (*models.Course, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var course models.Course
	err = db.DB.Collection("Courses").FindOne(ctx, bson.M{"_id": _id}).Decode(&course)
	if err != nil {
		return nil, err
	}
	return &course, nil

}


func (s *CourseService) CoursesPage(page int64) ([]models.Course, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

  var courses []models.Course

  opts := options.Find()
  opts.SetSkip(10*(page-1))
  opts.SetLimit(10)
  
  cur,err := db.DB.Collection("Courses").Find(ctx,bson.M{},opts)
  
  if err != nil {
    return nil,err
  }

  defer cur.Close(ctx)

  for cur.Next(ctx){
     var course models.Course
     err := cur.Decode(&course)
     if err != nil {
      return nil,err
    }
     courses = append(courses, course)
  }
  return courses,nil

}


func (s *CourseService) DeleteCourse(id string)error{
  ctx,cancel := context.WithTimeout(context.Background(),time.Second * 10)
  defer cancel()

  _id,err := primitive.ObjectIDFromHex(id)

  if err != nil {
    return err
  }

  r,err := db.DB.Collection("Courses").DeleteOne(ctx,bson.M{"_id":_id})
  
  if err != nil {
    return err
  }
  if r.DeletedCount == 0 {
    return errors.New("Object does not exist")
  }
  return nil
}

func (s *CourseService) DeletePart(id string)error{
  ctx,cancel := context.WithTimeout(context.Background(),time.Second * 10)
  defer cancel()

  _id,err := primitive.ObjectIDFromHex(id)

  if err != nil {
    return err
  }

  r,err := db.DB.Collection("Parts").DeleteOne(ctx,bson.M{"_id":_id})
  
  if err != nil {
    return err
  }
  if r.DeletedCount == 0 {
    return errors.New("Object does not exist")
  }
  return nil
}



func (s *CourseService) CreatePart(part models.Part) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()


  var course models.Course
  err := db.DB.Collection("Courses").FindOneAndUpdate(ctx,bson.M{"_id":part.CourseID},bson.M{
    "$push":bson.M{
      "parts":part,


    },
  }).Decode(&course)
  if err != nil {
     return errors.New("course not found")
  }

    _, err = db.DB.Collection("Parts").InsertOne(ctx, part)
	if err != nil {
		return err
	}


	return nil

}

func (s *CourseService) FindPartByID(id string) (*models.Part, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var part models.Part
	err = db.DB.Collection("Parts").FindOne(ctx, bson.M{"_id": _id}).Decode(&part)
	if err != nil {
		return nil, err
	}
	return &part, nil
}
