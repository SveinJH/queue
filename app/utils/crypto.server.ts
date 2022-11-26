import CryptoJS from 'crypto-js';

export const encryptAccessToken = (token: string) => {
    const encryptionKey = process.env.CRYPTO_ENCRYPTION_SECRET;
    if (encryptionKey) {
        return CryptoJS.AES.encrypt(token, encryptionKey);
    }
    return null;
};

export const decryptAccessToken = (encryptedToken: string) => {
    const decryptionKey = process.env.CRYPTO_ENCRYPTION_SECRET;
    if (decryptionKey) {
        return CryptoJS.AES.decrypt(encryptedToken, decryptionKey).toString(
            CryptoJS.enc.Utf8,
        );
    }
    return null;
};
