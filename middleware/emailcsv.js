const json2csv = require('json2csv').parse;
var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var emailcsv = function(req, res) {
  if(req.params.id===1){
    var query = "SELECT * FROM ?? WHERE ?? = ? ";

    var table = ["user", "newsletter", 1];

    query = mysql.format(query, table);

    connection.query(query, function(err, rows) {
      if (err) {
        res.json({
          "Error": true,
          "Message": "Error executing MySQL query"
        });
      } else {
        var email_json = []
        for (var i = 0; i < rows.length; i++) {
          email_json.push({
            "email": rows[i].email
          })
        }
        const csvString = json2csv(email_json);
        res.setHeader('Content-disposition', 'attachment; filename=emails.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
      }
    });
  } else {
    var query = "SELECT * FROM ?? ";

    var table = ["user"];

    query = mysql.format(query, table);

    connection.query(query, function(err, rows) {
      if (err) {
        res.json({
          "Error": true,
          "Message": "Error executing MySQL query"
        });
      } else {
        var email_json = []
        for (var i = 0; i < rows.length; i++) {
          email_json.push({
            "email": rows[i].email
          })
        }
        const csvString = json2csv(email_json);
        res.setHeader('Content-disposition', 'attachment; filename=emails.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
      }
    });

  }
};
module.exports = emailcsv;
