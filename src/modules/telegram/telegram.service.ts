import { validateDto } from '@common/operations/validate-dto.operation';
import { Injectable } from '@nestjs/common';
import { BotCommand, Message } from 'node-telegram-bot-api';

import { ChatService } from './modules/chat/chat.service';
import { ChatID } from './modules/chat/domain/chat.domain';
import { CreateChatDto } from './modules/chat/dto/create-chat.dto';
import { TelegramUserID } from './modules/user/domain/user.domain';
import { CreateTelegramUserDto } from './modules/user/dto/create-user.dto';
import { TelegramUserService } from './modules/user/user.service';
import { telegramBot } from './telegram.bot';

@Injectable()
export class TelegramService {
    constructor(
        private readonly TelegramUserService: TelegramUserService,
        private readonly chatService: ChatService,
    ) {
        this.initialize();
    }

    initialize(): void {
        this.initializeCommand();
        telegramBot.on('message', async (messageInfo: Message) => {
            const message = messageInfo.text;
            const chatIdInTelegram = messageInfo.chat.id;
            const TelegramUserIDInTelegram = messageInfo.from.id;

            switch (message) {
                case '/start':
                    const user = await this.TelegramUserService.findOneByTelegramUserIDInTelegram(TelegramUserIDInTelegram);

                    if (!user) {
                        const userInput = await validateDto(CreateTelegramUserDto, {
                            id: TelegramUserID.new(),
                            TelegramUserIDInTelegram,
                        });
                        const newUser = await this.TelegramUserService.create(userInput);

                        const chatInput = await validateDto(CreateChatDto, {
                            id: ChatID.new(),
                            chatIdInTelegram,
                            TelegramUserID: newUser.id,
                        });
                        await this.chatService.create(chatInput);
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
