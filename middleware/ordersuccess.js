var mysql = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var ordersuccess = function(req, res) {

  var data = {
    paid_by: req.body.payment.paid_by,
    method:req.body.payment.method,
    id: req.body.payment.orderId,
    email: req.body.payment.email,
    from_fullname: req.body.shipFrom.fullName,
    from_phone:req.body.shipFrom.phone,
    from_company:req.body.shipFrom.company,
    from_address:req.body.shipFrom.address,
    from_zip:req.body.shipFrom.zipCode,
    from_city:req.body.shipFrom.city,
    to_fullname:req.body.shipTo.fullName,
    to_phone:req.body.shipTo.phone,
    to_address:req.body.shipTo.address,
    to_zip:req.body.shipTo.zipCode,
    to_city:req.body.shipTo.city,
    status:"1",
    price:req.body.payment.price,
    label:req.body.payment.label,
    tracking:req.body.payment.tracking,
    adult_signature:req.body.details.adultSignature,
    alcohol:req.body.details.alcohol,
    weight:req.body.details.weight,
    length:req.body.details.length,
    width:req.body.details.width,
    height:req.body.details.height,
    unit:req.body.details.unit

  }
  var query = "INSERT INTO ?? SET ? ";

  var table = ["transactions"];

  query = mysql.format(query, table);

  connection.query(query, data, function(err, rows) {
    if (err) {
      console.log(err)
      res.json({
        "Error": true,
        "Message": "Error executing MySQL query" + err
      });
    }
    else {
        res.json({"success":"true"})
    }
  });
};
module.exports = ordersuccess;
