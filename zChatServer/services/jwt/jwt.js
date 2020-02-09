const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');

module.exports = {
  sign: payload => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, config.jwtSignOption, (error, token) => {
        if (error) return reject(error);
        resolve(token);
      });
    });
  },
  verify: token => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, config.jwtVerifyOption, (error, payload) => {
        if (error) return reject(error);
        resolve(payload);
      });
    });
  }
}
