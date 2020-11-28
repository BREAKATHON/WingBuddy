var Parse = require('parse/node').Parse;
var parseAppId = process.env.PARSE_APP_ID;
Parse.initialize(parseAppId);
Parse.serverURL = process.env.SERVER_URL;

const userController = {
  signUp: async function (req, res) {

    const { username, password, email } = req.body;

    if (username == undefined) {
      res.status(429).send("No username set");
      return;
    }

    if (password == undefined) {
      res.status(429).send("No password set");
      return;
    }

    if (email == undefined) {
      res.status(429).send("No email set");
      return;
    }

    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    // other fields can be set just like with Parse.Object
    // user.set("phone", "415-392-0202");
    return await user.signUp();
  },
  logIn: async function (req, res) {

    const { username, password } = req.body;

    if (username == undefined) {
      res.status(429).send("No username set");
      return;
    }

    if (password == undefined) {
      res.status(429).send("No password set");
      return;
    }

    return await Parse.User.logIn(username, password);
  }
}

module.exports = userController