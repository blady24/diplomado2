const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

const config = {
    PORT : process.env.PORT || 3000,
    DB_DATABASE : process.env.DB_DATABASE || 'diplomado_db',
    DB_USERNAME : process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD : process.env.DB_PASSWORD || 'admin',
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_PORT : process.env.DB_PORT || 5432,
    DB_DIALECT : process.env.DB_DIALECT || 'postgres',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_SECONDS: process.env.JWT_EXPIRES_SECONDS,
    DB_USE_SSL: process.env.DB_USE_SSL ?? false,
}

export default config;