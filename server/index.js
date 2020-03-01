const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const PORT = 3000;
var server = app.listen(PORT);
const io = require('socket.io')(server);
const socketFunc = require('./socket/socket_io.js');

/* Replace keys with environment variables */

var currentUserID = '';

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(bodyParser.json())
   .use('/', routes);

socketFunc.runSocket(server, io, currentUserID);