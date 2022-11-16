const jwt = require('jsonwebtoken')

let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((reslove, reject) => {
        const userData = {
            id: user.id,
        }
        jwt.sign(
            {
                data: userData
            },
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife
            },
            (error, token) => {
                if (error) {
                    return reject(error)
                }
                reslove(token);
            }
        )
    })
}

let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      });
    });
}
module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
};