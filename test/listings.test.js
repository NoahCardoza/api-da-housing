const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const ListingModel = require('../models/Listing');
const UserModel = require('../models/User');

chai.use(chaiHTTP);
chai.should();

let jwt = '';
let testlistingID = '';
let usertestingid = '';

const fakeUserObject = Object.freeze({
  password: 'testpassword123',
  email: 'testemail@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const fakeListingObject = (userID) => Object.freeze({
  author: userID,
  name: '@testhouserecord',
  price: 1500,
  description: 'This is a test description!',
  address: {
    street: 'El Camino Street',
    city: 'Mountain View',
    zipcode: 94040,
  },
});

const fakeListingHelperObject = Object.freeze({
  UPDATED_DESCRIPTION: '@updated',
  LISTING_WITHOUT_USER_ID: {
    name: '@testhouserecord',
    price: 1500,
    description: 'This is a test description!',
    address: {
      street: 'El Camino Street',
      city: 'Mountain View',
      zipcode: 94040,
    },
  },
});

before(async () => {
  try {
    console.log('Pre-Processing for Listings Test: Creating Fake User and Listing. \n');
    const user = new UserModel(fakeUserObject);
    await user.save();
    usertestingid = user._id;
    const newListing = new ListingModel(fakeListingObject(usertestingid));
    await newListing.save();
    testlistingID = newListing._id;
  } catch (error) {
    console.log(error.message);
  }
});

after(async () => {
  try {
    console.log('Post-Processing for Listings Test: Deleting Fake User and Fake Listings \n');
    await UserModel.findOneAndRemove({
      email: fakeUserObject.email,
    }).exec();
    await ListingModel.deleteMany({
      name: fakeListingObject(usertestingid).name,
    }).exec();
  } catch (error) {
    console.log(error.message);
  }
});

describe('Listings', () => {
  it('Should get all Listings records.', (done) => {
    chai.request(app)
      .get('/listing')
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  // user related but needed for next requests
  it('Should get token', (done) => {
    chai.request(app).post('/auth/login').send({
      password: fakeUserObject.password,
      email: fakeUserObject.email,
    })
      .then((res) => {
        jwt = res.body.token;
        done();
      });
  });

  it('Creates a Listing record.', (done) => {
    chai.request(app)
      .post('/create-listing')
      .set('Authorization', `Bearer ${jwt}`)
      .send(fakeListingHelperObject.LISTING_WITHOUT_USER_ID)
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.name.should.be.eql('@testhouserecord');
      });
    done();
  });

  it('Should get a listing by ID', async (done) => {
    chai.request(app)
      .get(`/get-listing/${testlistingID}`)
      .set('Authorization', `Bearer ${jwt}`)
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
    done();
  });

  it('Should update a listing by ID', async (done) => {
    chai.request(app).put(`/update-listing/${testlistingID}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        description: fakeListingHelperObject.UPDATED_DESCRIPTION,
      })
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(204);
      });
    done();
  });

  it('Should delete a listing by ID', async (done) => {
    chai.request(app).delete(`/delete-listing/${testlistingID}`)
      .set('Authorization', `Bearer ${jwt}`)
      .end((error, res) => {
        if (error) console.log(error.message);
        res.should.have.status(202);
      });
    done();
  });
});
