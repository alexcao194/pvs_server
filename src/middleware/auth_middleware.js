const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-alexcao-@";

/**
* Middleware: Authorization user by Token
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
let isAuth = async (req, res, next) => {
  const tokenFromClient = req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      req.jwtDecoded = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'unauthorized',
      });
    }
  } else {
    return res.status(403).send({
      message: 'no-token-provided',
    });
  }
}

module.exports = {
  isAuth: isAuth,
};