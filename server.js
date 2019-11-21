'use strict';

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('./server/services/io');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sharedsession = require("express-socket.io-session");
const errorHandler = require('./server/helpers/error-handler');
const bodyParser = require('body-parser');
require('dotenv').config();

//controllers
const userController = require('./server/controllers/user-controller');
const adminController = require('./server/controllers/admin-controller');
const messageController = require('./server/controllers/message-controller');
// const chatController = require('./server/controllers/chat-controller');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({
  createParentPath: true
}));

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, '/dist/netSocial/')));


// configuring across origin

const whitelist = ['https://meannetsocial.herokuapp.com', 'http://localhost:8181']
const corsOptions = {
  origin: function(origin, callback){
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


app.use(session({
  resave: true,
  secret: 's3cr3t',
  saveUninitialized: true,  // don't create session until something stored
  store: new MongoStore({
    url: process.env.DB_CONN || process.env.DB_URI
  })

}));

let datas = {};
app.use(function (req, res, next) {
  datas = app.locals;
  datas.session = req.session;
  next();
});

// init server http et io
// const server = http.createServer(app);
io(server);

// API routes
app.use('/api/users', userController );
app.use('/api/admin', adminController);
app.use('/api/message', messageController);
app.get('*', function(req,res) {
  return res.sendFile(path.join(__dirname + '/dist/netSocial/index.html'));
});
// app.use('/api/chat', chatController);
//app.use('/main', mainController);

// global error handler
//app.use(errorHandler);

const port = process.env.PORT || 8181;
server.listen(port, () => {
  console.log('Connected on ', port)
});

