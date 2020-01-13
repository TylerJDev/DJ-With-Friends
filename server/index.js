var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
var server = app.listen(PORT);
const io = require('socket.io')(server);
const socketFunc = require('./socket/socket_io.js');

var client_id = ''; // Your client id
var client_secret = ''; // Your secret
var redirect_uri = `http://localhost:${8080}/callback`; // Your redirect uri

var currentUserID = '';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(bodyParser.json())

var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  // res.cookie(stateKey, state);

  var scope = 'user-modify-playback-state user-read-private user-read-playback-state';
  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.post('/search', function(req, res) {
  console.log(req.query.search_query);

  let query = req.query.search_query.split(' ').join('+');
  let access_token = req.body.access_token;

  const options = {
    url: `https://api.spotify.com/v1/search?q=${query}&type=track&market=US`,
    headers: { 'Authorization': 'Bearer ' + access_token }
  }

  request.get(options, function(error, resp, body) { //#TO-DO, if error?
    res.send(body);
  });
});

app.post('/callback', (req, res) => {
  var code = req.body['auth_code'] || null;
  var state = req.body['auth_state'] || null;
  var refresh = req.body['refresh_token'] || null;


  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  // code: code,
  // redirect_uri: redirect_uri,

  if (code !== null && refresh === null) {
    authOptions.form['code'] = code;
    authOptions.form['redirect_uri'] = redirect_uri;
  } else if (code === null && refresh !== null) {
    authOptions.form['refresh_token'] = refresh;
    authOptions.form.grant_type = 'refresh_token';
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token,
          expires_in = body.expires_in;

      // console.log(body);
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) { //#TO-DO, if error?
        body.access_token = access_token;
        body.expires_in = expires_in;
        currentUserID = body.id;

        if (refresh === null) {
          body.refresh_token = refresh_token;
        }

        let deviceOptions = {
          url: 'https://api.spotify.com/v1/me/player/devices',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }


        let _thisBody = body;
        console.log(body);

        request.get(deviceOptions, function(error, response, body){
          _thisBody.devices = body;
          res.send(_thisBody);
        });
      });

    } else {
      console.log('Invalid Token!', body);
    }
  });
});

socketFunc.runSocket(server, io, currentUserID);