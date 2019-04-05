/*
 * Customer Database API
 * Copyright (c) 2018 Luca J
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const express = require('express');

/**
 * Module variables.
 * @private
 */

const router = express.Router();

/**
 * Module exports.
 * @private
 */

module.exports = router;

/*
 * Data Model
 */

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

/*
 * HTTP GET /api/courses
 */

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {

  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send('course not found!');
  } else {
    res.send(course);
  }
});

/*
 * HTTP POST /api/courses
 */

router.post('/', (req, res) => {

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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

