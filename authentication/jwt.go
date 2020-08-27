package authentication

import (
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

//Authorization for Authorization user
type Authorization struct {
	jwtKey []byte
}

//Claims for generate JWT
type Claims struct {
	ID string `json:"userid"`
	jwt.StandardClaims
}

//Init to Init authen
func (a *Authorization) Init() {
	a.jwtKey = []byte("zFul89YRnuFyS7ywlGeXatax4NiKs2hQ")
}

//NewJWT to create new JWT
func (a *Authorization) NewJWT(uid string) (string, error) {
	expirationTime := time.Now().Add(30 * time.Minute)
	claims := &Claims{
		ID: uid,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}
	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(a.jwtKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		return "", err
	}
	return tokenString, nil
	// Finally, we set the client cookie for "token" as the JWT we just generated
	// we also set an expiry time which is the same as the token itself
}

//CheckToken check the token is invalid
func (a *Authorization) CheckToken(token string) (string, error) {
	// Initialize a new instance of `Claims`
	claims := &Claims{}

	// Parse the JWT string and store the result in `claims`.
	// Note that we are passing the key in this method as well. This method will return an error
	// if the token is invalid (if it has expired according to the expiry time we set on sign in),
	// or if the signature does not match
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return a.jwtKey, nil
	})
	if err != nil {
		return "", err
	}
	if !tkn.Valid {
		return "", jwt.ErrSignatureInvalid
	}

	// Finally, return the welcome message to the user, along with their
	// username given in the token
	return claims.ID, nil
}
