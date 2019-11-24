import chai from "chai";
import chaiHTTP from "chai-http";
import UserModel from "../models/User";
import TeamModel from "../models/Team";
import ListingModel from "../models/Listing";
import app from "../server";

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
            email: "testemailteam@gmail.com",
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
        await team.save();
        teamtestingID = team._id;
    } catch (err) {
        console.error(err);
    }
});

after(async () => {
    try {
        console.log("After tests!");
        console.log("Deleting teams!");
        await UserModel.findOneAndRemove({
            email: "testemailteam@gmail.com",
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

describe("Teams", () => {
    // user related but needed for next requests
    it("Should get token", (done) => {
        chai.request(app).post("/login-user").send({
            password: "testpassword123",
            email: "testemailteam@gmail.com",
        })
            .then((res) => {
                jwt = res.body.token;
                done();
            });
    });

    it("Should get a team by ID for member", async (done) => {
        chai.request(app)
            .get(`/get-listing/${testlistingID}`)
            .set("Authorization", `Bearer ${jwt}`)
            .end((err, res) => {
                if (err) { console.log(err); }
                res.should.have.status(200);
                res.body.should.be.a("object");
            });
        done();
    });
});
