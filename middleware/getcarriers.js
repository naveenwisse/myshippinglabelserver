var mysql = require("mysql");
var express = require("express");
var connection = require("../database");





var getcarriers = (req, res) => {
  var query = "SELECT * FROM ??"
  var table = ["admin_variables"]
  query = mysql.format(query, table);
  connection.query(query, (err, results) => {
    if(err) {
      res.json({"error":true, "message":"database connection error"})
    } else {
      res.json(results)
    }
  })

}

module.exports = getcarriers;
