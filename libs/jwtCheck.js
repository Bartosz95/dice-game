var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

export default jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-8ti8osnq.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://dicegame/api',
  issuer: 'https://dev-8ti8osnq.us.auth0.com/',
  algorithms: ['RS256']
});
