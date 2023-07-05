import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

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
        const oldChat = await this.em.findOneBy(TelegramChatEntity, { chatIdInTelegram: dto.chatIdInTelegram });

        if (oldChat) {
            throw new BadRequestException('Chat already exists');
        }

        const user = await this.telegramUserService.findOneById(dto.TelegramUserID);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const newChat = this.em.create(TelegramChatEntity, {
            id: dto.id,
            chatIdInTelegram: dto.chatIdInTelegram,
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
    findOneByChatIdInTelegram(chatIdInTelegram: number): Promise<TelegramChatEntity | null> {
        return this.em.findOneBy(TelegramChatEntity, { chatIdInTelegram });
    }
}
