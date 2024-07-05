package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Enrollment struct {
  User User
  UserID primitive.ObjectID
  Course Course
  CourseID primitive.ObjectID
  Progress int
  FinishedParts []Part
}
