var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: "mail31.mydevil.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "shop2ship@drathevka.com",
    pass: "Shipping123"
  }
});


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

module.exports = sendVerify;
