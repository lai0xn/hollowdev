package main

import (
	"log"

	"github.com/lai0xn/hollowmeet/internal/db"
	"github.com/lai0xn/hollowmeet/internal/server"
	"github.com/lai0xn/hollowmeet/pkg/config"
)

func main() {
	config.Load()
	db.Connect()
	db.Setup()
	if err := server.Run(); err != nil {
		log.Fatalln(err.Error())
	}
}
