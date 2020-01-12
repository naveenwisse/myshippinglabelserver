var express = require("express");


var stripeApiKey = "sk_test_zeIIm0pQaZ1itAA39ZPZnSJe00TtQsL2Sp";
var stripe = require('stripe')(stripeApiKey);



var stripepay = function(req, res) {
 const stripeToken = req.body.token;
 const amount = (req.body.payment.price)*100;
 stripe.charges.create({
   amount: amount,
   currency: 'usd',
   description:'Shop2Ship Label',
   source: stripeToken
 }, (err, charge) => {

   if(err) {
     res.json({
       success:false,
       message:'Charge error'
     });
   } else {
     res.send({
       success:true,
       message:"Charge succesfull",
       charge_id: charge.id
     })
   }

 })
};
module.exports = stripepay;
