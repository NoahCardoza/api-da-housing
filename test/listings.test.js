const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const ListingModel = require('../models/Listing');
const UserModel = require('../models/User');

chai.use(chaiHTTP);
chai.should();

let jwt = '';
let testlistingID = '';

before(async () => {
  try {
    console.log('Before tests!');
    const user = new UserModel({
      password: 'testpassword123',
      email: 'testemail@gmail.com',
      school: 'De Anza',
      gender: 'other',
      name: 'test bot',
    });
    await user.save();
    const newListing = new ListingModel({
      author: user._id,
      name: '@testhouserecord',
      price: 1500,
      description: 'This is a test description!',
      address: {
        street: 'El Camino Street',
        city: 'Mountain View',
        zipcode: 94040,
      },
    });
    await newListing.save();
    testlistingID = newListing._id;
  } catch (err) {
    console.error(err);
  }
});

after(async () => {
  try {
    console.log('After tests!');
    console.log('Deleting test users!');
    await UserModel.findOneAndRemove({
      email: 'testemail@gmail.com',
    }).exec();
    console.log('Deleting test Listings!');
    await ListingModel.deleteMany({
      name: '@testhouserecord',
    }).exec();
  } catch (err) {
    console.error(err);
  }
});

describe('Listings', () => {
  it('Should get all Listings records.', (done) => {
    chai.request(app)
      .get('/listing')
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  // user related but needed for next requests
  it('Should get token', (done) => {
    chai.request(app).post('/login-user').send({
      password: 'testpassword123',
      email: 'testemail@gmail.com',
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
      .send({
        name: '@testhouserecord',
        price: 1500,
        description: 'This is a test description!',
        address: {
          street: 'El Camino Street',
          city: 'Mountain View',
          zipcode: 94040,
        },
      })
      .end((err, res) => {
        if (err) console.log(err);
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
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
    done();
  });

  it('Should update a listing by ID', async (done) => {
    chai.request(app).put(`/update-listing/${testlistingID}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        description: '@updated',
      })
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(204);
      });
    done();
  });

  it('Should delete a listing by ID', async (done) => {
    chai.request(app).delete(`/delete-listing/${testlistingID}`)
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(202);
      });
    done();
  });
});
