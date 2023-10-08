import { validateDto } from '@common/operation/validate-dto.operation';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Message } from 'node-telegram-bot-api';

import { SendMessageDto } from './dto/send-message.dto';
import { TelegramService } from './telegram.service';

@ApiTags('Telegram endpoints')
@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) { }

    @Post()
    async sendMessage(@Body() dto: SendMessageDto): Promise<Message> {
        const input = await validateDto(SendMessageDto, dto);

        return this.telegramService.sendMessage(input.chatID, input.message);
    }
}
