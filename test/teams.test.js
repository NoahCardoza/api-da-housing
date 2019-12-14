const chai = require('chai');
const chaiHTTP = require('chai-http');
const UserModel = require('../models/User');
const TeamModel = require('../models/Team');
const ListingModel = require('../models/Listing');
const app = require('../server');

chai.use(chaiHTTP);
chai.should();

let jwt = '';
let testlistingID = '';
let teamtestingID = '';
let fakeTeamMemberJWT = '';
let usertestingID = '';

const fakeUserObject = Object.freeze({
  password: 'testpassword123',
  email: 'testemailteam@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const fakeTeamMemberObject = Object.freeze({
  password: 'testpassword123',
  email: 'testemailteamfakemember@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const fakeListingObject = (userID) => Object.freeze({
  author: userID,
  name: '@testhouserecordteam',
  price: 1500,
  description: 'This is a test description!',
  address: {
    street: 'El Camino Street',
    city: 'Mountain View',
    zipcode: 94040,
  },
});

const fakeTeamObject = Object.freeze({
  name: '@testteamrecord',
  members: [`${usertestingID}`],
  budget: 3400,
  favorites: [{
    source: `${testlistingID}`,
    name: 'testhousenamelisting',
    comments: ['beautiful', 'is that near de anza?', 'gorgeousss!!!!!'],
  }],
});

before(async () => {
  try {
    console.log('before team tests.');
    const user = new UserModel(fakeUserObject);
    const fakeTeamMember = new UserModel(fakeTeamMemberObject);
    await user.save();
    await fakeTeamMember.save();
    usertestingID = user._id;
    const listing = new ListingModel(fakeListingObject(user._id));
    await listing.save();
    testlistingID = listing._id;
    const team = new TeamModel(fakeTeamObject);
    await team.save();
    teamtestingID = team._id;
  } catch (error) {
    console.log(error.message);
  }
});

after(async () => {
  try {
    console.log('Post Processing Deleting Users, Listings and Teams for Team Tests.');
    await UserModel.findOneAndRemove({
      email: fakeUserObject.email,
    }).exec();
    await UserModel.findOneAndRemove({
      email: fakeTeamMemberObject.email,
    }).exec();
    await ListingModel.deleteMany({
      name: fakeListingObject.name,
    }).exec();
    await TeamModel.deleteMany({
      name: fakeTeamObject.name,
    }).exec();
  } catch (error) {
    console.log(error.message);
  }
});

describe('Teams', () => {
  // user related but needed for next requests
  it('Should get token', (done) => {
    chai.request(app).post('/login-user').send({
      password: 'testpassword123',
      email: 'testemailteam@gmail.com',
    }).end((error, res) => {
      if (error) console.log(error.message);
      jwt = res.body.token;
      done();
    });
  });

  it('Should get a token for the fake member', (done) => {
    chai.request(app).post('/login-user').send({
        password: 'testpassword123',
        email: 'testemailteamfakemember@gmail.com',
      })
      .end((error, res) => {
        if (error) console.log(error.message);
        fakeTeamMemberJWT = res.body.token;
        done();
      });
  });

  // it('Should get a team by ID for member', async (done) => {
  //   chai.request(app)
  //     .get(`/team/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(200);
  //       res.body.should.be.a('object');
  //     });
  //   done();
  // });

  it('Creates a Team record.', (done) => {
    chai.request(app)
      .post('/team/create-team')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        name: '@testteamrecord',
        budget: 3400,
      })
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.name.should.be.eql('@testteamrecord');
      });
    done();
  });

  // it('Should update a Team by ID', async (done) => {
  //   chai.request(app).put(`/team/update-team/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .send({
  //       budget: 4000,
  //     })
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(204);
  //       res.body.should.be.a('object');
  //       res.body.budget.should.be.eql(4000);
  //     });
  //   done();
  // });

  // it('Should add a favorite Listing to a Team Favorite Section', async (done) => {
  //   chai.request(app).put(`/team/add-favorite/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .send({
  //       source: testlistingID,
  //       name: 'testteamnamelistingfavorite',
  //     })
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(204);
  //     });
  //   done();
  // });

  // it('Should delete a team favorite.', async (done) => {
  //   chai.request(app).put(`/team/delete-favorite/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .send({
  //       source: testlistingID,
  //     })
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(204);
  //     });
  //   done();
  // });

  // it('Should make a member leave a team and delete the team if they are the last member.', async (done) => {
  //   chai.request(app).put(`/team/leave-team/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${fakeTeamMemberJWT}`)
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(204);
  //     });
  //   done();
  // });

  // it('Should delete a team.', async (done) => {
  //   chai.request(app).delete(`/team/${teamtestingID}`)
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .end((error, res) => {
  //       if (error) console.log(error.message);
  //       res.should.have.status(202);
  //     });
  //   done();
  // });
});