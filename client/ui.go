package client

import (
	"github.com/rivo/tview"
)

var app = tview.NewApplication()

var pages *tview.Pages = tview.NewPages()

func UI() {
	ChatPage()
	LoginPage()

	if err := app.SetRoot(pages, true).Run(); err != nil {
		panic(err)
	}
}
