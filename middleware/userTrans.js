var mysql = require("mysql");
var express = require("express");
var connection = require("../database");





var userTrans = (req, res) => {
  var query = "SELECT * FROM ?? WHERE ??=?"
  var table = ["transactions", "email", req.body.email]
  query = mysql.format(query, table);
  connection.query(query, (err, results) => {
    if(err) {
      res.json({"error":true, "message":"database connection error"})
    } else {
      res.json(results)
    }
  })

}

module.exports = userTrans;
