package category

import (
	"admin/authentication"
	"admin/models"
	"admin/mongodb"
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Category a
type Category struct {
	User *authentication.User
	Db   *mongodb.Mongo
}

//Init for init
func (a *Category) Init(user *authentication.User, db *mongodb.Mongo) {
	a.User = user
	a.Db = db
}

//Get for
func (a *Category) Get(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	collection := a.Db.Db.Collection("genres")
	ctx := context.TODO()
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)
	var categorys []models.Category
	for cursor.Next(ctx) {
		var category models.Category
		if err = cursor.Decode(&category); err != nil {
			log.Fatal(err)
		}
		categorys = append(categorys, category)
	}
	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(http.StatusOK, categorys)
}

//GetDetail for
func (a *Category) GetDetail(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	id := r.Param("categoryID")
	collection := a.Db.Db.Collection("genres")

	var category models.Category
	idhex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}
	err = collection.FindOne(context.TODO(), bson.M{"_id": idhex}).Decode(&category)

	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(http.StatusOK, category)
}

//Update for
func (a *Category) Update(r *gin.Context) {

	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}

	var category models.CategoryInsert
	//filter := bson.M{"_id": bson.M{"$eq": idhex}}
	r.Bind(&category)
	if category.Name == "" || category.Category == "" {
		r.String(http.StatusBadRequest, "Invalid event format (i.e. JSON parse error) or incorrect event structure")
		return
	}
	id := r.Param("categoryID")
	idhex, err := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": bson.M{"$eq": idhex}}
	update := bson.M{"$set": bson.M{"name": category.Name,
		"category": category.Category,
		"__v":      1}}
	_, err = a.Db.Db.Collection("genres").UpdateOne(
		context.Background(),
		filter,
		update,
	)
	if err != nil {
		fmt.Println("UpdateOne() result ERROR:", err)
		r.Status(http.StatusInternalServerError)
		return
	}
	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(200, gin.H{"categoryID": id})
}

//Create for
func (a *Category) Create(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}

	var category models.CategoryInsert
	//filter := bson.M{"_id": bson.M{"$eq": idhex}}
	r.Bind(&category)
	if category.Name == "" || category.Category == "" {
		r.String(http.StatusBadRequest, "Invalid event format (i.e. JSON parse error) or incorrect event structure")
		return
	}
	collection := a.Db.Db.Collection("genres")
	result, err := collection.InsertOne(context.TODO(), category)
	if err != nil {
		r.Status(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	newID := fmt.Sprintf("%v", result.InsertedID)
	newID = newID[10 : len(newID)-2]
	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(200, gin.H{"categoryID": newID})
}

//Delete for
func (a *Category) Delete(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}

	id := r.Param("categoryID")
	idhex, err := primitive.ObjectIDFromHex(id)
	_, err = a.Db.Db.Collection("genres").DeleteOne(context.TODO(), bson.M{"_id": idhex})
	if err != nil {
		r.Status(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	if err != nil {
		fmt.Println("DeleteOne() ERROR:", err)
		r.Status(http.StatusInternalServerError)
		return
	}
	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.Status(200)
}
