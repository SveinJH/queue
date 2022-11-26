import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { prisma } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const pin = formData.get('pin');

    if (pin && typeof pin === 'string') {
        const session = await prisma.queueSession.findFirst({
            where: {
                pin,
            },
        });

        if (session) {
            return redirect(`/queue/${session.id}`);
        } else {
            console.log('Could not find that queue session');
        }
    }
};

export default function Queue() {
    return (
        <main>
            <h1>Type PIN to join Queue</h1>
            <Form method="post">
                <input
                    type="text"
                    name="pin"
                    className="text-gray-900 px-2 mb-4"
                />
                <button type="submit">Enter Queue</button>
            </Form>
        </main>
    );
}
