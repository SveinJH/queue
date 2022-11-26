type Environment = 'development' | 'test' | 'production';

type Config = {
    client_id: string;
    redirect_uri: string;
};

type EnvironmentConfig = Record<Environment, Config>;

export const envConfig: EnvironmentConfig = {
    development: {
        client_id: 'ad9f8f52580b4b7a957b78691d1b2215',
        redirect_uri: 'http://localhost:3000/callback',
    },
    test: {
        client_id: '',
        redirect_uri: '',
    },
    production: {
        client_id: 'ad9f8f52580b4b7a957b78691d1b2215',
        redirect_uri: 'https://queue-ten.vercel.app/callback',
    },
};
