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
 * Http Routes
 */

router.get('/', (req, res) => {
  res.render('index', { title: 'My Express App', message: 'Hello, World!'});
});

router.get('/api/posts/:year/:month', (req, res) => {
 res.send([req.params, req.query]);
});

