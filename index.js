// Imports 
const express = require('express');
const bodyParser = require('body-parser');
const modelSetUp = require('./src/model/user');
const PackageAppService = require('./src/app_services/package_app_service');
const UserAppService = require('./src/app_services/user_app_service');
const mongoose = require('mongoose');
const cors = require('cors');

// Web app 
const app = express();

// Anythin under /private requires valid Auth0 access token
app.use('/private', require('./src/middlewear/auth0'));

/*** Mongo DB Mongoose connection pool ***/

// Mongo URLs for db connection, localhost and heroku mlab 
const MONGO_URL = '';

// Mongo connection 
mongoose.connect(MONGO_URL, { useNewUrlParser: true })
const db = mongoose.connection

/*** /Mongo DB Mongoose connection pool ***/

// Start mongoose model 
const model = modelSetUp(mongoose)

// App services 
const userAppService = new UserAppService(model.User)
const packageAppService = new PackageAppService(model.User, model.Image, model.PlantType, userAppService)

// Limit per image
app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))

// for parsing application/json
app.use(bodyParser.json())

/*** CORS ***/
app.use(cors());
app.use(require('./src/middlewear/cors'));

/*** Http interface ***/

const httpInterfaceSetup = require('./http_interface')

httpInterfaceSetup(app, packageAppService, userAppService)

/*** /Http interface ***/

/*** Start db and server ***/

// On connection error 
db.on('error', console.error.bind(console, 'connection error:'))

// On connection success 
db.once('open', () => {
    // we're connected!
    // Start web app    
    console.log('Mongo DB connection successfully stablished!')
    // Using heroku assigned port or 3000 if none (e.g. when running locally) 
    const PORT = process.env.PORT || 3000

    // Start error logging middlewear 
    app.use(require('./src/middlewear/error_logger'));

    // Start error handler (this middlewear should allways go after all other middlewear)
    // app.use(require('./src/middlewear/error_handler'));

    // Populate with basic plants (dont uncomment or plants will be duplicated in db) 
    // require('./src/scripts/basicplants')(model.PlantType);

    // Start app 
    app.listen(PORT, () => {
        console.log('DataOwl Backend Server running on port ' + PORT + '!')
    })
})

/*** /Start db and server ***/
