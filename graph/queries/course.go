package queries

import (
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/db/models"
	"github.com/lain0xn/challenge-8/graph/types"
)

var courseQuery = &graphql.Field{
	Type:        graphql.NewList(types.CourseType),
	Description: "get courses list",
	Args: graphql.FieldConfigArgument{
		"page": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		page, ok := p.Args["page"].(int)
		if !ok {
			return models.Course{}, nil
		}
		courses, err := csrv.CoursesPage(int64(page))

		if err != nil {
			return nil, nil
		}

		return courses, nil

	},
}

var courseSearchQuery = &graphql.Field{
	Type:        graphql.NewList(types.CourseType),
	Description: "search courses",
	Args: graphql.FieldConfigArgument{
		"query": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		query, ok := p.Args["query"].(string)
		if !ok {
			return models.Course{}, nil
		}
		courses, err := csrv.SearchCourse(query)

		if err != nil {
			return nil, nil
		}

		return courses, nil

	},
}
