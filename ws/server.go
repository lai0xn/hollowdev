package ws

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Server struct {
	router chi.Router
}

func NewServer() Server {
	s := Server{}
	r := chi.NewRouter()
	r.HandleFunc("/room/{code}", RoomRoute)
	s.router = r
	return s
}

func StartJobs() {
	go joinHandler()
	go broadcastHandler()
	go DeleteInactive(rooms)

}

func (s *Server) Run() {
	StartJobs()
	log.Println("Server started")
	http.ListenAndServe(":8080", s.router)
}
