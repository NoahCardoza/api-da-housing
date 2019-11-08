const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const {
  UserModel,
} = require('../models/User');

chai.use(chaiHTTP);
chai.should();

let jwt = '';

after(async () => {
  try {
    console.log('After user tests! deleting users that remain.');
    await UserModel.findOneAndRemove({
      email: 'testemail2@gmail.com',
    }).exec();
  } catch (error) {
    console.error(error);
  }
});

describe('Users', () => {
  it('Should create user', (done) => {
    chai.request(app)
      .post('/create-user')
      .send({
        password: 'testpassword123',
        email: 'testemail2@gmail.com',
        school: 'De Anza',
        gender: 'other',
        name: 'test bot',
      }).end((err, res) => {
        if (err) console.error(err);
        jwt = res.body.token;
        done();
      });
  });
  it('Log user in', (done) => {
    chai.request(app)
      .post('/login-user')
      .send({
        password: 'testpassword123',
        email: 'testemail2@gmail.com',
      }).end((err, res) => {
        if (err) console.error(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        jwt = res.body.token;
        done();
      });
  });

  // it('Should delete a listing by ID', async (done) => {
  //   chai.request(app).delete('/delete-listing/')
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .end((err, res) => {
  //       if (err) console.log(err);
  //       res.should.have.status(202);
  //     });
  //   done();
  // });
});
