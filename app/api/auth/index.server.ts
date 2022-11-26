import { redirect } from '@remix-run/node';
import { btoa } from '@remix-run/node/dist/base64';
import { envConfig } from '~/utils/config.server';

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';

const config = envConfig[process.env.NODE_ENV];

export const authorizeSpotify = () => {
    const { client_id, redirect_uri } = config;

    const searchParams = new URLSearchParams();
    searchParams.append('client_id', client_id);
    searchParams.append('response_type', 'code');
    searchParams.append('redirect_uri', redirect_uri);
    searchParams.append(
        'scope',
        'user-read-private user-read-email user-modify-playback-state',
    );
    searchParams.append('show_dialog', 'true');

    const url = `${SPOTIFY_ACCOUNTS_URL}/authorize?${searchParams.toString()}`;

    return redirect(url);
};

export const requestSpotifyAccessToken = async (code: string) => {
    const { client_id, redirect_uri } = config;

    const client_secret = process.env.CLIENT_SECRET;

    if (client_secret) {
        const Authorization = `Basic ${btoa(`${client_id}:${client_secret}`)}`;

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri,
        });

        const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization,
            },
        });

        if (response.ok) {
            return response.json();
        }

        return null;
    }
};
