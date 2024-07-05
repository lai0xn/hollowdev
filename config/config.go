package config

import (
	"os"

	"github.com/joho/godotenv"
)

func Execute() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

}

func MongoURI() string {
	return os.Getenv("MONGO_URI")
}

func JwtSecret() string {
	return os.Getenv("JwtSecret")
}
