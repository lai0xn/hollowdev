package queries

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/graph/types"
)

var partQuery = &graphql.Field{
	Type:        types.CourseType,
	Description: "get part by id",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(string)
		if !ok {
			return models.Part{}, nil
		}
		part, err := csrv.FindPartByID(id)

		if err != nil {
			return nil, nil
		}

		return part, nil

	},
}
