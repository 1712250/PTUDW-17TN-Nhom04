package authentication

import (
	"admin/models"
	"admin/mongodb"
	"context"
	"crypto/sha256"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

//User for manage user
type User struct {
	authorization *Authorization
	db            *mongodb.Mongo
}

//Init to init user
func (a *User) Init(db *mongodb.Mongo) {
	a.db = db
	a.authorization = new(Authorization)
	a.authorization.Init()
}

//Login for user login
func (a *User) Login(r *gin.Context) {
	user := new(models.UserLogin)
	r.Bind(user)
	if user.Username == "" || user.Password == "" {
		r.String(http.StatusBadRequest, "Invalid event format (i.e. JSON parse error) or incorrect event structure")
		return
	}
	user.Password = fmt.Sprintf("%x", sha256.Sum256([]byte(user.Password)))
	var uid string
	collection := a.db.Db.Collection("admin")
	var result bson.M
	err := collection.FindOne(context.TODO(), bson.M{"username": user.Username, "password": user.Password}).Decode(&result)
	if err != nil {
		fmt.Println("Login ", err)
		r.String(http.StatusUnauthorized, "Wrong username or password")
		return
	}
	uid = fmt.Sprintf("%v", result["_id"])
	jwt, err := a.authorization.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.String(http.StatusOK, "ok")
}

//Authentication for check authentication
func (a *User) Authentication(r *gin.Context) (bool, string) {
	tokenHeader := r.GetHeader("Authorization")

	if tokenHeader == "" {
		r.Status(http.StatusUnauthorized)
		return false, ""
	}
	splitted := strings.Split(tokenHeader, " ") // Bearer jwt_token
	if len(splitted) != 2 {
		r.Status(http.StatusUnauthorized)
		return false, ""
	}

	tokenPart := splitted[1]
	uid, err := a.authorization.CheckToken(tokenPart)
	if err != nil {
		fmt.Println("Check token ", err)
		r.Status(http.StatusUnauthorized)
		return false, ""
	}
	collection := a.db.Db.Collection("admin")
	var result bson.M
	err = collection.FindOne(context.TODO(), bson.M{"_id": uid}).Decode(&result)
	if err != nil {
		fmt.Println("Authentication check user is exist ", err)
		r.Status(http.StatusForbidden)
		return false, ""
	}
	return true, uid
}

//NewJWT to generate Json Web Token
func (a *User) NewJWT(uid string) (string, error) {
	return a.authorization.NewJWT(uid)
}
