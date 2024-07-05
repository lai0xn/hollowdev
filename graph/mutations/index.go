package mutations

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/services"
)

var (
	usrv = services.UserService{}
	csrv = services.CourseService{}
)

var RootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "mutation",
	Fields: graphql.Fields{
		"courseDel":   courseDelete,
		"partDel":     PartDelete,
		"enroll":      enrollMutation,
		"upgradeUser": upgradeUserMutation,
	},
})
