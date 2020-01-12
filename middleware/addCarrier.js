var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var dashboard = function(req, res) {

  var data = {
    "carrier":req.body.carrier_name,
    "carrier_id":req.body.carrier_id,
    "margin_value":req.body.margin_value,
    "margin_p":req.body.margin_p
  };
  var query = "SELECT * FROM ?? WHERE ??=? ";

  var table = ["admin_variables", "carrier_id", req.carrier_id];

  query = mysql.format(query, table);

  connection.query(query, function(err, rows) {
    if (err) {
      console.log(err)
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query"
      });
    } else if(rows.length>0){
      res.json({"message":"Carrier Already Exists"})
    }
    else {

      query = "INSERT INTO ?? SET ? " ;
      table = ["admin_variables"]
      query = mysql.format(query, table);
      connection.query(query, data, (err) => {
        if(err) {
          console.log(err)
          res.json({"message":"Database error"})
        } else {
          res.redirect("/margin")
        }
      })
    }
  });
};
module.exports = dashboard;
