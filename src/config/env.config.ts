import { cleanEnv, str } from 'envalid';

export const envConfig = cleanEnv(process.env, {
    /* Telegram bot env */
    TG_BOT_TOKEN: str({ default: '6212572553:AAGFutPYCAg0G0WTQXJ-JrTa3QP6IUG7-B0' }),
});
