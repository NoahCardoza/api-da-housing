const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const UserModel = require('../models/User');

const fakeUserObject = Object.freeze({
  password: 'testauthpassword123',
  email: 'testemailauth2@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const helperObject = Object.freeze({
  BAD_PASSWORD: 'fakebadpassword123',
});

before(async () => {
  try {
    console.log('Pre-Processing for Auth Test: Creating Mock Data');
    const user = new UserModel(fakeUserObject);
    await user.save();
  } catch (error) {
    console.error(error.message);
  }
});

after(async () => {
  try {
    console.log('Post-Processing for Auth Test: Deleting Mock Data');
    await UserModel.findOneAndRemove({
      email: fakeUserObject.email,
    }).exec();
  } catch (error) {
    console.error(error.message);
  }
});

describe('Auth', () => {
  it('Should log user in', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({
        password: fakeUserObject.password,
        email: fakeUserObject.email,
      }).end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('Should fail to log user in', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({
        password: helperObject.BAD_PASSWORD,
        email: fakeUserObject.email,
      }).end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(401);
        done();
      });
  });
});
