import logger from "./logger";
  
export default (req, res, next) => {
    try {
        console.log(req.headers)
        if(!req.headers.authorization) {
            throw new Error("Request has to containt authorization header");
        }  
        const authHeader = req.headers.authorization.toString().split(" ")
        if(!Array.isArray(authHeader) || authHeader.length !== 2 || authHeader.at(0).toLowerCase() !== "bearer" ) {
            throw new Error("Authorization header has to be Bearer Token type")
        }
        //const decodedBarer = Buffer.from(authHeader.at(1), 'base64').toString('utf8')
        next()

    } catch(err) {
        logger.info(err.message)
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