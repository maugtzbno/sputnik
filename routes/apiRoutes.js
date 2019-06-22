var db = require("../models");
var quandl = require("./quandl.js");

module.exports = function(app) {
  // Get monthly returns for a stock
  app.get("/api/axios/:ticker", function(req, res) {
    ticker = req.params.ticker;
    quandl.get(ticker, function(data) {
      res.json(data);
    });
  });

  // Get all ETF monthly returns
  app.get("/api/allreturns", function(req, res) {
    db.ETFS.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
