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
        const team = new TeamModel({
            name: "@testteamrecord",
            members: [usertestingID],
            budget: 3400,
            favorites: [{ source: testlistingID, name: "testhousenamelisting", comments: ["beautiful", "is that near de anza?", "gorgeousss!!!!!"] }]
        });
    } catch (err) {
        console.error(err);
    }
});

after(async () => {
    try {
        console.log("After tests!");
        console.log("Deleting test users!");
        await UserModel.findOneAndRemove({
            email: "testemail@gmail.com",
        }).exec();
        console.log("Deleting test Listings!");
        await ListingModel.deleteMany({
            name: "@testhouserecord",
        }).exec();
        await TeamModel.deleteMany({
            name: "@testteamrecord"
        }).exec();
    } catch (err) {
        console.error(err);
    }
});

//   const TeamSchema: Schema = new mongoose.Schema({
//     name: {
//       type: String,
//       required: true,
//     },
//     members: {
//       type: [mongoose.Schema.Types.ObjectId],
//       required: true,
//     },
//     budget: Number,
//     favorites: [{
//       source: {
//         required: true,
//         type: [mongoose.Schema.Types.ObjectId],
//       },
//       name: {
//         required: true,
//         type: String,
//       },
//       comments: [String],
//     }],
//     outsideFavorites: [{
//       source: {
//         required: true,
//         type: String,
//       },
//       name: {
//         required: true,
//         type: String,
//       },
//       comments: [String],
//     }],
//   });
