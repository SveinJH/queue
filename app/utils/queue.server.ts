import { encryptAccessToken } from './crypto.server';
import { prisma } from './db.server';
import { getAccessToken } from './session.server';

const generatePin = () => {
    return `${Math.floor(10000 + Math.random() * 899999)}`;
};

export const createAndSaveQueue = async (request: Request) => {
    const access_token = await getAccessToken(request);

    if (access_token) {
        const encryptedAccessToken = encryptAccessToken(access_token);

        if (encryptedAccessToken) {
            const pin = generatePin();

            return prisma.queueSession.create({
                data: {
                    pin,
                    token: encryptedAccessToken.toString(),
                },
            });
        }
    }
};
