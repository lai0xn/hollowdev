package gql

import (
	"log"
	"net/http"

	"github.com/graphql-go/handler"
)

func Execute() {
	h := handler.New(&handler.Config{
		Schema:     &Schema,
		Pretty:     true,
		GraphiQL:   true,
		Playground: true,
	})
	s := http.NewServeMux()

	s.Handle("/", h)
	log.Println("GraphiQL server running on port 5000")
	http.ListenAndServe(":5000", h)
}
