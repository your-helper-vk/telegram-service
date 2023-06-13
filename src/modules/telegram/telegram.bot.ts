import { envConfig } from '@config/env.config';
import { telegramConfig } from '@config/telegram.config';
import * as TelegramBot from 'node-telegram-bot-api';

export const telegramBot = new TelegramBot(envConfig.TG_BOT_TOKEN, telegramConfig);
