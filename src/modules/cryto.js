const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');

module.exports = {
  encrypt: async (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = (await crypto.randomBytes(64)).toString('base64');
        pbkdf2.pbkdf2(
          password,
          salt.toString(),
          100,  // 반복 횟수
          64,
          'sha512',
          (err, derivedKey) => {
            if (err) throw err;
            const hashed = derivedKey.toString('base64');
            resolve({ salt, hashed });
          }
        );
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  encryptWithSalt: async (password, salt) => {
    return new Promise(async (resolve, reject) => {
      try {
        pbkdf2.pbkdf2(password, salt, 100, 64, 'sha512', (err, derivedKey) => {
          if (err) throw err;
          const hashed = derivedKey.toString('base64');
          resolve(hashed);
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
};
