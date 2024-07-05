package models

import "go.mongodb.org/mongo-driver/bson/primitive"



type User struct {
  ID primitive.ObjectID `bson:"_id" json:"_id" validate:"required"`
  Username string `json:"username,omitempty" validate:"required"`
  Email string `json:"email,omitempty" validate:"required"`
  Password string `json:"password,omitempty" validate:"required"`
  Is_Admin bool `json:"is_admin,omitempty" validate:"required"`
  Is_Sub_Admin bool `json:"is_sub_admin,omitempty" validate:"required"`
  Courses []Course `json:"courses,omitempty" validate:"required"`

}
