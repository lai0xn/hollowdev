package types

import (
	"github.com/graphql-go/graphql"
)

var PartType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Part",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"title": &graphql.Field{
			Type: graphql.String,
		},
		"description": &graphql.Field{
			Type: graphql.String,
		},
		"Number": &graphql.Field{
			Type: graphql.Int,
		},
		"video_path": &graphql.Field{
			Type: graphql.String,
		},
		"ownerID": &graphql.Field{
			Type: graphql.String,
		},
		"courseID": &graphql.Field{
			Type: graphql.Float,
		},
	},
})

var EnrollType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Part",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"course": &graphql.Field{
			Type: CourseType,
		},
		"user": &graphql.Field{
			Type: UserType,
		},
		"progress": &graphql.Field{
			Type: graphql.Int,
		},
		"finished": &graphql.Field{
			Type: graphql.NewList(PartType),
		},
	}})

var UserType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"username": &graphql.Field{
			Type: graphql.String,
		},
		"is_admin": &graphql.Field{
			Type: graphql.Boolean,
		},
		"email": &graphql.Field{
			Type: graphql.String,
		},
		"is_sub_admin": &graphql.Field{
			Type: graphql.Boolean,
		},
		"courses": &graphql.Field{
			Type: graphql.NewList(CourseType),
		},
	},
})

var CourseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Course",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"title": &graphql.Field{
			Type: graphql.String,
		},
		"description": &graphql.Field{
			Type: graphql.String,
		},
		"price": &graphql.Field{
			Type: graphql.Int,
		},
		"trailer": &graphql.Field{
			Type: graphql.String,
		},
		"userID": &graphql.Field{
			Type: graphql.String,
		},
		"reviews": &graphql.Field{
			Type: graphql.Float,
		},
		"parts": &graphql.Field{
			Type: graphql.NewList(PartType),
		},
	},
})
