package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Category for save info book
type Category struct {
	ID       primitive.ObjectID `json:"idCategory" bson:"_id" `
	Name     string             `json:"categoryName" bson:"name"`
	Category string             `json:"category" bson:"category"`
}

//CategoryInsert for save info book
type CategoryInsert struct {
	Name     string `json:"categoryName" bson:"name"`
	Category string `json:"category" bson:"category"`
}
