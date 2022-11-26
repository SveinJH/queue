import type { LoaderFunction } from '@remix-run/node';
import { authorizeSpotify } from '~/api/auth/index.server';

export const loader: LoaderFunction = ({ params }) => {
    return authorizeSpotify();
};

export default function Index() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            <h1>Choose a login option below</h1>
        </div>
    );
}
