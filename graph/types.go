package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/services"
)

var csrv = services.CourseService{}

var partType = graphql.NewObject(graphql.ObjectConfig{
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

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"username": &graphql.Field{
			Type: graphql.String,
		},
		"password": &graphql.Field{
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
			Type: graphql.NewList(courseType),
		},
	},
})

var courseType = graphql.NewObject(graphql.ObjectConfig{
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
			Type: graphql.NewList(partType),
		},
	},
})
