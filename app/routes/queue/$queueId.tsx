import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { addTrackToQueue, searchWithToken } from '~/api/data/index.server';
import { TrackItem } from '~/components/track';
import type { Track } from '~/models';
import { decryptAccessToken } from '~/utils/crypto.server';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ params }) => {
    const id = params.queueId;

    if (id && id.length === 24) {
        const queueSession = await prisma.queueSession.findUnique({
            where: {
                id,
            },
        });

        if (!queueSession) {
            return redirect('/queue');
        } else {
            return json({
                id,
                pin: queueSession.pin,
            });
        }
    } else {
        console.log('invalid id');
    }

    return json({ id });
};

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === 'queue' && typeof values['id'] === 'string') {
        const id = params.queueId;

        console.log('id', id);

        if (id) {
            const session = await prisma.queueSession.findUnique({
                where: { id },
            });

            if (session) {
                const token = decryptAccessToken(session.token);

                if (token) {
                    const result = await addTrackToQueue(token, values['id']);
                    return json({});
                }
            }
        }
    }

    if (_action === 'search' && typeof values['query'] === 'string') {
        const id = params.queueId;

        console.log('id', id);

        if (id) {
            const session = await prisma.queueSession.findUnique({
                where: { id },
            });

            if (session) {
                const token = decryptAccessToken(session.token);

                if (token) {
                    const result = await searchWithToken(
                        token,
                        values['query'],
                    );
                    return json({ tracks: result?.tracks });
                }
            }
        }
    }

    return json({ tracks: [] });
};

export default function Queue() {
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const [query, setQuery] = useState('');

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

    return (
        <main className="flex flex-col place-content-center">
            <h1>Your Queue</h1>
            <div>Id: {loaderData?.id}</div>
            <h2>Pin to enter this Queue: {loaderData?.pin}</h2>
            <input
                className="text-gray-900 px-2 mb-4"
                type="text"
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="flex flex-col items-center w-4/5">
                {actionData?.tracks?.items?.map((track: Track) => (
                    <TrackItem track={track} key={track.id} />
                ))}
            </ul>
        </main>
    );
}
