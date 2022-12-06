import { Link } from '@remix-run/react';

export default function AdminPage() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            <h1>Welcome to Queue</h1>
            <Link to="/login">Continue with Spotify</Link>
        </div>
    );
}
