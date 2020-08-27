package server

import (
	"admin/mongodb"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

//App for server
type App struct {
	mongo  *mongodb.Mongo
	router *gin.Engine
}

//NewApp for init server
func NewApp() *App {
	app := new(App)
	app.mongo = new(mongodb.Mongo)

	return app
}
func (a *App) setRouter() {
	a.router = gin.New()
	a.router.Use(gin.Logger())
	a.router.GET("/", func(r *gin.Context) {
		r.String(200, "ok")
	})
}

//Run for start server
func (a *App) Run() error {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	// Init gin handler
	err := a.mongo.Connect()
	if err != nil {
		fmt.Println(err)
		return err
	}
	//create sever
	a.setRouter()
	return a.router.Run(":" + port)
}
