const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const UserModel = require('../models/User');

chai.use(chaiHTTP);
chai.should();

let jwtToken = '';

const fakeUserObject = Object.freeze({
  password: 'testpassword123',
  email: 'testemail2@gmail.com',
  school: 'De Anza',
  gender: 'other',
  name: 'test bot',
});

const fakeUserHelperObject = Object.freeze({
  BAD_PASSWORD: 'fakebadpassword123',
  UPDATED_NAME: '@testbotupdated',
});

after(async () => {
  try {
    console.log('Post-Processing for User Test: Deleting Mock Users \n');
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
      .post('/user')
      .send(fakeUserObject).end((error, res) => {
        if (error) console.error(error.message);
        jwtToken = res.body.token;
        done();
      });
  });
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
        jwtToken = res.body.token;
        done();
      });
  });
  it('Should fail to log user in', (done) => {
    chai.request(app)
      .post('/auth/login')
      .send({
        password: fakeUserHelperObject.BAD_PASSWORD,
        email: fakeUserObject.email,
      }).end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(401);
        done();
      });
  });

  it('Should update an authenticated user', async (done) => {
    chai.request(app).put('/user')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: fakeUserHelperObject.UPDATED_NAME,
      })
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
      });
    done();
  });

  it('Should get the user profile', async (done) => {
    chai.request(app).get('/user')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
    done();
  });

  it('Should delete a user profile', async (done) => {
    chai.request(app).delete('/user')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((error, res) => {
        if (error) console.error(error.message);
        res.should.have.status(202);
      });
    done();
  });
});
