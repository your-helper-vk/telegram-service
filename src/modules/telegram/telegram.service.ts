import { validateDto } from '@common/operations/validate-dto.operation';
import { Injectable } from '@nestjs/common';
import { BotCommand, Message } from 'node-telegram-bot-api';

import { TelegramChatID } from './modules/telegram-chat/domain/telegram-chat.domain';
import { CreateTelegramChatDto } from './modules/telegram-chat/dto/create-telegram-chat.dto';
import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramUserID } from './modules/telegram-user/domain/telegram-user.domain';
import { CreateTelegramUserDto } from './modules/telegram-user/dto/create-user.dto';
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
            const chatIdInTelegram = messageInfo.chat.id;
            const userIDInTelegram = messageInfo.from.id;

            switch (message) {
                case '/start':
                    const user = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

                    if (!user) {
                        const userInput = await validateDto(CreateTelegramUserDto, {
                            id: TelegramUserID.new(),
                            userIDInTelegram,
                        });
                        const newUser = await this.telegramUserService.create(userInput);

                        const chatInput = await validateDto(CreateTelegramChatDto, {
                            id: TelegramChatID.new(),
                            chatIdInTelegram,
                            TelegramUserID: newUser.id,
                        });
                        await this.telegramChatService.create(chatInput);
                    } else {
                        await this.sendMessage(chatIdInTelegram, 'Пользователь уже сохранён.');
                    }
            }

            telegramBot.sendMessage(chatIdInTelegram, 'Welcome', {
                // eslint-disable-next-line camelcase
                reply_markup: {
                    keyboard: [
                        [
                            { text: 'Добавить пользователя к отслеживанию' },
                            { text: 'Удалить пользователя из отслеживания' },
                        ],
                        [
                            { text: 'Информация о боте' },
                            { text: 'Об авторе' },
                        ],
                    ],
                },
            });
        });
    }

    async initializeCommand(): Promise<void> {
        const BOT_COMMANDS: BotCommand[] = [
            { command: 'start', description: 'Начать' },
            { command: 'author', description: 'Об авторе' },
        ];

        await telegramBot.setMyCommands(BOT_COMMANDS);
    }

    sendMessage(chatID: number, message: string): Promise<Message> {
        return telegramBot.sendMessage(chatID, message);
    }
}
