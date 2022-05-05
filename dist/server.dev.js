"use strict";

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var port = process.env.PORT || 3000; // Set the view engine for the express app

app.set("view engine", "pug"); // for parsing application/json

app.use(bodyParser.json()); // for parsing application/xwww-

app.use(bodyParser.urlencoded({
  extended: true
})); //form-urlencoded
// Database

var Pool = require('pg').Pool;

var connectionParams = null;

if (process.env.DATABASE_URL != null) {
  connectionParams = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  connectionParams = {
    user: 'api_user',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432
  };
}

console.log(connectionParams);
var pool = new Pool(connectionParams);
app.get('/', function (req, res) {
  console.log('Accept: ' + req.get('Accept'));
  pool.query('SELECT VERSION()', function (err, version_results) {
    console.log(err, version_results.rows);
    pool.query('SELECT * FROM team_members', function (err, team_members_results) {
      console.log(err, team_members_results);
      res.render('index', {
        teamNumber: 5,
        databaseVersion: version_results.rows[0].version,
        teamMembers: team_members_results.rows
      });
      console.log('Content-Type: ' + res.get('Content-Type'));
    });
  });
});
app.post('/', body('first_name').isAlpha().isLength({
  min: 1
}).withMessage('must be valid'), body('last_name').isAlpha().isLength({
  min: 0
}).withMessage('must be valid'), function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array()
    });
  }

  pool.query("INSERT INTO team_members (first_name, last_name) VALUES ('".concat(req.body.first_name, "', '").concat(req.body.last_name, "')"), function (err, result) {
    console.log(err, result);
    res.redirect('/');
  });
});
module.exports = app;
//# sourceMappingURL=server.dev.js.map
