package main

import (
	"admin/server"

	_ "github.com/heroku/x/hmetrics/onload"
)

func main() {
	app := server.NewApp()
	app.Run()
}
