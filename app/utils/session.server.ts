import { createCookieSessionStorage, redirect } from '@remix-run/node';

export const storage = createCookieSessionStorage({
    cookie: {
        name: 'queue_session',
        secure: process.env.NODE_ENV === 'production',
        secrets: ['SESSION_SEGRET'],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
    },
});

export const createUserSession = async (
    access_token: string,
    redirectTo: string,
) => {
    const session = await storage.getSession();
    session.set('access_token', access_token);
    const headers = {
        'Set-Cookie': await storage.commitSession(session),
    };
    return redirect(redirectTo, { headers });
};

const getUserSession = (request: Request) => {
    return storage.getSession(request.headers.get('Cookie'));
};

export const getAccessToken = async (request: Request) => {
    const session = await getUserSession(request);
    const access_token = session.get('access_token');
    if (!access_token || typeof access_token !== 'string') return null;
    return access_token;
};

export const requireUserSession = async (request: Request) => {
    const session = await getUserSession(request);
    const access_token = session.get('access_token');

    if (!access_token || typeof access_token !== 'string') {
        throw redirect('/');
    }

    return session;
};
