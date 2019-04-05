/*
 * Customer Database API
 * Copyright (c) 2018 Luca J
 * Licensed under the MIT license.
 */

'use strict';

/**
 * App dependencies.
 * @private
 */

const Joi = require('joi');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./middleware/logger');
const homeRouter = require('./routes/home');
const coursesRouter = require('./routes/courses');

/**
 * App variables.
 * @private
 */

const port = process.env.PORT || 4567;
const app = express();

/*
 * App middleware functions.
 * @private
 */


app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', coursesRouter);  // use external route file
app.use('/', homeRouter);

app.set('view engine', 'pug');
app.set('views', './views');   // default

/**
 * App configuration.
 * @private
 */

try {
  console.log('Application Name: ' + config.get('name'));
  console.log('Mail Server: ' + config.get('mail.host'));
  console.log('Mail Password: ' + config.get('mail.password'));
} catch (warning) {
  console.log('Warning: Mail password environment variable is not set.');
}

try {
  const test = config.get('debugmode');
} catch (warning) {
  console.log('Warning: \'DEBUG\' mode environment variable is not set.');
}

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Environment: ${app.get('env')}`);

if (app.get('env') === 'development') {
  app.use(morgan('common'));
  console.log('Morgan enabled');
  startupDebugger('Morgan enabled');
}

app.use(logger);
app.use( (req, res, next) => {
  console.log('Authenticating...');
  next();
});

// database config
dbDebugger('Connected to the database...');

/*
 * Http Server
 */

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

