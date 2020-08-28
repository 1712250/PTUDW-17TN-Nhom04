package models

import (
	"time"

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

//BookCreateBook for save info book
type BookCreateBook struct {
	Name            string               `json:"bookName" bson:"title"`
	BookGenresID    []primitive.ObjectID `bson:"genres"`
	BookAuthorID    primitive.ObjectID   `bson:"author"`
	BookDescription string               `json:"bookDescription" bson:"description"`
	BookRating      float32              `json:"bookRate" bson:"rating"`
	BookImage       string               `json:"bookImage" bson:"image_url"`
	V               int                  `bson:"__v"`
}

//Init for
func (a *BookCreateBook) Init(b BookDetail) {
	a.Name = b.Name
	a.BookGenresID = b.BookGenresID
	a.BookAuthorID = b.BookAuthorID
	a.BookDescription = b.BookDescription
	a.BookRating = b.BookRating
	a.BookImage = b.BookImage
	a.V = 0
}

//BookIntancesCreate for save info book
type BookIntancesCreate struct {
	BookPrice    float32            `json:"bookPrice" bson:"price"`
	BookDiscount float32            `json:"bookDiscount" bson:"discount"`
	BookCount    int                `json:"bookCount" bson:"count"`
	BookSold     int                `json:"bookSold" bson:"sold"`
	BookLanguage string             `json:"bookLanguage" bson:"language"`
	BookStatus   string             `json:"bookStatus" bson:"status"`
	BookID       primitive.ObjectID `bson:"book"`
	AddedDate    time.Time          `json:"added_date"`
	V            int                `bson:"__v"`
}

//Init for
func (a *BookIntancesCreate) Init(b BookDetail, bookid primitive.ObjectID) {
	a.BookPrice = b.BookIntances.BookPrice
	a.BookDiscount = b.BookIntances.BookDiscount
	a.BookCount = b.BookIntances.BookCount
	a.BookSold = b.BookIntances.BookSold
	a.BookLanguage = b.BookIntances.BookLanguage
	a.BookStatus = b.BookIntances.BookStatus
	a.BookID = bookid
	a.AddedDate = time.Now()
	a.V = 0
}
