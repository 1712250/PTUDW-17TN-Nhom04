package book

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

//Book for handle book endpoit
type Book struct {
	User *authentication.User
	Db   *mongodb.Mongo
}

//Init for init
func (a *Book) Init(user *authentication.User, db *mongodb.Mongo) {
	a.User = user
	a.Db = db
}

//Get for menthod get all
func (a *Book) Get(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	collection := a.Db.Db.Collection("books")
	ctx := context.TODO()
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)
	var books []models.Book
	for cursor.Next(ctx) {
		var book models.Book
		if err = cursor.Decode(&book); err != nil {
			log.Fatal(err)
		}
		books = append(books, book)
	}
	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(http.StatusOK, books)
}

//GetDetail for menthod get all
func (a *Book) GetDetail(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	id := r.Param("bookID")
	collection := a.Db.Db.Collection("books")

	var book models.BookDetail
	idhex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}
	err = collection.FindOne(context.TODO(), bson.M{"_id": idhex}).Decode(&book)

	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusForbidden)
		return
	}
	collection = a.Db.Db.Collection("bookinstances")

	err = collection.FindOne(context.TODO(), bson.M{"book": idhex}).Decode(&book.BookIntances)

	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusForbidden)
		return
	}
	collection = a.Db.Db.Collection("authors")
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}
	var result bson.M
	err = collection.FindOne(context.TODO(), bson.M{"_id": book.BookAuthorID}).Decode(&result)
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusForbidden)
		return
	}
	book.BookAuthor = fmt.Sprintf("%v", result["name"])

	collection = a.Db.Db.Collection("genres")
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}
	for _, genresID := range book.BookGenresID {
		var genres models.Genres
		err = collection.FindOne(context.TODO(), bson.M{"_id": genresID}).Decode(&genres)
		if err != nil {
			fmt.Println(err)
			r.Status(http.StatusForbidden)
			return
		}
		book.BookGenres = append(book.BookGenres, genres)
	}

	//refesh token
	jwt, err := a.User.NewJWT(uid)
	if err != nil {
		fmt.Println("JWT err ", err)
		r.String(http.StatusInternalServerError, "")
		return
	}
	r.Header("Authorization", "bearer "+jwt)
	r.JSON(http.StatusOK, book)
}

//Update for menthod get all
func (a *Book) Update(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	id := r.Param("bookID")
	//collection := a.Db.Db.Collection("books")

	var book models.BookDetail
	idhex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}

	r.Bind(&book)
	//fmt.Println(book)
	if idhex != book.ID || book.Name == "" || book.BookGenresID == nil ||
		book.BookAuthorID == primitive.NilObjectID || book.BookDescription == "" ||
		book.BookImage == "" || book.BookIntances.BookPrice == 0 {
		r.String(http.StatusBadRequest, "Invalid event format (i.e. JSON parse error) or incorrect event structure")
		return
	}
	filter := bson.M{"_id": bson.M{"$eq": book.ID}}
	update := bson.M{"$set": bson.M{"description": book.BookDescription,
		"genres":    book.BookGenresID,
		"image_url": book.BookImage,
		"title":     book.Name,
		"author":    book.BookAuthorID,
		"rating":    book.BookRating,
		"__v":       1}}
	_, err = a.Db.Db.Collection("books").UpdateOne(
		context.Background(),
		filter,
		update,
	)
	if err != nil {
		fmt.Println("UpdateOne() result ERROR:", err)
		r.Status(http.StatusInternalServerError)
		return
	}
	//fmt.Println("UpdateOne() result:", result)
	filter = bson.M{"book": bson.M{"$eq": idhex}}
	update = bson.M{"$set": bson.M{"price": book.BookIntances.BookPrice,
		"discount": book.BookIntances.BookDiscount,
		"count":    book.BookIntances.BookCount,
		"language": book.BookIntances.BookLanguage,
		"status":   book.BookIntances.BookStatus,
		"__v":      1}}
	_, err = a.Db.Db.Collection("bookinstances").UpdateOne(
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
	r.Status(200)
}

//Create for menthod get all
func (a *Book) Create(r *gin.Context) {
	//check authentication
	check, uid := a.User.Authentication(r)
	if !check {
		return
	}
	//collection := a.Db.Db.Collection("books")

	var book models.BookDetail
	//filter := bson.M{"_id": bson.M{"$eq": idhex}}
	r.Bind(&book)
	if book.Name == "" || book.BookGenresID == nil ||
		book.BookAuthorID == primitive.NilObjectID || book.BookDescription == "" ||
		book.BookImage == "" || book.BookIntances.BookPrice == 0 {
		r.String(http.StatusBadRequest, "Invalid event format (i.e. JSON parse error) or incorrect event structure")
		return
	}
	var bookinsertbook models.BookCreateBook
	bookinsertbook.Init(book)
	collection := a.Db.Db.Collection("books")
	result, err := collection.InsertOne(context.TODO(), bookinsertbook)
	if err != nil {
		r.Status(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	newID := fmt.Sprintf("%v", result.InsertedID)
	newID = newID[10 : len(newID)-2]
	fmt.Println(newID)
	idhex, err := primitive.ObjectIDFromHex(newID)
	if err != nil {
		fmt.Println(err)
		r.Status(http.StatusInternalServerError)
		return
	}
	var bookintance models.BookIntancesCreate
	bookintance.Init(book, idhex)
	collection = a.Db.Db.Collection("bookinstances")
	result, err = collection.InsertOne(context.TODO(), bookintance)
	if err != nil {
		r.Status(http.StatusInternalServerError)
		fmt.Println(err)
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
	r.JSON(200, gin.H{"bookID": newID})

}
