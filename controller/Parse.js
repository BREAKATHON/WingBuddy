var Parse = require('parse/node').Parse;
var parseAppId = process.env.PARSE_APP_ID;
Parse.initialize(parseAppId);
Parse.masterKey = process.env.PARSE_MASTER_KEY;
Parse.serverURL = process.env.SERVER_URL;
Parse.User.enableUnsafeCurrentUser()

module.exports = Parse;