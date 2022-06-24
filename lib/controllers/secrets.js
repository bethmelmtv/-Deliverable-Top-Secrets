const { Router } = require('express');
const Secrets = require('../models/Secrets.js');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const secrets = await Secrets.getSecrets();
    res.json(secrets);
  } catch (error) {
    next(error);
  }
});
