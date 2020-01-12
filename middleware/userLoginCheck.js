
var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database"); // get our config file

var ComparePassword = (pass1, pass2) => {
  if(bcrypt.compareSync(pass2, pass1 )) {
    return true
} else {
  return false
}
}

var userLoginCheck = function (req, res) {

	//var em = req.body.email || req.query.email;
	var post  = {
		password:req.body.password,
		email:req.body.email

}

	var query = "SELECT * FROM ?? WHERE ??=?";

	var table = ["user","email", post.email];
	query = mysql.format(query,table);
	connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {

			if(ComparePassword(rows[0].password, post.password)){
				console.log(rows);
				var token = jwt.sign({data:rows}, config.secret, {
					expiresIn: 1440
				});
				user_id= rows[0];
				var data  = {
					user_id:rows[0].user_id,
					access_token:token
					// ip_address:rows[0].ip_address
				}
				var query = "INSERT INTO  ?? SET  ?";
				var table = ["access_token"];
				query = mysql.format(query,table);
				connection.query(query, data, function(err,rows){
					if(err) {
						res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					} else {

						res.json({
							success: true,
							message: 'Token generated',
							token: token,
							currUser: user_id
						});
           				 } // return info including token
           				});
			}
			else {
				res.json({"Error" : true, "Message" : "wrong email/password combination"});
			}

		}
	});
}

module.exports = userLoginCheck;
