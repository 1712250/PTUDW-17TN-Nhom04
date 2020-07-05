const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body-parser
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/index");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "static")));

// config authentication, database, mailing
require("./config/authentication")(app);
require("./config/database");
require("./config/mail");

// routers
const ApiRouter = require("./apis/index");
const ViewRouter = require("./routes/index");
app.use("/", ViewRouter);
app.use("/api", ApiRouter);

// start app
app.listen(PORT, () => {
	console.log(`Server is up and running at port ${PORT}!`);
});
