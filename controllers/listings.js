var express	   = require("express"),
 	router 	   = express.Router(),
 	Listing = require("../models/Listing"), 
 	middleware = require("../middleware");

// INDEX route - show all listings
router.get("/", function(req, res){
	//get Listing from DataBase
	Listing.find({},function(err, allListings){
		if(err){
			console.log(err);
		} else {
			res.render("/", {listings:allListings, currentUser: req.user});
		}
	});
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res)
{
	//get data from form and add to listing array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		  id: req.user._id,
          username: req.user.username
	}
	var newListing = {name: name, price: price, image: image, description: desc, author:author}
	Listing.create(newListing, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//reditect back to camground page
			res.redirect("/");
		}
	})
});

// NEW route - show form to create listing
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("listings/new");
});

// SHOW route - presents info
router.get("/:id", function(req, res){
    //find the listing with provided ID
	Listing.findById(req.params.id, function(err, foundListing){
        if(err){
            console.log(err);
        } else {
			if (!foundListing) {
            	return res.status(400).send("Item not found.")
       		}
            console.log(foundListing);
            //render show template with that listing
            res.render("listings/show", {listing: foundListing});
        }
    });
});

// EDIT listing route
router.get("/:id/edit", middleware.checkListingOwnership, function(req, res){
	Listing.findById(req.params.id, function(err, foundListing){
		if (!foundListing) {
            	return res.status(400).send("Item not found.")
       	}
		res.render("listings/edit", {listing: foundListing});
	});
});
	
// UPDATE listing route
router.put("/:id", middleware.checkListingOwnership, function(req, res){
	Listing.findByIdAndUpdate(req.params.id, req.body.listing, function(err, updateListing){
		if(err){
			res.redirect("/listings");
		} else {
			if (!updateListing) {
            	return res.status(400).send("Item not found.")
       		}
			res.redirect("/listings/" + req.params.id);
		}
	})
})

// DESTROY listing route
router.delete("/:id", middleware.checkListingOwnership, function(req, res) {
	Listing.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/listings");
		} else {
			res.redirect("/listings");
		}
	})
});

module.exports = router;