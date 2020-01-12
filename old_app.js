const express = require('express');
const mysql = require('mysql2');
var request = require('request');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var validator = require("email-validator");

const bcrypt = require('bcrypt-nodejs');
const nodemailer = require("nodemailer");
var cors = require('cors')
var jwt = require('jsonwebtoken');



const app = express();

app.use(cors());




// nodemailer
// Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail31.mydevil.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "shop2ship@drathevka.com",
      pass: "Shipping123"
    }
  });


//SESSIONS
app.use(session({
    key: 'user_sid',
    secret: 'Shipper',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


//TOKENS
var generateJwt = (data) =>{
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: data._id,
    email: data.email,
    name: data.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "shipping123"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

/**
 * Middleware to check that a payload is present
 */
const validatePayload = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};



//CREATE CONNCETION
const db = mysql.createPool({
  connectionLimit:15,
  host     : 'mysql31.mydevil.net',
  user     : 'm1186_root',
  password : 'Shipping123',
  database : 'm1186_shop2ship'


});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(session({
  secret: "Shipping123",
  resave:false,
  saveUninitialized:true
}))

// test route
app.get('/', function(req, res) {
    res.json({ message: 'welcome to login/register api' });
});

// GET ESTIMATES FROM SHIPENGINE
app.post('/shipdata',function(req, res) {
    var data = req.body;
    console.log(data);
    var carrier_ids = req.body.carrier_ids;
    var url = 'https://api.shipengine.com/v1/rates/estimate';
    request(
            {
            method:'post',
            url:url,
            json: data,
            headers:{
              'Content-Type': 'application/json',
              'api-key': '0csdkPfPU/sybpRTTuugb4yqckof7Yb0UZFsJpRXXOo',
            }
        }, function (error, response, body) {
            // console.log(error);
            //Print the Response
            // console.log("body");
            // formCleanUp(body, carrier_ids);
            res.send(body);
    });
});


//SHIPENGINE JSON Control
var formCleanUp = (data, carrier_ids) => {
  var carrier_data= [];
  var maxPrice, minPrice;
  if(!data){
    return "no data";
  } else {maxPrice = carrier_data[0].shipping_amount.amount;
      for(var i = 0; i<carrier_ids.length; i++){
        carrier_data = data.filter(o => o.carrier_id == carrier_ids[i]);
          maxPrice = carrier_data[0].shipping_amount.amount;
          minPrice = carrier_data[0].shipping_amount.amount;
          for(var j = 0; j < carrier_data.length; j++){
              if(maxPrice<carrier_data[j].shipping_amount.amount){

              }
          }

      }
  }
}
//send verification EMAIL

var sendVerify = (email, id) => {

  // send mail with defined transport object
  console.log('function started');
  transporter.sendMail({
    from: '"Shop2Ship 👻" shop2ship@drathevka.com', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "<b>Hello</b>, please verify your account by clicking the link below </br> http://bojczuk.tk:3000/verify/" + id, // plain text body
    html: "<b>Hello</b>, please verify your account by clicking the link below </br> http://bojczuk.tk:3000/verify/" + id // html body
  }, (err, data) => {
    console.log(err, data);
  });

}
// REGISTER

app.post('/register', function(req,res) {
  // console.log("req",req.body);
  var today = new Date();
  var email = req.body.email;
  var password = req.body.password;

// ENCRYPT THE password
var salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync(password, salt);


  // Check if email is correct
  if(validator.validate(email)){
    var users={
      "username":req.body.username,
      "email":req.body.email,
      "password":hash,
      "created":today
    }
    db.query('INSERT INTO users SET ?',users, (error, results) => {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('The solution is: ', results);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
      db.query('SELECT * FROM users WHERE email = ?', req.body.email, (err, data) => {
        if(err) throw err;
        else {
        sendVerify(data[0].email, data[0].id);
      }
      })
    }
    });

    // IF EMAIL IS NOT CORRECT
  } else {
    res.send({
      "code":400,
      "failed":"wrong email"
    })
  }
});

// PASSWORD COMPARISION FUNCTION
var ComparePassword = (pass1, pass2) => {
  if(bcrypt.compareSync(pass2, pass1 )) {
    return true
} else {
  return false
}
}


// LOGIN ROUTE

app.post('/login', validatePayload, function(req,res) {
  var email= req.body.email;
  var password = req.body.password;
  var token;
  db.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(ComparePassword(results[0].password, password)){
        token = generateJwt(results[0]);
        console.log(token);
        res.send({
          "code":200,
          "success":"login sucessfull",
          "token":token
            });

        //send TOKENS

      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exit"
          });
          res.end();
    }
  }
  });
});

//VERIFY Email
app.get('/verify/:id', (req,res) => {
  db.query('UPDATE users SET isVerified = \'1\' WHERE id = ?', req.params.id, (err, results) =>{
    if(err) throw err;
    else {
      console.log(results)
    }
  })
});


app.listen('1500', () =>{
  console.log('Server started on port 1500');
});
