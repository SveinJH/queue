import { getAccessToken, storage } from '~/utils/session.server';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export const searchWithToken = async (token: string, query: string) => {
    const searchParams = new URLSearchParams([
        ['q', query],
        ['type', 'track'],
        ['limit', '10'],
    ]);

    const response = await fetch(
        `${SPOTIFY_API_URL}/search?${searchParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        },
    );

    if (response.ok) {
        return response.json();
    }

    return null;
};

export const addTrackToQueue = async (token: string, uri: string) => {
    const searchParams = new URLSearchParams([['uri', uri]]);

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
};

export const addTrackToQueueWithToken = async (
    token: string,
    uri: string | null,
) => {
    if (token && uri) {
        const searchParams = new URLSearchParams([['uri', uri]]);

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
