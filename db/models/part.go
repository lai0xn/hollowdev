package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Part struct {
	ID          primitive.ObjectID `bson:"_id" json:"_id" validate:"required"`
	Title       string             `json:"title,omitempty" validate:"required"`
	Description string             `json:"description,omitempty" validate:"required"`
	Number      int                `json:"number,omitempty" validate:"required"`
	VideoPath   string             `json:"video_path,omitempty" validate:"required"`
	CourseID    primitive.ObjectID `json:"course_id,omitempty" validate:"required"`
}
