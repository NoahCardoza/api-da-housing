const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const UserModel = require('../models/User');

chai.use(chaiHTTP);
chai.should();

let jwt = '';

const fakeUserObject = Object.freeze({
  password: 'testpassword123',
  email: 'testemail2@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const fakeUserHelperObject = Object.freeze({
  badPassword: 'fakebadpassword123',
});

after(async () => {
  try {
    console.log('After user tests! deleting users that remain.');
    await UserModel.findOneAndRemove({
      email: fakeUserObject.email,
    }).exec();
  } catch (error) {
    console.error(error.message);
  }
});

describe('Users', () => {
  it('Should create user', (done) => {
    chai.request(app)
      .post('/create-user')
      .send(fakeUserObject).end((error, res) => {
        if (error) console.error(error.message);
        jwt = res.body.token;
        done();
      });
  });
  it('Should log user in', (done) => {
    chai.request(app)
      .post('/login-user')
      .send({
        password: fakeUserObject.password,
        email: fakeUserObject.email,
      }).end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
        res.body.should.be.a('object');
        jwt = res.body.token;
        done();
      });
  });
  it('Should fail to log user in', (done) => {
    chai.request(app)
      .post('/login-user')
      .send({
        password: 'fakebadpassword123',
        email: fakeUserObject.email,
      }).end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(401);
        done();
      });
  });

  it('Should update an authenticated user', async (done) => {
    chai.request(app).put('/update-user')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        name: '@testbotupdated',
      })
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
      });
    done();
  });

  it('Should get the user profile', async (done) => {
    chai.request(app).get('/get-me-user')
      .set('Authorization', `Bearer ${jwt}`)
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
    done();
  });

  it('Should delete a user profile', async (done) => {
    chai.request(app).delete('/delete-user')
      .set('Authorization', `Bearer ${jwt}`)
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(202);
      });
    done();
  });
});