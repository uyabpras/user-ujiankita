const crypto = require('crypto');
require('dotenv').config();

exports.encrypt = (plaintext) => {
    try {
        const iv = Buffer.from(process.env.IV_KEY, 'hex');
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY, 'hex'), iv);
        let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error.message);
        return null;
    }
};

exports.decrypt = (ciphertext) => {
    try {
        console.log('\n1 ' + ciphertext+ '\n');
      const iv = Buffer.from(process.env.IV_KEY, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY, 'hex'), iv);
      let decrypted = decipher.update(ciphertext, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      console.log('\n' + decrypted+ '\n');
  
      // Convert the hexadecimal string to an integer
      return parseInt(decrypted, 10);
    } catch (error) {
      console.error('Decryption error:', error.message);
      return null;
    }
  };
  
