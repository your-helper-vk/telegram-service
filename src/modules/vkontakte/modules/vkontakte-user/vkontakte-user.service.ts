import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { VkontakteUserEntity } from './domain/vkontakte-user.entity';
import { CreateVkontakteUserDto } from './dto/create-vkontakte-user.dto';

@Injectable()
export class VkontakteUserService {
    constructor(
        @InjectEntityManager() private readonly em: EntityManager,
    ) { }

    /**
     * The function creates a new Vkontakte user entity after validating the input and checking if the
     * user already exists.
     * @param {CreateVkontakteUserDto} dto - The `dto` parameter is an object of type
     * `CreateVkontakteUserDto`. It contains the data needed to create a new Vkontakte user.
     * @returns a Promise that resolves to a VkontakteUserEntity object.
     */
    async create(dto: CreateVkontakteUserDto): Promise<VkontakteUserEntity> {
        const oldVkUser = await this.findOneByUserIDInVkontakte(dto.userIDInVkontakte);

        if (oldVkUser) {
            throw new BadRequestException('Vkontakte user already exists');
        }

        const newVkUser = this.em.create(VkontakteUserEntity, { ...dto });

        return this.em.save(VkontakteUserEntity, newVkUser);
    }

    /**
     * The function `findOneByUserIDInVkontakte` returns a promise that resolves to a
     * `VkontakteUserEntity` object or `null` based on the provided `userIDInVkontakte`.
     * @param {number} userIDInVkontakte - The parameter `userIDInVkontakte` is a number that
     * represents the user ID in the Vkontakte social media platform.
     * @returns a Promise that resolves to either a VkontakteUserEntity object or null.
     */
    findOneByUserIDInVkontakte(userIDInVkontakte: number): Promise<VkontakteUserEntity | null> {
        return this.em.findOneBy(VkontakteUserEntity, { userIDInVkontakte });
    }

    /**
     * The function `findOneByNickName` returns a promise that resolves to a `VkontakteUserEntity`
     * object or `null` based on the provided nickname.
     * @param {string} nickname - The `nickname` parameter is a string that represents the nickname of
     * a user.
     * @returns a Promise that resolves to either a VkontakteUserEntity object or null.
     */
    findOneByNickName(nickname: string): Promise<VkontakteUserEntity | null> {
        return this.em.findOneBy(VkontakteUserEntity, { nickname });
    }

    /**
     * The function `findOneByScreenName` returns a promise that resolves to a `VkontakteUserEntity`
     * object or `null` based on the provided screenName.
     * @param {string} nickname - The `screenName` parameter is a string that represents the screenName of a user.
     * @returns a Promise that resolves to either a VkontakteUserEntity object or null.
     */
    findOneByScreenName(screenName: string): Promise<VkontakteUserEntity | null> {
        return this.em.findOneBy(VkontakteUserEntity, { screenName });
    }
}
