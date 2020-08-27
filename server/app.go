package server

import (
	"admin/authentication"
	"admin/mongodb"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
)

//App for server
type App struct {
	mongo  *mongodb.Mongo
	router *gin.Engine
	user   *authentication.User
}

//NewApp for init server
func NewApp() *App {
	app := new(App)
	app.mongo = new(mongodb.Mongo)
	app.user = new(authentication.User)
	return app
}
func (a *App) setRouter() {
	a.router = gin.New()
	a.router.Use(gin.Logger())
	a.router.GET("/", func(r *gin.Context) {
		r.String(200, "ok")
	})
	a.user.Init(a.mongo)
	a.router.POST("/login", a.user.Login)
}

//Run for start server
func (a *App) Run() error {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8888"
		//log.Fatal("$PORT must be set")
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
