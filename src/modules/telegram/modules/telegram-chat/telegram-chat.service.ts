import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { TelegramUserID } from '../telegram-user/domain/telegram-user.domain';
import { TelegramUserService } from '../telegram-user/telegram-user.service';
import { TelegramChatEntity } from './domain/telegram-chat.entity';
import { CreateTelegramChatDto } from './dto/create-telegram-chat.dto';

@Injectable()
export class TelegramChatService {
    constructor(
        @InjectEntityManager() private readonly em: EntityManager,
        private readonly telegramUserService: TelegramUserService,
    ) { }

    /**
     * This function creates a new chat entity if it does not already exist.
     * @param {CreateTelegramChatDto} dto - CreateTelegramChatDto, which is a data transfer object containing information needed to create a new TelegramChatEntity.
     * @returns A Promise that resolves to a TelegramChatEntity object.
     */
    async create(dto: CreateTelegramChatDto): Promise<TelegramChatEntity> {
        const oldChat = await this.em.findOneBy(TelegramChatEntity, { chatIdInTelegram: dto.chatIDInTelegram });

        if (oldChat) {
            throw new BadRequestException('Телеграм чат уже сохранён');
        }

        const user = await this.telegramUserService.findOneById(dto.telegramUserID);

        if (!user) {
            throw new BadRequestException('Телеграм пользователь не найден');
        }

        const newChat = this.em.create(TelegramChatEntity, {
            id: dto.id,
            chatIdInTelegram: dto.chatIDInTelegram,
            user,
        });

        return this.em.save(newChat);
    }

    /**
     * This function finds a chat entity by its chat ID in Telegram and returns it as a promise.
     * @param {number} chatIdInTelegram - The chatIdInTelegram parameter is a number that represents the unique identifier of a chat in the Telegram messaging app.
     * TelegramChatEntity object in the database that matches the specified chatIdInTelegram.
     * @returns A Promise that resolves to either a TelegramChatEntity object or null.
     */
    findOneByChatIDInTelegram(chatIdInTelegram: number): Promise<TelegramChatEntity | null> {
        return this.em.findOneBy(TelegramChatEntity, { chatIdInTelegram });
    }

    /**
     * The function "findChatByUserTelegramId" returns a Promise that resolves to a TelegramChatEntity
     * or null, based on the provided TelegramUserID.
     * @param {TelegramUserID} telegramUserID - The `telegramUserID` parameter is the unique identifier
     * for a user in the Telegram messaging platform. It is used to identify a specific user in order
     * to retrieve their associated chat entity.
     * @returns a Promise that resolves to either a TelegramChatEntity object or null.
     */
    findChatByUserTelegramId(telegramUserID: TelegramUserID): Promise<TelegramChatEntity | null> {
        return this.em.findOneBy(TelegramChatEntity, { telegramUserID });
    }
}
