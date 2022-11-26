import { getAccessToken, storage } from '~/utils/session.server';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export const search = async (request: Request, query: string) => {
    const access_token = await getAccessToken(request);

    if (access_token) {
        const searchParams = new URLSearchParams([
            ['q', query],
            ['type', 'track'],
            ['limit', '10'],
        ]);

        const response = await fetch(
            `${SPOTIFY_API_URL}/search?${searchParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.ok) {
            return response.json();
        }
    }

    return null;
};

export const addTrackToQueue = async (request: Request, uri: string | null) => {
    const access_token = await getAccessToken(request);

    if (access_token && uri) {
        const searchParams = new URLSearchParams([['uri', uri]]);

        const response = await fetch(
            `${SPOTIFY_API_URL}/me/player/queue?${searchParams.toString()}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    return null;
};

export const addTrackToQueueWithToken = async (
    token: string,
    uri: string | null,
) => {
    if (token && uri) {
        const searchParams = new URLSearchParams([['uri', uri]]);

        console.log('token', token);

        const response = await fetch(
            `${SPOTIFY_API_URL}/me/player/queue?${searchParams.toString()}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('response', response);
    }

    return null;
};
