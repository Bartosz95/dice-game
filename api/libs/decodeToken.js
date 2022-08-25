import jwt_decode from "jwt-decode";

import logger from "./logger";

const errorMessage = "Something went wrong. Please try again later"

export default (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            throw new Error("You did not provide a authorization header");
        }  
        try {
            req.user = jwt_decode(req.headers.authorization)
        } catch (err) {
            logger.error(errorMessage)
            res.status(504).send({
                'level': 'error',
                'message': errorMessage,
            });
        }

        const {sub, preferred_username} = req.user

        if(!sub)
            throw new Error('sub in token not exist');
        if(!preferred_username) 
            throw new Error('preferred_username in token is undefined')

        logger.debug(`Properly decoded token for user ${sub} username ${preferred_username} has IPS ${req.ips} `)
        next()

    } catch(err) {
        logger.warning(`IPS ${req.ips} send request ${req.method} ${req.path} with wrong authorization header and got message ${err.message}  HEADER ${req.headers.authorization}`)
        res.status(401).send({
            'level': 'error',
            'message': err.message || "Authorization header is not correct",
            'example': {
              'method': 'GET',
              'path': '/game',
              'header': {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5...'
              },
            }
        })
    }
}