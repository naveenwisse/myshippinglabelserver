var mysql = require("mysql");
var express = require("express");
var connection = require("../database");





var getcarriers = (req, res) => {
  var query = "UPDATE ?? SET ?? = ?, ??=?, ??=?, ??=?, ?? = ? WHERE ?? = ?"
  var table = ["admin_variables", "carrier_id", req.body.carrier_id, "carrier" , req.body.carrier, "carrier_id", req.body.carrier_id,  "margin_p", req.body.margin_p, "margin_value",req.body.margin_value, "id", req.params.id]
  query = mysql.format(query, table);

  var data = {

  }
  connection.query(query, (err, results) => {
    if(err) {
      console.log(err)
      res.json({"error":true, "message":"database connection error"})
    } else {
      res.redirect('/margin')
    }
  })

}

module.exports = getcarriers;
