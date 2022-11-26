import { useFetcher } from '@remix-run/react';

type QueueActionsProps = {};

export const QueueActions: React.FC<QueueActionsProps> = () => {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="post">
            <button type="submit" name="_action" value="create_queue">
                New session
            </button>
        </fetcher.Form>
    );
};
