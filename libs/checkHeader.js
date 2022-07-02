
const sendAuthError = (res, message) => {
    res.status(401).send({
      'level': 'error',
      'message': message || "Authorization header is not correct",
      'example': {
        'method': 'GET',
        'path': '/user/1/game',
        'header': {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5...'
        },
      }
    })
  }
  
export default (req, res, next) => {
    if(!req.headers.authorization) {
        return sendAuthError(res, "Request has to containt authorization header")
    }  
    const authHeader = req.headers.authorization.toString().split(" ")
    if(!Array.isArray(authHeader) || authHeader.length !== 2 || authHeader.at(0).toLowerCase() !== "bearer" ) {
        return sendAuthError(res, "Authorization header has to be token bearer type")
    }
    const bearer = authHeader.at(1)
    next()
}