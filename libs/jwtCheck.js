var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const NODE_ENV = process.env.NODE_ENV;
const AUTH0_DOMAIN = process.env.AUTH_DOMAIN
const API_IDENTIFIER = process.env.AUTH_API_ID

if(AUTH0_DOMAIN === undefined && NODE_ENV === 'production') {
  throw new Error('env AUTH0_DOMAIN is undefined');
}

if(API_IDENTIFIER === undefined && NODE_ENV === 'production') {
  throw new Error('env API_IDENTIFIER is undefined');
}

export default jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: API_IDENTIFIER,
  issuer: AUTH0_DOMAIN + '/',
  algorithms: ['RS256']
});
