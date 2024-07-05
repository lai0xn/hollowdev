package graph

import (
	"fmt"

	"github.com/graphql-go/graphql"
	"github.com/lain0xn/challenge-8/db/models"
)

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
  Name: "rootQuery",
  Fields: graphql.Fields{
    "course":&graphql.Field{
      Type: courseType,
      Description: "get a course by id",
      Args: graphql.FieldConfigArgument{
        "id":&graphql.ArgumentConfig{
          Type: graphql.String,
        },
      },
      Resolve: func(p graphql.ResolveParams) (interface{}, error) {
          id ,ok := p.Args["id"].(string)
          fmt.Println("i got executed",id)

          if !ok {
            return models.Course{},nil  
          }
          course,err := csrv.FindCourseByID(id) 
          if err != nil {
             return models.Course{},nil
        }
           return course,nil
      },
    },
  },
    
})
