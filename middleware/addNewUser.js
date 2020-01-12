
var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
const bcrypt = require('bcrypt-nodejs');
var connection = require("../database");
var sendVerify = require("./emailVerify")


 var addNewUser = function(req,res, next){
 	var date = new Date();
  var salt = bcrypt.genSaltSync(10);
    var post  = {
      fullname:req.body.fullname,
      email:req.body.email,
      password:bcrypt.hashSync(req.body.password, salt),
     // time_zone:req.body.time_zone

  };
  	var query = "SELECT email FROM ?? WHERE ??=?";

		var table = ["user", "email", post.email];

		query = mysql.format(query,table);

		connection.query(query,function(err,rows){
		    if(err) {
			       res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		            }
		    else {

		          if(rows.length==0){

			               var query = "INSERT INTO  ?? SET  ?";
			               var table = ["user"];
			               query = mysql.format(query,table);
			               connection.query(query, post, function(err, results){
				                   if(err) {
					                       res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				                    }
                            else {

                              connection.query('SELECT * FROM users WHERE email = ?', post.email, (err, data) => {
                                console.log(data);
                              if(err) throw err;
                              else {
                                sendVerify(data[0].email, data[0].id);
                                }
                              });
					                 res.json({"Error" : false, "Message" : "Success"});
				                  }

		                });
                  }
		          else{
			          res.json({"Error" : false, "Message" : "Email Id already registered"});
		            }
		}
    });
	}

   module.exports = addNewUser;
