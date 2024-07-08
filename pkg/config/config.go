package config

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	MONGO_URI  string
	JWT_SECRET string
)

func Load() {
	godotenv.Load()
	MONGO_URI = os.Getenv("MONGO_URI")
	JWT_SECRET = os.Getenv("JWT_SECRET")
}
