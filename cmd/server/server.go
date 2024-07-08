package main

import (
	"github.com/lai0xn/websocket.go/db"
	"github.com/lai0xn/websocket.go/gql"
	"github.com/lai0xn/websocket.go/ws"
)

func main() {
	s := ws.NewServer()
  db.Connect()
  db.Setup()
	go gql.Execute()
	s.Run()
}
