import { useFetcher } from '@remix-run/react';
import type { Track } from '~/models';
import { Spinner } from '../util/spinner';

type TrackProps = {
    track: Track;
};

export const TrackItem: React.FC<TrackProps> = ({ track }) => {
    let fetcher = useFetcher();

    const isLoading =
        fetcher.state === 'loading' || fetcher.state === 'submitting';

    const {
        uri,
        name,
        artists,
        album: { images },
    } = track;

    const { url: imgUrl } = images[0];

    return (
        <li className="list-none w-full my-2">
            <fetcher.Form method="post">
                <input type="hidden" name="id" value={uri} />
                <div className="flex justify-between items-center">
                    <div className="flex items-center mr-2">
                        <img
                            src={imgUrl}
                            alt="album_cover"
                            height={48}
                            width={48}
                            className="mr-2"
                        />
                        <div>
                            <div>{name}</div>
                            <div>
                                {artists
                                    .map((artist) => {
                                        return (
                                            <span key={artist.id}>
                                                {artist.name}{' '}
                                            </span>
                                        );
                                    })
                                    .splice(0, 2)}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        name="_action"
                        value="queue"
                        className="bg-amber-700 px-2 py-0"
                    >
                        {isLoading ? <Spinner /> : 'Queue'}
                    </button>
                </div>
            </fetcher.Form>
        </li>
    );
};
