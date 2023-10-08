import { getEnv } from '@common/helper/get-env.helper';
import { validateDto } from '@common/operation/validate-dto.operation';
import { telegramConfig } from '@config/telegram.config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VkontakteUserID } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserService } from '@vkontakte/modules/vkontakte-user/vkontakte-user.service';
import { VkontakteService } from '@vkontakte/services/vkontakte.service';
import { BotCommand, Message } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import { TelegramMessage, TelegramReplyMarkup } from './constants/telegram';
import { TelegramTextHelper } from './helper/telegram-text.helper';
import { TelegramChatID } from './modules/telegram-chat/domain/telegram-chat.domain';
import { CreateTelegramChatDto } from './modules/telegram-chat/dto/create-telegram-chat.dto';
import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramTrackedVkUserService } from './modules/telegram-tracked-user/telegram-tracked-vk-user.service';
import { TelegramUserID } from './modules/telegram-user/domain/telegram-user.domain';
import { CreateTelegramUserDto } from './modules/telegram-user/dto/create-telegram-user.dto';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger();
    private readonly telegramBot: TelegramBot;

    constructor(
        private readonly telegramUserService: TelegramUserService,
        private readonly telegramChatService: TelegramChatService,
        private readonly telegramTrackedVkUserService: TelegramTrackedVkUserService,
        private readonly vkontakteUserService: VkontakteUserService,
        private readonly vkontakteService: VkontakteService,
        private readonly configService: ConfigService,
    ) {
        this.telegramBot = new TelegramBot(getEnv(this.configService, 'TG_BOT_TOKEN'), telegramConfig);

        this.initialize();
    }

    initialize(): void {
        this.initializeCommand();
        this.initializeTelegram();
    }

    initializeTelegram(): void {
        this.telegramBot.on('polling_error', this.logger.log);

        this.telegramBot.on('message', async (messageInfo: Message) => {
            const message = messageInfo.text;
            const chatIDInTelegram = messageInfo.chat.id;
            const userIDInTelegram = messageInfo.from.id;
            try {


                let resultMessage = TelegramMessage.UNDEFINED_COMMAND;
                switch (message) {
                    case '/start':
                        resultMessage = await this.startCommand(userIDInTelegram, chatIDInTelegram);
                        break;
                    case '/tracked':
                        resultMessage = await this.trackedCommand(userIDInTelegram);
                        break;
                    case 'Список отслеживаемых пользователей':
                        resultMessage = await this.trackedCommand(userIDInTelegram);
                        break;
                    case 'Удалить всех пользователей из отслеживания':
                        resultMessage = await this.deleteAllTrackedUser(userIDInTelegram);
                        break;
                    default:
                        if (message.includes('/add')) {
                            const screenName = message.split(' ').pop();

                            resultMessage = await this.addUserToTrackingCommand(chatIDInTelegram, userIDInTelegram, screenName);
                        }
                        break;
                }

                await this.sendMessage(chatIDInTelegram, resultMessage);
            } catch (err) {
                this.logger.error(err);

                throw err;
            }
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

    async addUserToTrackingCommand(chatIDInTelegram: number, userIDInTelegram: number, screenName: string): Promise<string> {
        try {
            const chat = await this.telegramChatService.findOneByChatIDInTelegram(chatIDInTelegram);

            if (!chat) {
                return TelegramMessage.CHAT_NOT_FOUND;
            }

            const telegramUser = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

            if (!telegramUser) {
                return TelegramMessage.CHAT_NOT_FOUND;
            }

            const vkontakteUser = await this.vkontakteUserService.findOneByScreenName(screenName);

            if (!vkontakteUser) {
                const user = await this.vkontakteService.getUser(screenName);

                if (!user) {
                    return TelegramMessage.USER_NOT_FOUND;
                }

                if (user.isClosed || user.canAccessClosed === false) {
                    return TelegramMessage.USER_PROFILE_IS_CLOSED;
                }

                const vkontakteUserID = VkontakteUserID.new();

                await this.vkontakteUserService.create({
                    id: vkontakteUserID,
                    userIDInVkontakte: user.id,
                    bdate: user.bdate,
                    canAccessClosed: user.canAccessClosed,
                    firstName: user.firstName,
                    isClosed: user.isClosed,
                    lastName: user.lastName,
                    nickname: user.nickname,
                    screenName: user.screenName,
                    sex: user.sex,
                });

                const { items } = await this.vkontakteService.getFriends(user.id);

                await this.vkontakteUserService.saveFriends(user.id, items);

                await this.telegramTrackedVkUserService.addUserToTracking(telegramUser.id, vkontakteUserID);

                return TelegramMessage.USER_SUCCESSFULLY_ADDED;
            } else {
                if (vkontakteUser.isClosed || vkontakteUser.canAccessClosed === false) {
                    return TelegramMessage.USER_PROFILE_IS_CLOSED;
                }

                const { items } = await this.vkontakteService.getFriends(vkontakteUser.userIDInVkontakte);

                await this.vkontakteUserService.saveFriends(vkontakteUser.userIDInVkontakte, items);

                await this.telegramTrackedVkUserService.addUserToTracking(telegramUser.id, vkontakteUser.id);
                return TelegramMessage.USER_SUCCESSFULLY_ADDED;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                return error.message;
            }
        }
    }

    async deleteAllTrackedUser(userIDInTelegram: number): Promise<string> {
        try {
            const telegramUser = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

            if (!telegramUser) {
                throw new Error('Telegram user not found');
            }

            await this.telegramTrackedVkUserService.removeAllUsersFromTracking(telegramUser.id);

            return TelegramMessage.DELETE_TRACKED_VK_USERS_SUCCESSFULLY;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return error.message;
            }
        }
    }

    async trackedCommand(userIDInTelegram: number): Promise<string> {
        const telegramUser = await this.telegramUserService.findOneByUserIDInTelegram(userIDInTelegram);

        if (!telegramUser) {
            return TelegramMessage.USER_NOT_FOUND;
        }

        const { trackedVkontakteUsers } = await this.telegramUserService.findTrackedUsers(userIDInTelegram);

        if (trackedVkontakteUsers.length === 0) {
            return TelegramMessage.TRACKED_VK_LIST_IS_EMPTY;
        }

        return TelegramTextHelper.getTrackedList(trackedVkontakteUsers);
    }

    async initializeCommand(): Promise<void> {
        const BOT_COMMANDS: BotCommand[] = [
            { command: 'start', description: 'Начать' },
            { command: 'tracked', description: 'Список отслеживаемых пользователей' },
            { command: 'author', description: 'Об авторе' },
        ];

        await this.telegramBot.setMyCommands(BOT_COMMANDS);
    }

    sendMessage(chatID: number, message: string): Promise<Message> {
        return this.telegramBot.sendMessage(chatID, message, {
            // eslint-disable-next-line camelcase
            parse_mode: 'MarkdownV2',
            // eslint-disable-next-line camelcase
            reply_markup: TelegramReplyMarkup.reply_markup,
        });
    }
}
