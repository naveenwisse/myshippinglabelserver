var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var ordersuccess = function(req, res) {

  var keyword = '%' + req.params.keyword + '%';
  var query = "SELECT * FROM ?? WHERE ?? LIKE ? OR ?? LIKE ? ";

  var table = ["transactions", "email", keyword, "id", keyword];

  query = mysql.format(query, table);

  connection.query(query, function(err, rows) {
    if (err) {
      console.log(err)
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query"
      });
    }
    else {
        res.render('transactions.pug', {rows})
    }
  });
};
module.exports = ordersuccess;
