"use strict";

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var port = process.env.PORT || 5000; //View Engine

app.set("view engine", "pug"); //parse app

app.use(bodyParser.json()); //parse xww-app

app.use(bodyParser.urlencoded({
  extended: true
})); //Database

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
        teamNumber: 3,
        databaseVersion: version_results.rows[0].version,
        teamMembers: team_members_results.rows
      });
      console.log('Content-Type: ' + res.get('Content-Type'));
    });
  });
});
module.exports = app;
//# sourceMappingURL=server.dev.js.map
