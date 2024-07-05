package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/lain0xn/challenge-8/db"
	"github.com/lain0xn/challenge-8/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {}


func(s *AuthService) CreateUser(user models.User)error{
  ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
  defer cancel()
  enc,err := bcrypt.GenerateFromPassword([]byte(user.Password),12)
  user.Password = string(enc)
  if err != nil {
    return err
  }
  r,err := db.DB.Collection("Users").InsertOne(ctx,user)
  log.Println(r)
  if err != nil {
    return err
  }
  return nil
  
}

func (s *AuthService)CheckUser(email string,password string)(*models.User,error){
  ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
  defer cancel()
  var user models.User
  fmt.Println(email)
  err := db.DB.Collection("Users").FindOne(ctx,bson.M{"email":email}).Decode(&user)
  if err != nil {
    return nil,err
  }
  err = bcrypt.CompareHashAndPassword([]byte(user.Password),[]byte(password))
  if err != nil {
    return nil,err
  }
  return &user,nil
  
}
