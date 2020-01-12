
var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var deleteUser = function (req, res) {

	var query = "DELETE FROM ?? WHERE ??=? ";
    console.log(req.params.id)
    var table = ["user", "user_id", req.params.id];

    query = mysql.format(query,table);

    connection.query(query,function(err,rows){
        if(err) {

            res.json({"Error" : true, "Message" : "Error executing MySQL query" + err});
        } else {
            res.json({"message":"user deleted"});
            // res.redirect("/dashboard")
        }
    });
};
module.exports = deleteUser;
