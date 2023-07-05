import { validateDto } from '@common/operations/validate-dto.operation';
import { Injectable } from '@nestjs/common';
import { BotCommand, Message } from 'node-telegram-bot-api';

import { TelegramMessage } from './constants/telegram';
import { TelegramChatID } from './modules/telegram-chat/domain/telegram-chat.domain';
import { CreateTelegramChatDto } from './modules/telegram-chat/dto/create-telegram-chat.dto';
import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramUserID } from './modules/telegram-user/domain/telegram-user.domain';
import { CreateTelegramUserDto } from './modules/telegram-user/dto/create-telegram-user.dto';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';
import { telegramBot } from './telegram.bot';

@Injectable()
export class TelegramService {
    constructor(
        private readonly telegramUserService: TelegramUserService,
        private readonly telegramChatService: TelegramChatService,
    ) {
        this.initialize();
    }

    initialize(): void {
        this.initializeCommand();
        this.initializeTelegram();
    }

    initializeTelegram(): void {
        telegramBot.on('message', async (messageInfo: Message) => {
            const message = messageInfo.text;
            const chatIDInTelegram = messageInfo.chat.id;
            const userIDInTelegram = messageInfo.from.id;

            let resultMessage = TelegramMessage.UNDEFINED_COMMAND;
            switch (message) {
                case '/start':
                    resultMessage = await this.startCommand(userIDInTelegram, chatIDInTelegram);
            }


            await this.sendMessage(chatIDInTelegram, resultMessage);
        });
    }

    async startCommand(userIDInTelegram: number, chatIDInTelegram: number): Promise<string> {
        const user = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

        if (!user) {
            const userInput = await validateDto(CreateTelegramUserDto, {
                id: TelegramUserID.new(),
                userIDInTelegram,
            });
            const newUser = await this.telegramUserService.create(userInput);

            const chatInput = await validateDto(CreateTelegramChatDto, {
                id: TelegramChatID.new(),
                chatIDInTelegram,
                telegramUserID: newUser.id,
            });
            await this.telegramChatService.create(chatInput);

            return TelegramMessage.INITIALIZE;
        }

        return TelegramMessage.USER_ALREADY_EXIST;
    }

    async initializeCommand(): Promise<void> {
        const BOT_COMMANDS: BotCommand[] = [
            { command: 'start', description: 'Начать' },
            { command: 'author', description: 'Об авторе' },
        ];

        await telegramBot.setMyCommands(BOT_COMMANDS);
    }

    sendMessage(chatID: number, message: string): Promise<Message> {
        // eslint-disable-next-line camelcase
        return telegramBot.sendMessage(chatID, message, { parse_mode: 'MarkdownV2' });
    }
}
