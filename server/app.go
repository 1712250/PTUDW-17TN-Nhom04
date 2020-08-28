package server

import (
	"admin/authentication"
	"admin/book"
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
	book   *book.Book
}

//NewApp for init server
func NewApp() *App {
	app := new(App)
	app.mongo = new(mongodb.Mongo)
	app.user = new(authentication.User)
	app.book = new(book.Book)
	return app
}
func (a *App) setRouter() {
	a.router = gin.New()
	a.router.Use(gin.Logger())
	a.router.GET("/", func(r *gin.Context) {
		r.String(200, "ok")
	})
	//login
	a.user.Init(a.mongo)
	a.router.POST("/login", a.user.Login)
	//book
	a.book.Init(a.user, a.mongo)
	a.router.GET("/book", a.book.Get)
	a.router.GET("/book/:bookID", a.book.GetDetail)
	a.router.PUT("/book/:bookID", a.book.Update)
	a.router.POST("/book", a.book.Create)
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
