package mutations

import (
	"errors"

	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/handlers"
)

var courseDelete = &graphql.Field{
	Type:        graphql.String,
	Description: "delete a course",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(string)
		usr := p.Context.Value("user")
		if usr == nil {
			return nil, errors.New("Not authorized")
		}
		u := usr.(*handlers.CustomClaims)
		if u.Is_admin == false || u.Is_sub_admin == false {
			return nil, errors.New("not enough permissions")
		}
		if !ok {
			return nil, nil
		}
		err := csrv.DeleteCourse(id)

		if err != nil {
			return nil, nil

		}

		return "Deleted Successfully", nil
	},
}
