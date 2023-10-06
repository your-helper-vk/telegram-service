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
    TG_BOT_TOKEN: str({ default: '6346068510:AAGHlzNy8ynMBOAJFh8P96kdfW6fcGMMADg' }),
    TG_BOT_API: str({ default: 'https://api.telegram.org/' }),

    /* Vkontakte env */
    VK_API: str({ default: 'https://api.vk.com/method/' }),
    VK_CLIENT_ID: num({ default: 51612368 }),
    VK_VERSION: str({ default: '5.131' }),
    VK_ACCESS_TOKEN: str({
        default:
            'vk1.a.ZBl5-SznpFxtseOMdwmJfFgZ9Lx5q-Gvgv6qRmWBB-zzAMwV_pdJt3UO-q1SQdK12ytWqj-eQUAVo96hg83FEbH_BfFBqK4VOCRHVCAvr-aTI0W1FLU_Prd9ZM8x5t2Kt9Hp7ZmVgLCFBHnerK8tXecCZ4DyFOj-2oM1icv36t4JPzYjru7maOHx8xifisOGf78TdGtZX3Bz2hWVnsfi7g',
    }),
});
