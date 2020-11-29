var Parse = require('./Parse')

const geoCodingController = require('./geoCodingController');

const userController = {
  signUp: async function (req) {

    const { email, password_1, password_2, signup_type, name, street, postal_code, city } = req.body;

    if (email == undefined) {
      throw({ code: 400, message: "No email set" });
    }

    if (password_1 == undefined || password_2 == undefined) {
      throw({ code: 400, message: "No password set" });
    }

    if (password_1 != password_2) {
      throw({ code: 400, message: "Passwords don't match" });
    }

    if (name == undefined) {
      throw({ code: 400, message: "No name found" });
    }

    if (street == undefined) {
      throw({ code: 400, message: "No street found" });
    }

    if (postal_code == undefined) {
      throw({ code: 400, message: "No postal code found" });
    }

    if (city == undefined) {
      throw({ code: 400, message: "No city found" });
    }

    if (signup_type == undefined) {
      throw({ code: 400, message: "No sign up type detected" });
    }

    const user = new Parse.User();
    user.set("username", email);
    user.set("password", password_1);
    user.set("email", email);
    user.set("name", name);

    const coordinates = await geoCodingController.decode(street, postal_code, city);
    const location = new Parse.GeoPoint({latitude: parseFloat(coordinates.lat), longitude: parseFloat(coordinates.lon)});
    user.set("location", location);
    user.set("street", street);
    user.set("postal_code", postal_code);
    user.set("city", city);

    // Add additional fields based on sign up persona
    if (signup_type == "seeker") {
      // Seeker sign up

      const Seeker = Parse.Object.extend("Seeker")
      const seeker = new Seeker();

      // Seeker fields
      const { special_needs } = req.body;
    
      seeker.set("special_needs", special_needs);

      await seeker.save();

      user.set("seeker", seeker);
    } else {
      // Volunteer sign up
      const Volunteer = Parse.Object.extend("Volunteer")
      const volunteer = new Volunteer();

      // Volunteer fields
      const { special_needs_skills, event_types, telephone, description } = req.body;

      volunteer.set("special_needs_skills", special_needs_skills);
      volunteer.set("event_types", event_types);
      volunteer.set("telephone", telephone);
      volunteer.set("description", description);

      await volunteer.save();

      user.set("volunteer", volunteer);
    }

    return await user.signUp();
  },
  logIn: async function (req, res) {

    const { username, password } = req.body;

    if (username == undefined) {
      throw({ code: 400, message: "No username set" });
    }

    if (password == undefined) {
      throw({ code: 400, message: "No password set" });
    }

    return await Parse.User.logIn(username, password);
  }
}

module.exports = userController;