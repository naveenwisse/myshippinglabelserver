var mysql = require("mysql");
var express = require("express");
var connection = require("../database");





var getUserAddress = (req, res) => {
  var query = "SELECT * FROM ?? WHERE ??=?"
  var table = ["address", "user_id", req.params.id]
  query = mysql.format(query, table);
  connection.query(query, (err, results) => {
    if(err) {
      res.json({"error":true, "message":"database connection error"})
    } else {
      res.json(results)
    }
  })

}

module.exports = getUserAddress;
