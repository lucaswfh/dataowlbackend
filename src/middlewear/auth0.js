/*** Auth0 jwt check ***/

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const jwtCheck = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://killscript.auth0.com/.well-known/jwks.json`
    }),
    
    // Validate the audience and the issuer.
    audience: 'https://pure-wildwood-74137.herokuapp.com/',
    issuer: `https://killscript.auth0.com/`,
    algorithms: ['RS256']
});

module.exports = jwtCheck;