package mutations

import "github.com/graphql-go/graphql"


var PartDelete = &graphql.Field{
  Type: graphql.String,
  Description: "delete a part",
  Args: graphql.FieldConfigArgument{
    "id":&graphql.ArgumentConfig{
      Type: graphql.String,
    },
  },
  Resolve: func(p graphql.ResolveParams) (interface{}, error) {
    id,ok := p.Args["id"].(string)
    if !ok {
      return nil,nil
    }
    err := csrv.DeletePart(id)

    if err != nil {
      return nil,nil
    }
    
    return "Deleted Successfully",nil
  },
}
