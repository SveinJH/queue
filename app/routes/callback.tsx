import type { LoaderFunction } from '@remix-run/node';
import { requestSpotifyAccessToken } from '~/api/auth/index.server';
import { createUserSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (code) {
        const result = await requestSpotifyAccessToken(code);

        return createUserSession(result.access_token, '/dashboard');
    }

    return null;
};

export default function Index() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            Test
        </div>
    );
}

// const authenticate = () => {
//     window.open('https://accounts.spotify.com/authorize');
// };
