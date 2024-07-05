package mutations

import (
	"errors"

	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/graph/types"
	"github.com/lain0xn/challenge-8/handlers"
)

var upgradeUserMutation = &graphql.Field{
	Name:        "upgradeUser",
	Type:        types.UserType,
	Description: "upgrade a user to sub admin",
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["id"].(string)
		if !ok {
			return nil, errors.New("no id provided")
		}
		u := p.Context.Value("user")
		if u == nil {
			return nil, errors.New("Not Authorized")
		}
		user := u.(*handlers.CustomClaims)
		if user.Is_admin == false {
			return nil, errors.New("No enough perms")
		}
		usr, err := usrv.Upgrade(id)
		if err != nil {
			return nil, err
		}
		return usr, nil
	},
}
