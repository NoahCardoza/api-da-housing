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

before(async () => {
  try {
    console.log('before team tests.');
    const user = new UserModel({
      password: 'testpassword123',
      email: 'testemailteam@gmail.com',
      school: 'De Anza',
      gender: 'other',
      name: 'test bot',
    });
    const fakeTeamMember = new UserModel({
      password: 'testpassword123',
      email: 'testemailteamfakemember@gmail.com',
      school: 'De Anza',
      gender: 'other',
      name: 'test bot',
    });
    await user.save();
    await fakeTeamMember.save();
    usertestingID = user._id;
    const listing = new ListingModel({
      author: user._id,
      name: '@testhouserecordteam',
      price: 1500,
      description: 'This is a test description!',
      address: {
        street: 'El Camino Street',
        city: 'Mountain View',
        zipcode: 94040,
      },
    });
    await listing.save();
    testlistingID = listing._id;
    const team = new TeamModel({
      name: '@testteamrecord',
      members: [`${usertestingID}`],
      budget: 3400,
      favorites: [{
        source: `${testlistingID}`,
        name: 'testhousenamelisting',
        comments: ['beautiful', 'is that near de anza?', 'gorgeousss!!!!!'],
      }],
    });
    await team.save();
    teamtestingID = team._id;
  } catch (error) {
    console.log(error.message);
  }
});

after(async () => {
  try {
    console.log('After tests!');
    console.log('Deleting teams!');
    await UserModel.findOneAndRemove({
      email: 'testemailteam@gmail.com',
    }).exec();
    await UserModel.findOneAndRemove({
      email: 'testemailteamfakemember@gmail.com',
    }).exec();
    console.log('Deleting test Listings!');
    await ListingModel.deleteMany({
      name: '@testhouserecordteam',
    }).exec();
    await TeamModel.deleteMany({
      name: '@testteamrecord',
    }).exec();
  } catch (error) {
    console.log(error.message);
  }
});

describe('Teams', () => {
  // user related but needed for next requests
  it('Should get token', (done) => {
    try {
      chai.request(app).post('/login-user').send({
        password: 'testpassword123',
        email: 'testemailteam@gmail.com',
      }).end((error, res) => {
        if (error) console.log(error.message);
        jwt = res.body.token;
        done();
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should get a token for the fake member', (done) => {
    try {
      chai.request(app).post('/login-user').send({
        password: 'testpassword123',
        email: 'testemailteamfakemember@gmail.com',
      })
        .end((error, res) => {
          if (error) console.log(error.message);
          fakeTeamMemberJWT = res.body.token;
          done();
        });
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should get a team by ID for member', async (done) => {
    try {
      chai.request(app)
        .get(`/team/${teamtestingID}`)
        .set('Authorization', `Bearer ${jwt}`)
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Creates a Team record.', (done) => {
    try {
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
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should update a Team by ID', async (done) => {
    try {
      chai.request(app).put(`/team/update-team/${teamtestingID}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          budget: 4000,
        })
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.budget.should.be.eql(4000);
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should add a favorite Listing to a Team Favorite Section', async (done) => {
    try {
      chai.request(app).put(`/team/add-favorite/${teamtestingID}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          source: testlistingID,
          name: 'testteamnamelistingfavorite',
        })
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(204);
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should delete a team favorite.', async (done) => {
    try {
      chai.request(app).put(`/team/delete-favorite/${teamtestingID}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          source: testlistingID,
        })
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(204);
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should make a member leave a team and delete the team if they are the last member.', async (done) => {
    try {
      chai.request(app).put(`/team/leave-team/${teamtestingID}`)
        .set('Authorization', `Bearer ${fakeTeamMemberJWT}`)
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(204);
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });

  it('Should delete a team.', async (done) => {
    try {
      chai.request(app).delete(`/team/${teamtestingID}`)
        .set('Authorization', `Bearer ${jwt}`)
        .end((error, res) => {
          if (error) console.log(error.message);
          res.should.have.status(202);
        });
      done();
    } catch (error) {
      console.log(error.message);
    }
  });
});
