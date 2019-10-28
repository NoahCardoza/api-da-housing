const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();

var passport   		= require("passport"),
	LocalStrategy   = require("passport-local"),
	methodOverride  = require("method-override"),
	Listing 		= require("./models/Listing");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// requiring routes
var listingRoutes = require("./controllers/listings");
const UserRouter = require('./controllers/User');

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use('/', UserRouter)

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Yusuf is the Best!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'))
app.use("/listings", listingRoutes);


app.listen(process.env.PORT || 3000, () => console.log('service started.'))