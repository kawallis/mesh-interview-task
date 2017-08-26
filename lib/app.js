const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser());

const github = require('./routes/github');

app.use('/api/githubPayload', github);

module.exports = app;