import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { addTrackToQueueWithToken } from '~/api/data/index.server';
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
    const id = params.queueId;

    const session = await prisma.queueSession.findUnique({
        where: { id },
    });

    if (session) {
        const access_token = decryptAccessToken(session.token);

        if (access_token) {
            return await addTrackToQueueWithToken(
                access_token,
                'spotify:track:67uX1e9gIoumz0U8ayaOiO',
            );
        }
    }

    return null;
};

export default function Queue() {
    const data = useLoaderData();

    return (
        <main>
            <h1>Your Queue</h1>
            <div>Id: {data?.id}</div>
            <h2>Pin to enter this Queue: {data?.pin}</h2>
            <Form method="post" className="bg-yellow-500">
                <button type="submit">Queue Ferrari</button>
            </Form>
        </main>
    );
}
