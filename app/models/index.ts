export type Image = {
    height: number;
    width: number;
    url: string;
};

export type Artist = {
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
};

export type Album = {
    album_type: string;
    artists: Artist[];
    name: string;
    type: string;
    uri: string;
    id: string;
    images: Image[];
};

export type Track = {
    album: Album;
    artists: Artist[];
    duration_ms: number;
    id: string;
    name: string;
    type: string;
    uri: string;
};
