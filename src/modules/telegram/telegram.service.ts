import { validateDto } from '@common/operations/validate-dto.operation';
import { Injectable } from '@nestjs/common';
import { VkontakteUserID } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserService } from '@vkontakte/modules/vkontakte-user/vkontakte-user.service';
import { VkontakteService } from '@vkontakte/vkontakte.service';
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
        private readonly vkontakteUserService: VkontakteUserService,
        private readonly vkontakteService: VkontakteService,
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
                    break;
                default:
                    if (message.includes('/add')) {
                        const nickname = message.substring(message.lastIndexOf('/') + 1);

                        resultMessage = await this.addUserToTracking(chatIDInTelegram, userIDInTelegram, nickname);
                    }
                    break;
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

    async addUserToTracking(chatIDInTelegram: number, userIDInTelegram: number, vkNickname: string): Promise<string> {
        const chat = await this.telegramChatService.findOneByChatIdInTelegram(chatIDInTelegram);

        if (!chat) {
            return TelegramMessage.CHAT_NOT_FOUND;
        }

        const telegramUser = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

        if (!telegramUser) {
            return TelegramMessage.CHAT_NOT_FOUND;
        }

        const vkontakteUser = await this.vkontakteUserService.findOneByNickName(vkNickname);

        if (!vkontakteUser) {
            const user = await this.vkontakteService.getUser(vkNickname);

            await this.vkontakteUserService.create({
                id: VkontakteUserID.new(),
                userIDInVkontakte: user.id,
                bdate: user.bdate,
                canAccessClosed: user.canAccessClosed,
                firstName: user.firstName,
                isClosed: user.isClosed,
                lastName: user.lastName,
                nickname: user.nickname,
                sex: user.sex,
            });

            return TelegramMessage.USER_SUCCESSFULLY_ADDED;
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
