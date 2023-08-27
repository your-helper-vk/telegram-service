import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { VkontakteUserDto } from '@vkontakte/dto/vkontakte-user.dto';
import { EntityManager } from 'typeorm';

import { VkontakteFriendService } from '../vkontakte-friend/vkontakte-friend.service';
import { VkontakteUserID } from './domain/vkontakte-user.domain';
import { VkontakteUserEntity } from './domain/vkontakte-user.entity';
import { CreateVkontakteUserDto } from './dto/create-vkontakte-user.dto';

@Injectable()
export class VkontakteUserService {
    constructor(
        private readonly vkonkateFriendService: VkontakteFriendService,
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
     * The `saveFriends` function saves a list of friends for a given user in the VKontakte social
     * network, by checking if each friend is already saved in the database and adding them if
     * necessary.
     * @param {string} screenName - The screen name of the VKontakte user for whom the friends are
     * being saved.
     * @param {VkontakteUserDto[]} friends - An array of objects representing friends of a user on
     * Vkontakte. Each object in the array should have the following properties:
     */
    async saveFriends(screenName: string, friends: VkontakteUserDto[]): Promise<void> {
        const user = await this.findOneByScreenName(screenName);

        if (!user) {
            throw new NotFoundException(`Пользователь VK с ${screenName} не найден`);
        }

        // Проходим для каждого друга
        for (const friend of friends) {
            const friendUser = await this.findOneByUserIDInVkontakte(friend.id);
            const { id, ...friendWithoutId } = friend;

            // Если пользователь не сохранён в нашей базе из ВК, то сохраняем в нашей базе
            if (!friendUser) {
                const newUserId = VkontakteUserID.new();
                await this.create({
                    id: newUserId,
                    userIDInVkontakte: id,
                    ...friendWithoutId,
                });

                // Добавляем в список друзей
                await this.vkonkateFriendService.addFriend(
                    user.id,
                    newUserId,
                );
            } else {
                // Ищем пользователя в списке друзей, если его нет, то добавляем
                const oldFriend = await this.vkonkateFriendService.findFriend(
                    user.id,
                    friendUser.id,
                );

                if (!oldFriend) {
                    await this.vkonkateFriendService.addFriend(user.id, friendUser.id);
                }
            }
        }
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
