import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { addTrackToQueue } from '~/api/data/index.server';
import { QueueActions } from '~/components/session/queue-actions';
import { createAndSaveQueue } from '~/utils/queue.server';
import { requireUserSession } from '~/utils/session.server';

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

    if (_action === 'create_queue') {
        const result = await createAndSaveQueue(request);
        const url = result?.id ? `/queue/${result.id}` : '/';
        return redirect(url);
    }

    return json({ tracks: [] });
};

export default function Index() {
    const { user } = useLoaderData() as LoaderData;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl">Dashboard</h1>
            {user && <h3>Logged in as: {user.display_name}</h3>}
            <QueueActions />
        </div>
    );
}
