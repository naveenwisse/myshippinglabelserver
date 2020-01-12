var mysql = require("mysql");
var express = require("express");
var sesnsio = require("express-session");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var dashboard = function(req, res) {

if(req.session.loggedin){
  var query = "SELECT * FROM ?? ";

  var table = ["transactions"];

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
      res.render('transactions.pug', {
        rows
      })
    }
  });
} else {
  res.redirect("/");
}

};
module.exports = dashboard;
