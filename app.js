const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/index");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "static")));

// Body-parser
app.use(express.json());

// database
require("./database");

// error handler
app.use("**", (req, res, next, err) => {
	if (err) {
		res.send(err.message);
		console.log(err);
	} else {
		next();
	}
});

// routers
const ApiRouter = require("./apis/index");
const ViewRouter = require("./routes/index");
app.use("**", (req, res, next) => {
	res.locals.loggedIn = req.headers.cookie != undefined;
	next();
});
app.use("/", ViewRouter);
app.use("/api", ApiRouter);

// start app
app.listen(PORT, () => {
	console.log(`Server is up and running at port ${PORT}!`);
});
