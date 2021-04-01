// Imports the Cloud KMS library
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const crc32c = require('fast-crc32c');

const projectId = process.env.KSM_PROJECT_ID;
const locationId = process.env.KSM_LOCATION_ID;
const keyRingId = process.env.KSM_KEYRING_ID;
const keyId = process.env.KSM_KEY_ID;

// Instantiates a client
const client = new KeyManagementServiceClient({
    keyFilename: "./serviceAccount.json"
});

const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId);

// Build the key name
const encrpytBuffer = async (plaintext) => {
    const buffer = Buffer.from(plaintext);
    const bufferCrc32c = crc32c.calculate(buffer);

    const [encryptResponse] = await client.encrypt({
        name: keyName,
        plaintext: buffer,
        plaintextCrc32c: {
            value: bufferCrc32c,
        },
    });

    const ciphertext = encryptResponse.ciphertext;

    if (!encryptResponse.verifiedPlaintextCrc32c) {
        throw new Error('Encrypt: request corrupted in-transit');
    }
    if (
        crc32c.calculate(ciphertext) !==
        Number(encryptResponse.ciphertextCrc32c.value)
    ) {
        throw new Error('Encrypt: response corrupted in-transit');
    }

    return ciphertext.toString('base64');
}

const decrpytBuffer = async (cipher) => {

    const ciphertextCrc32c = crc32c.calculate(cipher);

    const [decryptResponse] = await client.decrypt({
        name: keyName,
        ciphertext: cipher,
        ciphertextCrc32c: {
          value: ciphertextCrc32c,
        },
      });
  
      if (
        crc32c.calculate(decryptResponse.plaintext) !==
        Number(decryptResponse.plaintextCrc32c.value)
      ) {
        throw new Error('Decrypt: response corrupted in-transit');
      }
  
      const plaintext = decryptResponse.plaintext.toString('utf8');
  
      return plaintext;

}

module.exports.encrpytBuffer = encrpytBuffer;
module.exports.decrpytBuffer = decrpytBuffer;
