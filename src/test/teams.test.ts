import chai from "chai";
import chaiHTTP from "chai-http";
import UserModel from "../models/User";
import TeamModel from "../models/Team";
import ListingModel from "../models/Listing";

chai.use(chaiHTTP);
chai.should();
let jwt = "";
let testlistingID = "";
let teamtestingID = "";
let usertestingID = "";

before(async () => {
    try {
        console.log("before team tests.");
        const user = new UserModel({
            password: "testpassword123",
            email: "testemail@gmail.com",
            school: "De Anza",
            gender: "other",
            name: "test bot",
        });
        await user.save();
        usertestingID = user._id;
        const listing = new ListingModel({
            author: user._id,
            name: "@testhouserecord",
            price: 1500,
            description: "This is a test description!",
            address: {
                street: "El Camino Street",
                city: "Mountain View",
                zipcode: 94040,
            },
        });
        await listing.save();
        testlistingID = listing._id;
    } catch (err) {
        console.error(err);
    }
});
