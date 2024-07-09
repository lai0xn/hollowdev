package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/lain0xn/challenge-8/handlers"
	"github.com/lain0xn/challenge-8/utils"
)

func HeaderMiddleware(next http.Handler) http.HandlerFunc {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "host", r.Host)
		auth := r.Header.Get("Authorization")
		if auth == "" {
			next.ServeHTTP(w, r.WithContext(ctx))
			return

		}
		broke := strings.Split(auth, " ")
		if len(broke) < 2 {
			next.ServeHTTP(w, r.WithContext(ctx))
			return

		}
		token_string := broke[1]
		token, err := utils.ParseToken(token_string)

		if err != nil {
			next.ServeHTTP(w, r.WithContext(ctx))
			return

		}

		claims := token.Claims.(*handlers.CustomClaims)
		u_ctx := context.WithValue(ctx, "user", claims)
		next.ServeHTTP(w, r.WithContext(u_ctx))
	})

}