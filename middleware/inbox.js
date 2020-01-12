var mysql = require("mysql");
var express = require("express");
var session = require('express-session');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var inbox = function(req, res) {

  if(req.session.loggedin){

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
        // res.json({"Error" : false, "Message" : "Success", "Users" : rows});
        res.render('inbox.pug', {
          rows
        })
      }
    });

  } else {
    res.redirect('/');
  }

};
module.exports = inbox;
