package graph

import (
	"fmt"
	"net/http"

	"github.com/graphql-go/handler"
	"github.com/lain0xn/challenge-8/middlewares"
)

func Execute() {
	h := handler.New(&handler.Config{
		Schema:     &Schema,
		Pretty:     true,
		GraphiQL:   true,
		Playground: true,
	})
	s := http.NewServeMux()
	s.Handle("/", middlewares.HeaderMiddleware(h))
	fmt.Println("Graphql server started on port 5000")
	http.ListenAndServe(":5000", s)

}
