var mysql = require("mysql");
var express = require("express");
var sesnsio = require("express-session");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var dashboard = function(req, res) {


  var query = "SELECT * FROM ?? WHERE ??=?";

  var table = ["transactions", "id", req.params.id];

  query = mysql.format(query, table);

  connection.query(query, function(err, rows) {
    if (err) {
      console.log(err)
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query"
      });
    } else {
      // res.json({"Error" : false, "Message" : "Success", "Users" : rows});
      res.json({
        rows
      })
    }
  });

};
module.exports = dashboard;
