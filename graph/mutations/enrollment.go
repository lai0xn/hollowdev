package mutations

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/handlers"
	"github.com/lain0xn/challenge-8/payment"
)

var enrollMutation = &graphql.Field{
	Name: "Enroll",
	Type: graphql.String,
	Args: graphql.FieldConfigArgument{
		"course_id": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		id, ok := p.Args["course_id"].(string)
		if !ok {
			return "", errors.New("no args provided")
		}
		course, err := csrv.FindCourseByID(id)
		if err != nil {
			return "", errors.New("object not found")
		}
		host := p.Context.Value("host").(string)
		user := p.Context.Value("user")
		if user == nil {
			return "", errors.New("You are not authorized")
		}
		u := user.(*handlers.CustomClaims)
		url := fmt.Sprintf("https://%s/webhook/%s/%s", host, u.ID.Hex(), course.ID.Hex())
		resp := payment.CreateCheckout(course.Price, "dzd", url)
		var checkout payment.CheckoutResponse
		json.Unmarshal(resp, &checkout)

		usrv.Enroll(course.ID.Hex(), u.ID.Hex())
		return checkout.CheckoutURL, nil

	},
}
