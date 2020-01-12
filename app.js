var express = require("express");
var session = require('express-session');
var http = require('http');
var mysql = require("mysql2");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var config = require('./config');
var config = require('./database');
var validator = require("email-validator");
const nodemailer = require("nodemailer");
var cors = require("cors");
var pug = require('pug');
var path = require('path');
const Fastify = require('fastify');
var fs = require('fs');


//IMPORT cluster stuff
var morgan = require('morgan');
var cluster = require('cluster'); {}

var verifyToken = require('./middleware/verifyToken');
var addNewUser = require('./middleware/addNewUser');
var userLoginCheck = require('./middleware/userLoginCheck');
var findAllUsers = require('./middleware/findAllUsers');
var getCarrierData = require('./middleware/shipdata');
var getShipmentRate = require('./middleware/getShipmentRate');
var ratePrintLabel = require('./middleware/ratePrintLabel');
var validateAddress = require('./middleware/addressValidate');
var welcome = require('./middleware/welcome');
var saveAddress = require('./middleware/saveAddress');
var getAddresses = require('./middleware/getUserAddresses');

//ADMIN PANEL MIDDLEWARE
var dashboard = require('./middleware/dashboard');
var deleteUser = require('./middleware/deleteuser');
var transactions = require('./middleware/transactions');
var margin = require('./middleware/margin');
var inbox = require('./middleware/inbox');
var email = require('./middleware/email');
var emailcsv = require('./middleware/emailcsv');
var addcarier = require('./middleware/addCarrier')
var getcarriers = require('./middleware/getcarriers')
var updatecarrier = require('./middleware/updatecarrier')
var ordersuccess = require('./middleware/ordersuccess')
var searchtransactions = require('./middleware/searchtransactions')
var adminauth = require('./middleware/adminauth')
var stripepay = require('./middleware/stripepay')
var userTrans = require('./middleware/userTrans')
var findtransaction = require('./middleware/findtransaction')



//make clusters
let workers = [];
/**
 * Setup number of worker processes to share port which will be defined while setting up server
 */

const setupWorkerProcesses = () => {
  // to read number of cores on system
  let numCores = require('os').cpus().length;
  console.log('Master cluster setting up ' + numCores + ' workers');

  // iterate on number of cores need to be utilized by an application
  for (let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[i].on('message', function(message) {
      console.log(message);
    });
  }

  // process is clustered on a core and process id is assigned
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is listening');
  });

  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length - 1].on('message', function(message) {
      console.log(message);
    });
  });
};

var options = {
   key: fs.readFileSync('server-key.pem'),
   cert: fs.readFileSync('server-crt.pem'),
   ca: fs.readFileSync('ca-crt.pem')
 };

var app = express();

// Disable etag for better efficiency
app.set('etag', false);

app.use(cors());
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


const setUpExpress = () => {
  // create server
  app.server = http.createServer(app);

  // logger
  app.use(morgan('tiny'));

  // parse application/json
  app.use(bodyParser.json({
    limit: '2000kb',
  }));
  app.disable('x-powered-by');

  // start server
  app.server.listen('5000', () => {
    console.log(`Started server on => https://localhost:${app.server.address().port} for Process Id ${process.pid}`);
  });

  // in case of an error
  app.on('error', (appErr, appCtx) => {
    console.error('app error', appErr.stack);
    console.error('on url', appCtx.req.url);
    console.error('with headers', appCtx.req.headers);
  });
};



app.post('/register', addNewUser);
app.post('/login', userLoginCheck);
app.post('/shipdata', getCarrierData);
app.post('/saveAddress', saveAddress);
app.get('/transaction/:id', findtransaction)

app.post('/auth', adminauth);
app.post('/alltransactions', userTrans);
// ADMIN PANEL
app.get('/', (req, res) => {
  res.render('./login.pug')
});
app.get('/dashboard', dashboard);
app.get('/deleteUser/:id', deleteUser);
app.get('/transactions', transactions);
app.get('/margin', margin);
app.get('/inbox', inbox)
app.post('/email', email)
app.get('/emailcsv/:id', emailcsv)
app.post('/addcarier', addcarier)
app.post('/updatecarrier/:id', updatecarrier)
app.get('/transactions/:keyword', searchtransactions)


app.get('/getcarriers', getcarriers)
app.get('/getUserAddress/:id', getAddresses)
app.post('/ordersuccess', ordersuccess)
app.post('/stripepay', stripepay)
app.post('/getShipmentRate', getShipmentRate);

app.post('/ratePrintLabel/:rate_id', ratePrintLabel);
app.post('/addressValidate', validateAddress);


app.get('/users', findAllUsers);

var apiRoutes = express.Router();
apiRoutes.use(bodyParser.urlencoded({
  extended: true
}));
apiRoutes.use(bodyParser.json());

apiRoutes.use('/', verifyToken);

apiRoutes.get('/', welcome);



app.use('/api', apiRoutes);

/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */
const setupServer = (isClusterRequired) => {

  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    setUpExpress();
  }
};

setupServer(false);
