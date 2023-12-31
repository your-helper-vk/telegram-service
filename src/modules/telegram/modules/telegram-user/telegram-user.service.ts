import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { TelegramUserID } from './domain/telegram-user.domain';
import { TelegramUserEntity } from './domain/telegram-user.entity';
import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';

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
        const oldUser = await this.findOneByUserIDInTelegram(dto.userIDInTelegram);

        if (oldUser) {
            throw new BadRequestException('Telegram user already exists');
        }

        const user = this.em.create(TelegramUserEntity, { ...dto });

        return this.em.save(user);
    }

    /**
     * This function returns a promise that resolves to a TelegramUserEntity object or null based on the
     * provided userIDInTelegram.
     * @param {number} userIDInTelegram - The parameter `userIDInTelegram` is a number that
     * represents the unique identifier of a user in the Telegram messaging app.
     * @returns A Promise that resolves to either a TelegramUserEntity object with the specified
     * userIDInTelegram or null if no such user exists.
     */
    findOneByUserIDInTelegram(userIDInTelegram: number): Promise<TelegramUserEntity | null> {
        return this.em.findOneBy(TelegramUserEntity, { userIDInTelegram });
    }

    /**
     * This function returns a promise that resolves to a TelegramUserEntity object or null, based on the provided TelegramUserID.
     * @param {TelegramUserID} id - TelegramUserID - This is the unique identifier of the user entity that we want to retrieve. It is used to search for the user in the database.
     * @returns A Promise that resolves to either a TelegramUserEntity object with the specified ID or null if no such object exists.
     */
    findOneById(id: TelegramUserID): Promise<TelegramUserEntity | null> {
        return this.em.findOneBy(TelegramUserEntity, { id });
    }

    /**
     * The function `findTrackedUsers` returns a Telegram user entity with its related tracked
     * Vkontakte users.
     * @param {number} userIDInTelegram - The parameter `userIDInTelegram` is a number that represents
     * the user ID in the Telegram messaging platform.
     * @returns a Promise that resolves to a TelegramUserEntity object.
     */
    findTrackedUsers(userIDInTelegram: number): Promise<TelegramUserEntity> {
        return this.em.findOne(TelegramUserEntity, {
            where: { userIDInTelegram }, relations: {
                trackedVkontakteUsers: true,
            },
        });
    }

    /**
     * The function `findUsers` returns a promise that resolves to an array of `TelegramUserEntity`
     * objects, with their related `trackedVkontakteUsers` included.
     * @returns The function `findUsers()` returns a Promise that resolves to an array of
     * `TelegramUserEntity` objects.
     */
    findUsers(): Promise<TelegramUserEntity[]> {
        return this.em.find(TelegramUserEntity, {
            relations: {
                trackedVkontakteUsers: true,
            },
        });
    }
}
