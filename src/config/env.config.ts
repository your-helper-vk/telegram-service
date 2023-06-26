import { bool, cleanEnv, num, str } from 'envalid';

export const envConfig = cleanEnv(process.env, {
    APP_PORT: num({ default: 3000 }),
    STAGE: str({ default: 'development' }),

    /* TypeORM config*/
    POSTGRES_HOST: str({ default: 'localhost' }),
    POSTGRES_PORT: num({ default: 5500 }),
    POSTGRES_USERNAME: str({ default: 'telegram_user' }),
    POSTGRES_PASSWORD: str({ default: '12345' }),
    POSTGRES_DATABASE: str({ default: 'telegram' }),
    POSTGRES_SYNCHRONIZE: bool({ default: false }),
    POSTGRES_LOGGING: bool({ default: false }),
    POSTGRES_MAX_QUERY_EXECUTION_TIME: num({ default: 1000 }),
    POSTGRES_MIGRATIONS_RUN: bool({ default: false }),

    /* Telegram bot env */
    TG_BOT_TOKEN: str({ default: '6212572553:AAGFutPYCAg0G0WTQXJ-JrTa3QP6IUG7-B0' }),
    TG_BOT_API: str({ default: 'https://api.telegram.org/' }),
});
