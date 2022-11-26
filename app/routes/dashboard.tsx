import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
    Form,
    useActionData,
    useLoaderData,
    useSubmit,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { addTrackToQueue, search } from '~/api/data/index.server';
import { test_tracks } from '~/components/data/test-data';
import { QueueActions } from '~/components/session/queue-actions';
import { TrackItem } from '~/components/track';
import { Track } from '~/models';
import { createAndSaveQueue } from '~/utils/queue.server';
import { requireUserSession, storage } from '~/utils/session.server';

type User = {
    display_name: string;
};

type LoaderData = {
    user?: User;
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await requireUserSession(request);

    const access_token: string = session.get('access_token');

    const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    if (response.ok) {
        const { display_name } = await response.json();
        return json<LoaderData>({
            user: {
                display_name,
            },
        });
    }

    return null;
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === 'queue' && typeof values['id'] === 'string') {
        return await addTrackToQueue(request, values['id']);
    }

    if (_action === 'search' && typeof values['query'] === 'string') {
        const result = await search(request, values['query']);
        return json({ tracks: result.tracks });
    }

    if (_action === 'create_queue') {
        const result = await createAndSaveQueue(request);
        const url = result?.id ? `/queue/${result.id}` : '/';
        return redirect(url);
    }

    return json({ tracks: [] });
};

export default function Index() {
    const submit = useSubmit();
    const [query, setQuery] = useState('');
    const data = useActionData();
    const { user } = useLoaderData() as LoaderData;

    useEffect(() => {
        if (query && query.trim()) {
            const searchDebounce = setTimeout(() => {
                const data = new FormData();
                data.set('query', query);
                data.set('_action', 'search');
                submit(data, { method: 'post' });
            }, 750);

            return () => clearTimeout(searchDebounce);
        }
    }, [query, submit]);

    console.log(data?.tracks.items);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl">Dashboard</h1>
            {user && <h3>Logged in as: {user.display_name}</h3>}
            <QueueActions />
            <input
                className="text-gray-900 px-2 mb-4"
                type="text"
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="flex flex-col items-center w-4/5">
                {/* {test_tracks &&
                    test_tracks.tracks.items.map((track: Track) => (
                        <TrackItem track={track} key={track.id} />
                    ))} */}
                {data?.tracks?.items?.map((track: Track) => (
                    <TrackItem track={track} key={track.id} />
                ))}
            </ul>
        </div>
    );
}
