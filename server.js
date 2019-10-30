const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

// Routes
const UserRouter = require('./controllers/User');

// Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use('/', UserRouter)


app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'))

app.listen(process.env.PORT || 3000, () => console.log('service started.'))