import { validateDto } from '@common/operations/validate-dto.operation';
import { Body, Controller, Post } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';

import { SendMessageDto } from './dto/send-message.dto';
import { TelegramService } from './telegram.service';

@Controller()
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) { }

    @Post()
    async sendMessage(@Body() dto: SendMessageDto): Promise<Message> {
        const input = await validateDto(SendMessageDto, dto);

        return this.telegramService.sendMessage(input.chatID, input.message);
    }
}
