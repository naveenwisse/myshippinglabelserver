var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var email = function(req, res) {

  var query = "SELECT * FROM ?? WHERE ?? = ? ";

  var table = ["user", "newsletter", 1];

  query = mysql.format(query, table);
  console.log(req.body)
  connection.query(query, function(err, rows) {
    if (err) {
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query"
      });
    } else {
      // res.json({"Error" : false, "Message" : "Success", "Users" : rows});
      var success = true;
      res.redirect("/inbox")
    }
  });
};
module.exports = email;
