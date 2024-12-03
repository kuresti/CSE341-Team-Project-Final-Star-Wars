const characterRoute = require('express').Router();

characterRoute.get(
  '/',
  // #swagger.tags = ['Characters']
  (req, res) => {
    res.sendStatus(200);
  }
);
characterRoute.get('/findByName', (req, res) => {
  res.sendStatus(200);
});
characterRoute.get('/findByAlignment', (req, res) => {
  res.sendStatus(200);
});
characterRoute.get('/:id', (req, res) => {
  res.sendStatus(200);
});
characterRoute.post('/:id', (req, res) => {
  res.sendStatus(200);
});
characterRoute.delete('/:id', (req, res) => {
  res.sendStatus(200);
});
characterRoute.put('/:id', (req, res) => {
  res.sendStatus(200);
});

module.exports = characterRoute;
