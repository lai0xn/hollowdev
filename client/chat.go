package client

import (
	"github.com/rivo/tview"
)

var chatBox = tview.NewTextView().SetTextAlign(tview.AlignLeft).SetDynamicColors(true)

func ChatPage() {
	var msg string
	var page = tview.NewFlex().SetDirection(tview.FlexRow)
	menu := tview.NewModal().
		SetText("Do you want to quit the application?").
		AddButtons([]string{"Quit", "Cancel"}).
		SetDoneFunc(func(buttonIndex int, buttonLabel string) {
			if buttonLabel == "Quit" {
				app.Stop()
			}
		})

	page.AddItem(chatBox, 0, 2, false)
	page.AddItem(tview.NewForm().AddInputField("chat", "", 30, nil, func(text string) {
		msg = text

	}).AddButton("send", func() {
		SendMessage(msg)
	}).AddButton("menu", func() {
		pages.SwitchToPage("menu")
	}), 0, 1, true)
	pages.AddPage("chat", page, true, true)
	pages.AddPage("menu", menu, true, true)
}
