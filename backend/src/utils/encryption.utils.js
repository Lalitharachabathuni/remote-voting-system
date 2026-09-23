const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

// 32-byte key
const getEncryptionKey = () => {
  const keyHex = process.env.BALLOT_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return Buffer.from(keyHex, 'hex');
};

/**
 * Encrypts ballot payload with AES-256-GCM
 */
const encryptBallot = (data, associatedData = '') => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  if (associatedData) {
    cipher.setAAD(Buffer.from(associatedData, 'utf8'));
  }

  const plaintext = typeof data === 'object' ? JSON.stringify(data) : String(data);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag().toString('hex');

  return {
    encryptedChoice: encrypted,
    encryptionIv: iv.toString('hex'),
    encryptionTag: tag
  };
};

/**
 * Decrypts ballot payload
 */
const decryptBallot = (encryptedHex, ivHex, tagHex, associatedData = '') => {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  if (associatedData) {
    decipher.setAAD(Buffer.from(associatedData, 'utf8'));
  }

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
};

module.exports = {
  encryptBallot,
  decryptBallot
};
