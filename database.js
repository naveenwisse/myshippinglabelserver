var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'mysql31.mydevil.net',
  user     : 'm1186_root',
  password : 'Shipping123',
  database : 'm1186_shop2ship'
});

connection.connect(function(err) {
    if (err) console.log('err connecting to database'+ err)
});

module.exports = connection;
