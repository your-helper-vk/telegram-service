import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { TelegramUserID } from './domain/telegram-user.domain';
import { TelegramUserEntity } from './domain/telegram-user.entity';
import { CreateTelegramUserDto } from './dto/create-user.dto';

@Injectable()
export class TelegramUserService {
    constructor(@InjectEntityManager() private em: EntityManager) { }

    /**
     * This function creates a new user entity if the user does not already exist.
     * @param {CreateTelegramUserDto} dto - CreateTelegramUserDto, which is an object containing the data needed to
     * create a new user entity.
     * @returns A Promise that resolves to a TelegramUserEntity object.
     */
    async create(dto: CreateTelegramUserDto): Promise<TelegramUserEntity> {
        const oldUser = await this.findOneByTelegramUserIDInTelegram(dto.TelegramUserIDInTelegram);

        if (oldUser) {
            throw new BadRequestException('Telegram user already exists');
        }

        const user = this.em.create(TelegramUserEntity, { ...dto });

        return this.em.save(user);
    }

    /**
     * This function returns a promise that resolves to a TelegramUserEntity object or null based on the
     * provided TelegramUserIDInTelegram.
     * @param {number} TelegramUserIDInTelegram - The parameter `TelegramUserIDInTelegram` is a number that
     * represents the unique identifier of a user in the Telegram messaging app.
     * @returns A Promise that resolves to either a TelegramUserEntity object with the specified
     * TelegramUserIDInTelegram or null if no such user exists.
     */
    findOneByTelegramUserIDInTelegram(TelegramUserIDInTelegram: number): Promise<TelegramUserEntity | null> {
        return this.em.findOneBy(TelegramUserEntity, { TelegramUserIDInTelegram });
    }

    /**
     * This function returns a promise that resolves to a TelegramUserEntity object or null, based on the provided TelegramUserID.
     * @param {TelegramUserID} id - TelegramUserID - This is the unique identifier of the user entity that we want to retrieve. It is used to search for the user in the database.
     * @returns A Promise that resolves to either a TelegramUserEntity object with the specified ID or null if no such object exists.
     */
    findOneById(id: TelegramUserID): Promise<TelegramUserEntity | null> {
        return this.em.findOneBy(TelegramUserEntity, { id });
    }
}
