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

const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');

/**
 * App variables.
 * @private
 */

const port = process.env.PORT || 3000;
const app = express();

/*
 * Middleware Functions
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(helmet());

console.log(`${process.env.NODE_ENV}`);
console.log(`${app.get('env')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled');
}

app.use(logger);

app.use( (req, res, next) => {
  console.log('Authenticating...');
  next();
});

/*
 * Data Model
 */

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

/*
 * HTTP GET
 */

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {

  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send('course not found!');
  } else {
    res.send(course);
  }
});

app.get('/api/posts/:year/:month', (req, res) => {
 res.send([req.params, req.query]);
});

/*
 * HTTP POST /api/courses
 */

app.post('/api/courses', (req, res) => {

  // create a schema for to validate user input
  const schema = {
    name: Joi.string().min(3).required()
  };

  // store the result of validation
  const result = Joi.validate(req.body, schema);

  // handle invalid user input
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course);
});

/*
 * HTTP PUT /api/courses/:id
 */

app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // if not exists, return 404
  const course = courses.find(course => course.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send('Course not found!');
  }

  // Validate new course input
  // if invalid, return 400 - Bad Request
  const result = validateCourse(req.body);
  // using object destructoring to access error property directly
  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(result.error.details[0].message);
  }

  // Update course
  // Return the updated course object
  course.name = req.body.name;
  res.send(course);
});

/*
 * HTTP DELETE /api/courses/:id
 */

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  // if not exists return 404
  const course = courses.find(course => course.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send('Course not found!');
  }

  // Delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // return the deleted course
  res.send(course);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

/**
 * Validate user input with the Joi package and return the validation result.
 *
 * @param {object} course object, structured according to the schema variable
 * @return {object} javascript object that contains the validation results
 * @private
 */

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);
}
