import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';

const getRandom = length => {
  let buf = new Uint8Array(length);
  return buf.map(() => Math.floor(isaac.random() * 256));
};
export const hash = str => {
  bcrypt.setRandomFallback(getRandom);
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return reject(error);
      bcrypt.hash(str, salt, (err, strHash) => {
        if (err) return reject(err);
        resolve(strHash);
      });
    });
  });
};
export const compare = (str, strHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(str, strHash, (error, isMatch) => {
      if (error) return reject(error);
      resolve(isMatch);
    });
  });
};
