const jwtHelper = require("../helpers/jwt.helper");
const msql = require("../database/mysql");
const debug = console.log.bind(console);
const storage = require('../storage/storage')

let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-alexcao-@";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-alexcao-@";


let getUser = async (req, res) => {
    var id = req.jwtDecoded.data.id;
    var user = await msql.getUser(id);
    if(user) return res.status(200).json(user)
    else return res.status(404).json({message : 'user-not-found'})
}

let signup = async (req, res) => {
    var pra = req.body;
    var message = await msql.signup(pra.id, pra.password, pra.email);
    if(message) return  res.status(200).json({message})
    else return res.status(404).json({message : 'signup-fail'})
}

let registry = async (req, res) => {
    var pra = req.body;
    var account = await msql.getAccount(pra.id);
    var email = account.recovery_email
    var avatar = `users/${pra.id}/avatar.jpg`
    var message = await msql.registry(pra.id, pra.displayName, pra.birthday, pra.gender, avatar, email, pra.groupClass, '-', pra.phoneNumber, '1', '1', 0);
    if(message == 'registry-successful') storage.createFolder(`users/${pra.id}`)
    if(message) return res.status(200).json({message})
    else return res.status(404).json({message : 'registry-fail'})
}

let updateProfile = async(req, res) => {
    pra = req.body
    var id = req.jwtDecoded.data.id;
    var message = await msql.updateProfile(pra.birthday, pra.gender, pra.phoneNumber, pra.email, pra.avatar, id);
    return res.status(200).json({message})
}

let login = async (req, res) => {
    id = req.body.id
    password = req.body.password
    message = await msql.login(id, password)
    try {    
        if(message == 'login-successful') {
            const userData = {
                id: id,
            };
            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
            const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);
            tokenList[refreshToken] = {accessToken, refreshToken};
            return res.status(200).json({accessToken, refreshToken, message});
        } else {
            res.status(200).json({message})
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
const refreshTokenFromClient = req.body.refreshToken;
if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
    const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
    const userFakeData = decoded.data;
    const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
    return res.status(200).json({accessToken});
    } catch (error) {
    res.status(403).json({
        message: 'invalid-refresh-token',
    });
    }
} else {
    return res.status(403).send({
    message: 'no-token-provided',
    });
}
};

module.exports = {
    login: login,
    signup: signup,
    registry: registry,
    getUser: getUser,
    updateProfile: updateProfile,
    refreshToken: refreshToken,
}