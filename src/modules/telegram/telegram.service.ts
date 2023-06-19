import { Injectable } from '@nestjs/common';

import { telegramBot } from './telegram.bot';

@Injectable()
export class TelegramService {
    constructor() { }

    sendMessage(chatId: number, message: string) {
        return telegramBot.sendMessage(chatId, message);
    }


}
