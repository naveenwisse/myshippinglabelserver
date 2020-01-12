var mysql = require("mysql");
var express = require("express");
var connection = require("../database");
var Validator = require('jsonschema').Validator;
var v = new Validator();

var addressSchema = {
  type: Object,
  properties: {
    fullname: String,
    phone: String,
    company: String,
    state: String,
    address:String,
    zip: String,
    city: String,
    user_id: Number
  },
  required: ["fullname", "phone", "state", "address", "zip", "city", "user_id"]
}



var saveAddress = (req, res, next) => {
  var query = "SELECT user_id FROM ?? WHERE ??=? AND ??=? AND ??=?";
  var address = req.body;
  var table = ["address", "user_id", address.user_id, "zip", address.zip, "fullname", address.fullname];
  console.log(req.body);
  var errors = [];
  var validationResults = v.validate(address, addressSchema);

  if (validationResults.errors.length > 0) {
    validationResults.errors.forEach(error => {
      errors.push({
        "error": error.message
      });
    })
    res.json(errors);
  } else {

    query = mysql.format(query, table);

    connection.query(query, function(err, results) {
      if (err) {
        console.log(err);
        res.json({
          "error": true,
          "Message": "Error executing MySQL query"
        });
      } else {
        if (results.length > 0) {
          res.json({
            "error": true,
            "Message": "Addres already Saved"
          })
        } else {
          query = "INSERT INTO ?? SET ?";
          table = ["address"];
          query = mysql.format(query, table);
          connection.query(query, address, (err, data) => {
            if (err) {
              console.log(err);
              res.json({
                "error": true,
                "Message": "Error executing MySQL query"
              });
            } else {
              res.json({
                "error": false,
                "Message": "Addres Saved"
              });
            }
          })
        }
      }
    });
  }
}

module.exports = saveAddress;
