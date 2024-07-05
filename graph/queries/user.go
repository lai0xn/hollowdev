package queries

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/graph/types"
)

var userQuery = &graphql.Field{
	Type:        types.UserType,
	Description: "get user by id",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(string)
		if !ok {
			return models.User{}, nil
		}
		part, err := usrv.FindUserByID(id)

		if err != nil {
			return models.User{}, nil
		}

		return part, nil

	},
}

var userEmailQuery = &graphql.Field{
	Type:        types.UserType,
	Description: "search user by email",
	Args: graphql.FieldConfigArgument{
		"email": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		email, ok := p.Args["email"].(string)
		if !ok {
			return models.User{}, nil
		}
		part, err := usrv.FindUserByEmail(email)

		if err != nil {
			return models.User{}, nil
		}

		return part, nil

	},
}

var userUsernameQuery = &graphql.Field{
	Type:        types.UserType,
	Description: "search user by username",
	Args: graphql.FieldConfigArgument{
		"username": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		username, ok := p.Args["username"].(string)
		if !ok {
			return models.User{}, nil
		}
		part, err := usrv.FindUserByUsername(username)

		if err != nil {
			return models.User{}, nil
		}

		return part, nil

	},
}
