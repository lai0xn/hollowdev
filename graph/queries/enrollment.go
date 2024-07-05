package queries

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/graph/types"
	"github.com/lain0xn/challenge-8/services"
)

var (
  esrv = services.EnrollService{}
)

var enrollmentQuery = &graphql.Field{
	Type:        types.EnrollType,
	Description: "get enrollment by id",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(string)
		if !ok {
			return models.Course{}, nil
		}
		enr, err := esrv.FindByID(id)

		if err != nil {
			return nil, nil
		}

		return enr, nil


	},
}


