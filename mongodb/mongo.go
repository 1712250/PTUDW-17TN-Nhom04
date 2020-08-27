package mongodb

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//Mongo for MongoDB
type Mongo struct {
	Db *mongo.Client
}

//Connect for connect to db
func (a *Mongo) Connect() error {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb+srv://lhvubtqn@freecluster-dhj34.mongodb.net/Obooks?replicaSet=FreeCluster-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1&3t.uriVersion=3&3t.connection.name=FreeCluster-shard-0&3t.databases=Obooks,admin")

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		fmt.Println(err)
		return err
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		fmt.Println(err)
		return err
	}

	fmt.Println("Connected to MongoDB!")
	return nil
}
