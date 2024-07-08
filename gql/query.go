package gql

import "github.com/graphql-go/graphql"

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name:        "RootQuery",
	Description: "the root query of the app",
	Fields:      graphql.Fields{},
})
