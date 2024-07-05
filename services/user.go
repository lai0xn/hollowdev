package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService struct {

}


func (s *UserService) FindUserByID(id string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var user models.User
	err = db.DB.Collection("Users").FindOne(ctx, bson.M{"_id": _id}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil

}

func (s *UserService) Upgrade(id string)(models.User,error){
  ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.User{}, err
	}
  var user models.User
  db.DB.Collection("Users").FindOneAndUpdate(ctx,bson.M{"_id":_id},bson.M{
    "$set":bson.M{
      "is_sub_admin":true,
    },
  }).Decode(&user)

  return user,nil


}

func (s *UserService) Enroll(cid string,uid string) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
  _cid,err := primitive.ObjectIDFromHex(cid)
  if err != nil {
        log.Println(err)

    return err
  }
   _uid,err := primitive.ObjectIDFromHex(uid)
  if err != nil {
        log.Println(err)

    return err
  }
  var user models.User
  var course models.Course
  err = db.DB.Collection("Users").FindOne(ctx,bson.M{"_id":_uid}).Decode(&user)
    if err != nil {
        fmt.Println("haha")
        log.Println(err.Error())

    return err
  }
  err = db.DB.Collection("Courses").FindOne(ctx,bson.M{"_id":_cid}).Decode(&course)
    if err != nil {
        log.Println(err)

    return err
  }
  enroll := models.Enrollment{
    CourseID: _cid,
    User:user,
    Course: course,
    Progress: 0,
    FinishedParts: []models.Part{},
    UserID: _uid,

  }
  _,err = db.DB.Collection("Enrollments").InsertOne(ctx,enroll)
    if err != nil {
    log.Println(err)
    return err
  }
  db.DB.Collection("Courses").FindOneAndUpdate(ctx,bson.M{"_id":_cid},bson.M{
    "$push":bson.M{
      "enrollements":enroll,

    },
  })
  db.DB.Collection("Users").FindOneAndUpdate(ctx,bson.M{
    "id":_uid,
  },bson.M{
      "$push":bson.M{
        "courses":enroll,
      },
    })

  return nil
}


func (s *UserService) FindUserByUsername(username string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
		var user models.User
  err := db.DB.Collection("Users").FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil

}


func (s *UserService) FindUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	var user models.User
  err := db.DB.Collection("Users").FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil

}
