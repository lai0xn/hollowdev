package client

import (
	"fmt"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var (
	conn  *websocket.Conn
	conMu sync.Mutex
)

type Message struct {
	Content string `json:"Content"`
	Code    string `json:"Code"`
	User    struct {
		Username     string `json:"Username"`
		Current_Code string `json:"Current_Code"`
	}
	Date time.Time
}

func Connect(ip string, room string, username string) error {
	// Establish WebSocket connection
	c, _, err := websocket.DefaultDialer.Dial(fmt.Sprintf("ws://%s/room/"+room+"?username="+username, ip), nil)
	if err != nil {
		return err
	}
	conn = c // Assign the connection to the global variable
	SendMessage(username + " joined !!")
	// Goroutine to continuously read messages from the server
	go func() {
		for {
			var msg Message
			err := conn.ReadJSON(&msg)
			if err != nil {
				fmt.Println("Error reading message:", err)
				return
			}
			fmt.Fprintf(chatBox, " [red]"+msg.User.Username+":[white] "+msg.Content+"\n")

			chatBox.ScrollToEnd()
			app.Draw()

			// Handle message (you can define how to handle incoming messages here)

		}
	}()

	return nil
}

func SendMessage(msg string) {
	if conn == nil {
		fmt.Println("Not connected to server.")
		return
	}
	err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
	if err != nil {
		fmt.Println("Error sending message:", err)
	}
}
