package server

import (
	"flag"
	"log"
	"os"
	"time"

	"github.com/lai0xn/hollowmeet/internal/handlers"
	w "github.com/lai0xn/hollowmeet/pkg/webrtc"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html"
	"github.com/gofiber/websocket/v2"
)

var (
	addr = flag.String("addr", ":"+os.Getenv("PORT"), "")
	cert = flag.String("cert", "", "")
	key  = flag.String("key", "", "")
)

func Run() error {
	flag.Parse()

	if *addr == ":" {
		*addr = ":8080"
	}

	engine := html.New("./views", ".html")
	app := fiber.New(fiber.Config{Views: engine})

	app.Use(logger.New())
	app.Use(cors.New())
	app.Get("/", handlers.AuthMiddleware,handlers.Welcome)
	app.Get("/room/create", handlers.AuthMiddleware,handlers.RoomCreate)
	app.Get("/room/:uuid", handlers.AuthMiddleware, handlers.Room)
	app.Get("/room/:uuid/websocket",  handlers.AuthMiddleware,websocket.New(handlers.RoomWebsocket, websocket.Config{
		HandshakeTimeout: 10 * time.Second,
	}))
	app.Get("/room/:uuid/chat",  handlers.AuthMiddleware,handlers.RoomChat)
	app.Get("/room/:uuid/chat/websocket",  handlers.AuthMiddleware,websocket.New(handlers.RoomChatWebsocket))
	app.Get("/room/:uuid/viewer/websocket",  handlers.AuthMiddleware,websocket.New(handlers.RoomViewerWebsocket))
	app.Get("/stream/:suuid", handlers.AuthMiddleware, handlers.Stream)
	app.Get("/stream/:suuid/websocket", handlers.AuthMiddleware, websocket.New(handlers.StreamWebsocket, websocket.Config{
		HandshakeTimeout: 10 * time.Second,
	}))
	app.Get("/login",handlers.Login)
	app.Post("/login",handlers.LoginPost)
	app.Get("/signup", handlers.Register)
	app.Post("/signup", handlers.RegisterPost)
	app.Get("/stream/:suuid/chat/websocket", handlers.AuthMiddleware, websocket.New(handlers.StreamChatWebsocket))
	app.Get("/stream/:suuid/viewer/websocket",  handlers.AuthMiddleware,websocket.New(handlers.StreamViewerWebsocket))
	app.Static("/", "./assets")

	w.Rooms = make(map[string]*w.Room)
	w.Streams = make(map[string]*w.Room)
	go dispatchKeyFrames()
	if *cert != "" {
		return app.ListenTLS(*addr, *cert, *key)
	}
	log.Println("Server Running")
	return app.Listen(*addr)
}

func dispatchKeyFrames() {
	for range time.NewTicker(time.Second * 3).C {
		for _, room := range w.Rooms {
			room.Peers.DispatchKeyFrame()
		}
	}
}
