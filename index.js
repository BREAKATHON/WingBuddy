/*
 
 db   d8b   db d888888b d8b   db  d888b       d8888b. db    db d8888b. d8888b. db    db 
 88   I8I   88   `88'   888o  88 88' Y8b      88  `8D 88    88 88  `8D 88  `8D `8b  d8' 
 88   I8I   88    88    88V8o 88 88           88oooY' 88    88 88   88 88   88  `8bd8'  
 Y8   I8I   88    88    88 V8o88 88  ooo      88~~~b. 88    88 88   88 88   88    88    
 `8b d8'8b d8'   .88.   88  V888 88. ~8~      88   8D 88b  d88 88  .8D 88  .8D    88    
  `8b8' `8d8'  Y888888P VP   V8P  Y888P       Y8888P' ~Y8888P' Y8888D' Y8888D'    YP    
                                                                                        
                                                                                        
*/

// read local environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
// PARSE SERVER (https://github.com/parse-community/parse-server/wiki)
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
const path = require('path');

// set root path for other files to use
global.appRoot = path.resolve(__dirname);

const bodyParser = require('body-parser');

// Global variables are stored in environment variables (e.g., staging points to sandbox)
const baseURL = process.env.BASE_URL;
const serverURL = process.env.SERVER_URL;
const appId = process.env.PARSE_APP_ID;
const masterKey = process.env.PARSE_MASTER_KEY;
const databaseUri = process.env.MONGODB_URI;
const appName = process.env.APP_NAME || 'WingBuddy';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: appId,
  appName: appName,
  masterKey: masterKey,
  serverURL: serverURL,
  publicServerUrl: serverURL,
  liveQuery: {
    classNames: [] // List of classes to support for query subscriptions
  },
  allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false, // this line is added for disabling client class creation by default
  
  // Email verification (disabled for proof of concept)
  verifyUserEmails: false,

  // if `verifyUserEmails` is `true` and
  //     if `emailVerifyTokenValidityDuration` is `undefined` then
  //        email verify token never expires
  //     else
  //        email verify token expires after `emailVerifyTokenValidityDuration`
  //
  // `emailVerifyTokenValidityDuration` defaults to `undefined`
  //
  // email verify token below expires in 2 hours (= 2 * 60 * 60 == 7200 seconds)
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)

  // set preventLoginWithUnverifiedEmail to false to allow user to login without verifying their email
  // set preventLoginWithUnverifiedEmail to true to prevent user from login if their email is not verified
  preventLoginWithUnverifiedEmail: false, // defaults to false

  // account lockout policy setting (OPTIONAL) - defaults to undefined
  // if the account lockout policy is set and there are more than `threshold` number of failed login attempts then the `login` api call returns error code `Parse.Error.OBJECT_NOT_FOUND` with error message `Your account is locked due to multiple failed login attempts. Please try again after <duration> minute(s)`. After `duration` minutes of no login attempts, the application will allow the user to try login again.
  accountLockout: {
    duration: 3, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
    threshold: 3, // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
  },

  // Verbose Logging
  verbose: (process.env.VERBOSE != undefined && process.env.VERBOSE == 1),
  logLevel: process.env.LOG_LEVEL_PARSE || "error",

  // Use a single schema cache shared across requests. Reduces number of queries made to _SCHEMA. Defaults to false, i.e. unique schema cache per request.
  // @see https://github.com/parse-community/parse-server/issues/4247
  enableSingleSchemaCache: true
});


// Create the GraphQL Server Instance
const parseGraphQLServer = new ParseGraphQLServer(
  api,
  {
    graphQLPath: '/graphql',
    playgroundPath: '/playground'
  }
);


var app = express();

// Secure the app
let helmet = require('helmet');
app.use(helmet());

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api.app);

// Mounts the GraphQL API using graphQLPath: '/graphql'
parseGraphQLServer.applyGraphQL(app);
if (process.env.LOCAL == 'true') {
    // (Optional) Mounts the GraphQL Playground - do NOT use in Production
    parseGraphQLServer.applyPlayground(app);
}

// Routes
let index = require('./routes/router');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', index);

const port = process.env.PORT || 1337;
const server = app.listen(port, function() {
  console.log('WingBuddy app listening on port %s', port);
  console.log('GraphQL API running on http://localhost:%s/graphql', port);
  if (process.env.LOCAL == 'true') {
    console.log('GraphQL Playground running on http://localhost:%s/playground', port);
  }
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(server);
