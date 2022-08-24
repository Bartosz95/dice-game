import jwt_decode from "jwt-decode";

import logger from "./logger";
  
export default (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            throw new Error("You did not provide a authorization header");
        }  

        req.user = jwt_decode(req.headers.authorization)
        const {sub, preferred_username} = req.user

        if(!sub)
            throw new Error('sub in token not exist');
        if(!preferred_username) 
            throw new Error('preferred_username in token is undefined')

        next()

    } catch(err) {
        logger.error(err.message)
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