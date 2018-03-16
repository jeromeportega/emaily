const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

// Require our Mongo Schemas and connect to the DB
require('./models/User');
require('./models/Survey');
require('./services/passport');
mongoose.connect(keys.mongoURI);

const app = express();

// Middle-Ware Initialization
app.use(bodyParser.json());
// This creates a cookie for us so we can use it in the application for user data
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys: [keys.cookieKey],
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Require in all of our routes
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// Logic to utilize React Router on the frontend.
if (process.env.NODE_ENV === 'production') {
    // Express will serve production assets such as main.js / main.css
    app.use(express.static('client/build'));
    // Express will serve index.html if it does not know the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Declare the port based on our environment and start the server.
const PORT = process.env.PORT || 5000;
app.listen(PORT);
