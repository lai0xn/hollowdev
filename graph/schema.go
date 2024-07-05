package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/graph/mutations"
	"github.com/lain0xn/challenge-8/graph/queries"
)

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query: queries.RootQuery,
  Mutation: mutations.RootMutation,
})
