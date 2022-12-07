import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { Spinner } from '~/components/util/spinner';
import { Toast } from '~/components/util/toast';
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
        }
    }

    return json({ error: 'Could not find queue with that PIN' });
};

export default function Queue() {
    const fetcher = useFetcher();
    const { data, state } = fetcher;
    const [showToast, setShowToast] = useState<boolean>(true);

    console.log('fetcher', fetcher);

    const isLoading = state === 'submitting';

    return (
        <>
            <main className="flex flex-col h-full items-center justify-center">
                <h1 className="text-2xl">Type PIN to join Queue</h1>
                <fetcher.Form
                    method="post"
                    className="flex flex-col mt-4"
                    action="."
                >
                    <input
                        type="text"
                        name="pin"
                        className="text-gray-900 px-3 py-1 mb-4"
                    />
                    <button
                        disabled={isLoading}
                        type="submit"
                        onClick={() => setShowToast(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded h-12"
                    >
                        {isLoading ? <Spinner /> : 'Enter queue'}
                    </button>
                </fetcher.Form>
                {data?.error && showToast && !isLoading && (
                    <Toast
                        message={data.error}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </main>
        </>
    );
}
