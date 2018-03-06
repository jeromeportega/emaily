const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Serialize the user information to a database entry.
passport.serializeUser((user, done) => {
    console.log("serializing");
    done(null, user.id);
});

// Deserialize to take the user out of the database by the ID of that user.
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

// Set up passport for Google Authentication
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Reached Auth");
            // Receive all token and profile info from Google Auth
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                // We already have a record with the given profile ID
                return done(null, existingUser);
            }
            // We don't have a user record with this ID, create a new user
            const user = await new User({ googleId: profile.id }).save();
            done(null, user);
        }
    )
);
