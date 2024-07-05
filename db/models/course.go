package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Course struct {

  ID primitive.ObjectID `bson:"_id" json:"_id" validate:"required"`

  Title string `json:"title,omitempty" validate:"required"`
  
  Description string `json:"description,omitempty" validate:"required"`
  
  TrailerVid string `json:"vid_path,omitempty" validate:"required"`

  Parts []Part `json:"parts,omitempty" validate:"required"`

  Reviews float32 `json:"reviews,omitempty" validate:"required"`

  Enrollers []User `json:"enrollers,omitempty" validate:"required"`

  User primitive.ObjectID `json:"user_id,omitempty" validate:"required"`

  Price int `json:"price,omitempty" validate:"required"`

}
