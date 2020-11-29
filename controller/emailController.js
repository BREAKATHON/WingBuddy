const sgMail = require("@sendgrid/mail");

const path = require("path");

const emailController = {
  sendBuddyRequest: async function (event, fromUser, toUser) {

    if (toUser == undefined) {
      throw ({ code: 400, message: "No recipient provided" });
    }

    if (fromUser == undefined) {
      throw ({ code: 400, message: "No sender provided" });
    }

    if (fromUser == undefined) {
      throw ({ code: 400, message: "No event provided" });
    }

    const toEmail = toUser.get("email");
    if (toEmail == undefined) {
      throw ({ code: 400, message: "User has no email address" });
    }

    const fromName = fromUser.get("name");

    const eventType = event.get("event_type")
    const eventId = event.id
    const eventLink = path.join(process.env.BASE_URL, "show-event", eventId)

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    
    const msg = {
      to: toEmail,
      from: "julian@music-tech.com", // Change to your verified sender
      subject: "You have a new WingBuddy request from " + fromName,
      text: fromName + " would like to attend an event of type " + eventType + " with you! Approve the request by clicking on this link: " + eventLink,
      html: fromName + " would like to attend an event of type " + eventType + " with you! Approve the request by clicking on this link: <a href='" + eventLink + "'>" + eventLink + "</a>",
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send(msg)
  }
}

module.exports = emailController;