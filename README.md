# WingBuddy

[![License][license-svg]][license-link]

A buddy matching platform for visits to cultural events for handicapped people.
Winning project at [2020 KuDiBa Breakathon](https://kudiba.berlin/en/breakathon/).

### For Local Development

* Make sure you have at least Node 4.3. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Find a `.env` file which contains all necessary environment variables and secrets to run the project (or set up your own infrastructure)
* Run the server with: `npm start` (or use VSCode to launch with a debugger)

If you want to test something with a local MongoDB instance, remove the `MONGODB_URI` environment variable. It will then default to a local MongoDB server. To use that, follow these steps:

* Install mongo locally using http://docs.mongodb.org/master/tutorial/install-mongodb-on-os-x/
* Run `mongo` to connect to your database, just to make sure it's working. Once you see a mongo prompt, exit with Control-D
* Run the server with: `npm start`
* You now have a database named "dev" that contains your Parse data
* Install ngrok to test with devices which are not localhost

### Using it

You can find a running demo version of this repo on https://wingbuddy.herokuapp.com/
When running this repo locally, the web app is reachable under [http://localhost:1337/](http://localhost:1337/).

### Tech stack

| Function      | Technology used |
| ----------- | ----------- |
| Application Server      | [Parse Server](https://parseplatform.org/)       |
| Database   | [Mongo DB](https://www.mongodb.com/)        |
| View Engine   | [Pug](https://pugjs.org/)        |
| Geocoding   | [LocationIQ](https://locationiq.com/)        |
| Email   | [Sendgrid](https://www.sendgrid.com/)        |

### Example `.env` file (local)

```
# ENVIRONMENT VARIABLES
# WingBuddy Web App
# Version: 1.0.0
# Creation Date: 2020-11-28
# Development flags

DEBUG=true
LOCAL=true

# Logs
LOG_LEVEL_CONSOLE=debug
LOG_LEVEL_FILE=error
LOG_LEVEL_PARSE=debug

# URL
BASE_URL=http://localhost:1337
SERVER_URL=http://localhost:1337/parse

# Parse Server (see https://docs.parseplatform.org/parse-server/guide/)
APP_NAME=WingBuddy
CLIENT_CLASS_CREATION=true
PARSE_APP_ID=myAppId -> You choose! (use uuidgen for example)
PARSE_MASTER_KEY=myMasterKey -> You choose!
PARSE_MOUNT=/parse

# MongoDB Database
MONGODB_URI=mongodb+srv://myDatabaseUser:myDatabasePassword@myDatabaseHost/MyCluster?retryWrites=true&w=majority

# Geocoding
LOCATION_IQ_ACCESS_TOKEN=myLocationIqApiKey

# Sendgrid
SENDGRID_API_KEY=mySendgridApiKey
```

[license-svg]: https://img.shields.io/github/license/BREAKATHON/WingBuddy
[license-link]: LICENSE
