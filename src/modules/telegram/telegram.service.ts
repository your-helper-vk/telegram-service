import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
    constructor() { }

    async sendMessage(chatId: number, message: string) { }
}
