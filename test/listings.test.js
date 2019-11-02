const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');

chai.use(chaiHTTP);
chai.should();

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
