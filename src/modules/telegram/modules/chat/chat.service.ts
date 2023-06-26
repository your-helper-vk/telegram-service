import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserService } from '../user/user.service';
import { ChatEntity } from './domain/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectEntityManager() private readonly em: EntityManager,
        private readonly userService: UserService,
    ) { }

    /**
     * This function creates a new chat entity if it does not already exist.
     * @param {CreateChatDto} dto - CreateChatDto, which is a data transfer object containing information needed to create a new ChatEntity.
     * @returns A Promise that resolves to a ChatEntity object.
     */
    async create(dto: CreateChatDto): Promise<ChatEntity> {
        const oldChat = await this.em.findOneBy(ChatEntity, { chatIdInTelegram: dto.chatIdInTelegram });

        if (oldChat) {
            throw new BadRequestException('Chat already exists');
        }

        const user = await this.userService.findOneById(dto.userID);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const newChat = this.em.create(ChatEntity, {
            id: dto.id,
            chatIdInTelegram: dto.chatIdInTelegram,
            user,
        });

        return this.em.save(newChat);
    }

    /**
     * This function finds a chat entity by its chat ID in Telegram and returns it as a promise.
     * @param {number} chatIdInTelegram - The chatIdInTelegram parameter is a number that represents the unique identifier of a chat in the Telegram messaging app.
     * ChatEntity object in the database that matches the specified chatIdInTelegram.
     * @returns A Promise that resolves to either a ChatEntity object or null.
     */
    findOneByChatIdInTelegram(chatIdInTelegram: number): Promise<ChatEntity | null> {
        return this.em.findOneBy(ChatEntity, { chatIdInTelegram });
    }
}
