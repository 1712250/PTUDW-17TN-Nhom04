const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const MongoStore = require("connect-mongo")(session);
const User = require("../models/User");
const { validPassword } = require("../utils/hashing");

const jwtStrategy = new JwtStrategy(
	{
		secretOrKey: process.env.SECRET,
		jwtFromRequest: ExtractJwt.fromHeader("ETag"),
	},
	function (jwt_payload, done) {
		console.log(jwt_payload);
	}
);

const localStrategy = new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
	},
	(username, password, done) => {
		User.findOne({ email: username })
			.then((user) => {
				if (user) {
					if (!validPassword(password, user.password)) {
						return done(null, false, {
							message: "Incorrect password.",
						});
					}
					return done(null, user);
				} else {
					return done(null, false, {
						message: "Incorrect email address",
					});
				}
			})
			.catch((err) => {
				return done(err);
			});
	}
);

module.exports = function (app) {
	app.use(
		session({
			store: new MongoStore({
				mongooseConnection: mongoose.connection,
				collection: "sessions",
			}),
			secret: process.env.SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
			},
		})
	);
	passport.use(localStrategy);
	passport.use(jwtStrategy);
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
	passport.deserializeUser((_id, done) => {
		User.findById(_id)
			.then((user) => {
				done(null, user);
			})
			.catch((err) => {
				done(err);
			});
	});
	app.use(passport.initialize());
	app.use(passport.session());
	app.use("/", (req, res, next) => {
		res.locals.user = req.user;
		next();
	});
};
