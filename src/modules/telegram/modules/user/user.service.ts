import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserID } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectEntityManager() private em: EntityManager) { }

    /**
     * This function creates a new user entity if the user does not already exist.
     * @param {CreateUserDto} dto - CreateUserDto, which is an object containing the data needed to
     * create a new user entity.
     * @returns A Promise that resolves to a UserEntity object.
     */
    async create(dto: CreateUserDto): Promise<UserEntity> {
        const oldUser = await this.findOneByUserIdInTelegram(dto.userIdInTelegram);

        if (oldUser) {
            throw new BadRequestException('User already exists');
        }

        const user = this.em.create(UserEntity, { ...dto });

        return this.em.save(user);
    }

    /**
     * This function returns a promise that resolves to a UserEntity object or null based on the
     * provided userIdInTelegram.
     * @param {number} userIdInTelegram - The parameter `userIdInTelegram` is a number that
     * represents the unique identifier of a user in the Telegram messaging app.
     * @returns A Promise that resolves to either a UserEntity object with the specified
     * userIdInTelegram or null if no such user exists.
     */
    findOneByUserIdInTelegram(userIdInTelegram: number): Promise<UserEntity | null> {
        return this.em.findOneBy(UserEntity, { userIdInTelegram });
    }

    /**
     * This function returns a promise that resolves to a UserEntity object or null, based on the provided UserID.
     * @param {UserID} id - UserID - This is the unique identifier of the user entity that we want to retrieve. It is used to search for the user in the database.
     * @returns A Promise that resolves to either a UserEntity object with the specified ID or null if no such object exists.
     */
    findOneById(id: UserID): Promise<UserEntity | null> {
        return this.em.findOneBy(UserEntity, { id });
    }
}
