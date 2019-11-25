import chai from "chai";
import chaiHTTP from "chai-http";
import UserModel from "../models/User";
import app from "../server";

chai.use(chaiHTTP);
chai.should();

let jwt = "";

after(async () => {
  try {
    console.log("After user tests! deleting users that remain.");
    await UserModel.findOneAndRemove({
      email: "testemail2@gmail.com",
    }).exec();
  } catch (error) {
    console.error(error);
  }
});

describe("Users", () => {
  it("Should create user", (done) => {
    chai.request(app)
      .post("/create-user")
      .send({
        password: "testpassword123",
        email: "testemail2@gmail.com",
        school: "De Anza",
        gender: "other",
        name: "test bot",
      }).end((err, res) => {
        if (err) { console.error(err); }
        jwt = res.body.token;
        done();
      });
  });
  it("Should log user in", (done) => {
    chai.request(app)
      .post("/login-user")
      .send({
        password: "testpassword123",
        email: "testemail2@gmail.com",
      }).end((err, res) => {
        if (err) { console.error(err); }
        res.should.have.status(200);
        res.body.should.be.a("object");
        jwt = res.body.token;
        done();
      });
  });
  it("Should fail to log user in", (done) => {
    chai.request(app)
      .post("/login-user")
      .send({
        password: "badpassword123",
        email: "testemail2@gmail.com",
      }).end((err, res) => {
        if (err) { console.error(err); }
        res.should.have.status(401);
        done();
      });
  });

  it("Should update an authenticated user", async (done) => {
    chai.request(app).put("/update-user")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ name: "@testbotupdated" })
      .end((err, res) => {
        if (err) { console.log(err); }
        res.should.have.status(200);
      });
    done();
  });

  it("Should get the user profile", async (done) => {
    chai.request(app).get("/get-me-user")
      .set("Authorization", `Bearer ${jwt}`)
      .end((err, res) => {
        if (err) { console.log(err); }
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });

  it("Should delete a user profile", async (done) => {
    chai.request(app).delete("/delete-user")
      .set("Authorization", `Bearer ${jwt}`)
      .end((err, res) => {
        if (err) { console.log(err); }
        res.should.have.status(202);
      });
    done();
  });
});
