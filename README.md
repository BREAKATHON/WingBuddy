# WingBuddy

[![License][license-svg]][license-link]

A buddy matching platform for visits to cultural events for handicapped people.

### For Local Development

* Make sure you have at least Node 4.3. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Find a `.env` file which contains all necessary environment variables and secrets to run the project
* Run the server with: `npm start` (or use VSCode to launch with a debugger)

If you want to test something with a local MongoDB instance, remove the `MONGODB_URI` environment variable. It will then default to a local MongoDB server. To use that, follow these steps:

* Install mongo locally using http://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/
* Run `mongo` to connect to your database, just to make sure it's working. Once you see a mongo prompt, exit with Control-D
* Run the server with: `npm start`
* You now have a database named "dev" that contains your Parse data
* Install ngrok to test with devices which are not localhost

# Using it

Before using it, you can access a test page to verify if the basic setup is working fine [http://localhost:1337/test-static](http://localhost:1337/test-static).

To test the pug view rendering engine, open [http://localhost:1337/test-pug](http://localhost:1337/test-pug)

Then you can use the REST API, the JavaScript SDK, and any of our open-source SDKs:

Example request to a server running locally:

```curl
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{"concertsVisited":1337,"name":"Kurt Diba"}' \
  http://localhost:1337/parse/classes/WingBuddy
  
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:1337/parse/functions/hello
```

Example using it via JavaScript:

```javascript
Parse.initialize('myAppId','unused');
Parse.serverURL = 'https://wingbuddy.herokuapp.com';

var obj = new Parse.Object('WingBuddy');
obj.set('concertsVisited', 1337);
obj.save().then(function(obj) {
  console.log(obj.toJSON());
  var query = new Parse.Query('WingBuddy');
  query.get(obj.id).then(function(objAgain) {
    console.log(objAgain.toJSON());
  }, function(err) {console.log(err); });
}, function(err) { console.log(err); });
```

[license-svg]: https://img.shields.io/github/license/BREAKATHON/WingBuddy
[license-link]: LICENSE