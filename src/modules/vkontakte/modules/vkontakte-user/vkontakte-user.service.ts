import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { VkontakteUserDto } from '@vkontakte/dto/vkontakte-user.dto';
import { VkontakteHelper } from '@vkontakte/helper/vkontakte.helper';
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
            throw new BadRequestException(`Пользователь ВК уже сохранён ${dto.userIDInVkontakte}`);
        }

        const newVkUser = this.em.create(VkontakteUserEntity, { ...dto });

        return this.em.save(VkontakteUserEntity, newVkUser);
    }

    /**
     * This function saves a user's friends in a VKontakte social media platform by adding new friends
     * and removing deleted friends.
     * @param {number} userIDInVkontakte - The userIDInVkontakte parameter is the ID of the user in the
     * Vkontakte social network. It is a number that uniquely identifies the user in Vkontakte.
     * @param {VkontakteUserDto[]} friends - An array of objects representing the friends of a user in
     * Vkontakte. Each object in the array should have the following properties:
     */
    async saveFriends(userIDInVkontakte: number, friends: VkontakteUserDto[]): Promise<void> {
        const user = await this.findOneByUserIDInVkontakte(userIDInVkontakte);

        if (!user) {
            throw new NotFoundException(`Пользователь VK с id ${userIDInVkontakte} не найден`);
        }

        // VkontakteUserID Старых друзей
        const oldFriendsIDs = await this.vkonkateFriendService.findFriendVkontakteUserIDs(user.id);
        const newFriendsIDs = friends.map(friend => friend.id);

        // Список новых/старых/удаленных друзей
        const smashedFriendsIDs = VkontakteHelper.smashFriendsByUserIdsInVkontakte(oldFriendsIDs, newFriendsIDs);

        // Сначала добавляем новых друзей
        for (const newFriendID of smashedFriendsIDs.newFriends) {
            const { id, ...friendWithoutId } = friends.find(item => item.id === newFriendID);

            // Ищем пользователя в нашей базе, если он уже создан, то просто добавляем его в друзья
            const newFriendVkDatabase = await this.findOneByUserIDInVkontakte(id);

            if (!newFriendVkDatabase) {
                // Создаем друга в нашей базе ВК
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
                // Просто добавляем в список друзей
                await this.vkonkateFriendService.addFriend(
                    user.id,
                    newFriendVkDatabase.id,
                );
            }
        }

        // Удаляем друзей из списка
        for (const deletedFriendID of smashedFriendsIDs.deletedFriends) {
            const deletedUser = await this.findOneByUserIDInVkontakte(deletedFriendID);

            if (!deletedUser) {
                throw new BadRequestException(`Не пользователь для удаления, id: ${deletedFriendID}`);
            }

            await this.vkonkateFriendService.removeFriend(user.id, deletedUser.id);
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

    /**
     * The function "findUsers" returns a promise that resolves to an array of VkontakteUserEntity
     * objects.
     * @returns The function `findUsers()` returns a Promise that resolves to an array of
     * `VkontakteUserEntity` objects.
     */
    findUsers(): Promise<VkontakteUserEntity[]> {
        return this.em.find(VkontakteUserEntity);
    }

    /**
     * The function "findFriends" retrieves a Vkontakte user entity along with their following
     * relations based on the provided Vkontakte user ID.
     * @param {VkontakteUserID} vkontakteUserID - The `vkontakteUserID` parameter is the ID of a user
     * on the Vkontakte social media platform.
     * @returns The function `findFriends` returns a Promise that resolves to either a
     * `VkontakteUserEntity` object or `null`.
     */
    findFriends(vkontakteUserID: VkontakteUserID): Promise<VkontakteUserEntity | null> {
        return this.em.findOne(VkontakteUserEntity, {
            where: { id: vkontakteUserID },
            relations: {
                following: true,
            },
        });
    }
}
