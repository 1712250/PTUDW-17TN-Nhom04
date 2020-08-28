package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Book for save info book
type Book struct {
	ID              primitive.ObjectID `json:"idBook" bson:"_id" `
	Name            string             `json:"bookName" bson:"title"`
	BookDescription string             `json:"bookDescription" bson:"description"`
	BookImage       string             `json:"bookImage" bson:"image_url"`
}

//BookIntances for save info book
type BookIntances struct {
	BookPrice    float32 `json:"bookPrice" bson:"price"`
	BookDiscount float32 `json:"bookDiscount" bson:"discount"`
	BookCount    int     `json:"bookCount" bson:"count"`
	BookSold     int     `json:"bookSold" bson:"sold"`
	BookLanguage string  `json:"bookLanguage" bson:"language"`
	BookStatus   string  `json:"bookStatus" bson:"status"`
}

//Genres for genres
type Genres struct {
	Name     string `bson:"name" json:"name"`
	Category string `bson:"category" json:"category"`
}

//BookDetail for save info book
type BookDetail struct {
	ID              primitive.ObjectID   `json:"idBook" bson:"_id" `
	Name            string               `json:"bookName" bson:"title"`
	BookGenres      []Genres             `json:"bookGenres"`
	BookGenresID    []primitive.ObjectID `bson:"genres"`
	BookAuthor      string               `json:"bookAuthor" bson:"name"`
	BookAuthorID    primitive.ObjectID   `bson:"author"`
	BookDescription string               `json:"bookDescription" bson:"description"`
	BookRating      float32              `json:"bookRate"`
	BookIntances    BookIntances         `json:"bookIntances"`
	BookImage       string               `json:"bookImage" bson:"image_url"`
}
