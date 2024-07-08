package ws

import (
	"fmt"
	"sync"
	"time"
)

var mu sync.Mutex

func DeleteInactive(rooms map[string]Room) {
	for {
		mu.Lock()
		fmt.Println(rooms)
		for key, v := range rooms {
			if len(v.Messages) > 0 {
				last := v.Messages[len(v.Messages)-1]
				if time.Since(last.Date) > time.Hour*2 {
					for _, user := range v.Users {
						user.Conn.Close()
					}
					fmt.Println("will close connection")
					delete(rooms, key)
				}

			}
		}
		mu.Unlock()
		time.Sleep(time.Hour * 2)

	}
}
