const crypto = require('crypto');

const HMAC_SECRET = process.env.VOTER_REF_HMAC_SECRET || 'dev_hmac_secret_voter_anonymization_key';

/**
 * Generates an irreversible one-way pseudonymous identifier for double-voting checks
 * without ever linking to the plaintext user identity in the ballot storage.
 */
const generateVoterRef = (userId, electionId) => {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${userId.toString()}:${electionId.toString()}`)
    .digest('hex');
};

/**
 * Standard SHA-256 hash
 */
const sha256 = (data) => {
  const content = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return crypto.createHash('sha256').update(content).digest('hex');
};

/**
 * Generates a high-entropy random token
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

module.exports = {
  generateVoterRef,
  sha256,
  generateRandomToken
};
