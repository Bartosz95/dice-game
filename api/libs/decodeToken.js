import jwt_decode from "jwt-decode";

import logger from "./logger";
  
export default (req, res, next) => {
    try {
        if(!req.kauth.grant.access_token.token) {
            throw new Error("Cannot decode token");
        }  
        req.user = jwt_decode(req.kauth.grant.access_token.token)
        //const decodedBarer = Buffer.from(authHeader.at(1), 'base64').toString('utf8')
        next()

    } catch(err) {
        logger.error(err.message)
        res.status(401).send({
            'level': 'error',
            'message': err.message || "Authorization header is not correct",
            'example': {
              'method': 'GET',
              'path': '/user/1/game',
              'header': {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5...'
              },
            }
        })
    }
}