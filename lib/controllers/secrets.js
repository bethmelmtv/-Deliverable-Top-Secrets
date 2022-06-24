const { Router } = require('express');
const Secrets = require('../models/Secrets');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const secrets = await Secrets.getSecrets();
    res.json(secrets);
  } catch (error) {
    next(error);
  }
});
