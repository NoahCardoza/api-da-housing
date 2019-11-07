const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const ListingModel = require('../models/Listing');

chai.use(chaiHTTP);
chai.should();

before(async () => {
  console.log('Before tests!');
});

after(async () => {
  console.log('After tests!');
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
});