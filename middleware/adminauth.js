var session = require('express-session');
var mysql = require('mysql');
var connection = require("../database");


var adminauth = (request, response) => {
  var username = request.body.username;
  	var password = request.body.password;
  	if (username && password) {
  		connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
  			if (results.length > 0) {
  				request.session.loggedin = true;
  				request.session.username = username;
  				response.redirect('/dashboard');
  			} else {
  				response.send('Incorrect Username and/or Password!');
  			}
  			response.end();
  		});
  	} else {
  		response.send('Please enter Username and Password!');
  		response.end();
}

}

module.exports = adminauth;
