var Parse = require('parse/node').Parse;
var parseAppId = process.env.PARSE_APP_ID;
Parse.initialize(parseAppId);
Parse.serverURL = process.env.SERVER_URL;

const geoCodingController = require('./geoCodingController');

const userController = {
  signUp: async function (req, res) {

    const { email, password_1, password_2, signup_type } = req.body;

    if (email == undefined) {
      res.status(400).send("No email set");
      return;
    }

    if (password_1 == undefined || password_2 == undefined) {
      res.status(400).send("No password set");
      return;
    }

    if (password_1 != password_2) {
      res.status(400).send("Passwords don't match");
      return;
    }

    if (signup_type == undefined) {
      res.status(400).send("No sign up type detected");
      return;
    }

    const user = new Parse.User();
    user.set("username", email);
    user.set("password", password_1);
    user.set("email", email);

    // Add additional fields based on sign up persona
    if (signup_type == "seeker") {
      // Seeker sign up

      const Seeker = Parse.Object.extend("Seeker")
      const seeker = new Seeker();

      const { name, street, postal_code, city, special_needs, event_types } = req.body;

      seeker.set("name", name);
    
      const coordinates = await geoCodingController.decode(street, postal_code, city);
      const location = new Parse.GeoPoint({latitude: coordinates.lat, longitude: coordinates.lon});
      seeker.set("location", location);

      seeker.set("special_needs", special_needs);
      seeker.set("event_types", event_types);

      await seeker.save();

      user.set("seeker", seeker);
    } else {
      // Volunteer sign up

    }

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

module.exports = userController;