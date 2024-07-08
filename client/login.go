package client

import (
	"os"

	"github.com/rivo/tview"
)

func LoginPage() {
	var username, room, ip string
	// Create the form
	form := tview.NewForm().
		AddInputField("Server IP", "", 20, nil, func(text string) {
			ip = text
		}).
		AddInputField("Username", "", 20, nil, func(text string) {
			username = text
		}).
		AddInputField("Room", "", 20, nil, func(text string) {
			room = text
		}).
		AddButton("Save", func() {
			err := Connect(ip, room, username)
			if err != nil {
				modal := tview.NewModal().SetText("Couldn't connect to the server").
					AddButtons([]string{"Exit"}).
					SetDoneFunc(func(buttonIndex int, buttonLabel string) {
						if buttonLabel == "Exit" {
							app.Stop()
						}
					})
				app.SetRoot(modal, false)
				return
			}
			pages.SwitchToPage("chat")
		}).
		AddButton("Quit", func() {
			os.Exit(0)
		})
	form.SetBorder(true)
	form.SetTitle("Login Page")

	flex := tview.NewFlex().
		AddItem(tview.NewBox(), 0, 1, false).
		AddItem(tview.NewFlex().SetDirection(tview.FlexRow).
			AddItem(tview.NewBox(), 0, 1, false).
			AddItem(form, 0, 3, true).
			AddItem(tview.NewBox(), 5, 1, true), 0, 2, true).
		AddItem(tview.NewBox().SetBorder(false).SetTitle(""), 20, 1, false)

	pages.AddPage("login", flex, true, true)
}
