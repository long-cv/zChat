const jwt = require('./jwt/jwt');
const httpSttCode = require('../constants/httpStatusCode');
// authenticate/authorize user.
module.exports = async (request, response, next) => {
  if (!request.headers.authorization) return response.status(httpSttCode.UNAUTHORIZIED).json({isOk: false, message: "not authorizied."});
  let [, userToken] = request.headers.authorization.split(' ');
  try {
    payload = await jwt.verify(userToken);
    request.userPayload = payload;
    return next();
  } catch(error) {
    return response.status(httpSttCode.UNAUTHORIZIED).json({isOk: false, messeage: "not authorizied.", error})
  }
};