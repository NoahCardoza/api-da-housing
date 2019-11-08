const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server');
const { UserModel } = require('../models/User');

chai.use(chaiHTTP);
chai.should();

