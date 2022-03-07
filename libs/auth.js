const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
import MongoStore from 'connect-mongo'
import { mongoUrl } from './db'


const PORT = process.env.APP_PORT;
const AUTH_HOST = process.env.AUTH_HOST
const CLIENT_ID = process.env.AUTH_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET
const CALLBACK_URL = `http://localhost:${PORT}/callback`

const session = {
    secret: SESSION_SECRET,
    cookie: {
        secure: false
    },
    resave: false,
    saveUninitialized: false,
    //store: MongoStore.create({mongoUrl: mongoUrl})
};

const strategy = new Auth0Strategy(
    {
        domain: AUTH_HOST,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        return done(null, profile);
    }
);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

exports.passport = passport
exports.session = session