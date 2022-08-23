import logger from "./logger";
  
export default (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            throw new Error("Request has to containt authorization header");
        }  
        const authHeader = req.headers.authorization.toString().split(" ")
        console.log(typeof authHeader[1] === 'string')
        if(!Array.isArray(authHeader) || authHeader.length !== 2 || authHeader[0].toLowerCase() !== "bearer" || typeof authHeader[1] !== 'string') {
            throw new Error("Authorization header has to be Bearer Token type")
        }
        next()

    } catch(err) {
        logger.info(err.message)
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