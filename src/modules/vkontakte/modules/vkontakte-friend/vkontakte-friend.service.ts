import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { VkontakteUserID } from '../vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteFriendEntity } from './domain/vkontakte-friend.entity';

@Injectable()
export class VkontakteFriendService {
    constructor(@InjectEntityManager() private readonly em: EntityManager) { }

    /**
     * The function adds a new friend link between two Vkontakte users and returns the newly created
     * friend entity.
     * @param {VkontakteUserID} vkontakteUserID - The Vkontakte user ID of the user who wants to add a
     * friend.
     * @param {VkontakteUserID} vkontakteFriendUserID - The parameter "vkontakteFriendUserID" is the ID
     * of the friend user on Vkontakte.
     * @returns a Promise that resolves to a VkontakteFriendEntity object.
     */
    addFriend(vkontakteUserID: VkontakteUserID, vkontakteFriendUserID: VkontakteUserID): Promise<VkontakteFriendEntity> {
        const newLink = this.em.create(VkontakteFriendEntity, {
            vkontakteUserID,
            vkontakteFriendUserID,
        });

        return this.em.save(VkontakteFriendEntity, newLink);
    }


    /**
     * The function removes a friend relation between two Vkontakte users.
     * @param {VkontakteUserID} vkontakteUserID - The vkontakteUserID parameter represents the ID of the
     * user who wants to remove a friend.
     * @param {VkontakteUserID} vkontakteFriendUserID - The parameter "vkontakteFriendUserID" is the ID
     * of the friend that you want to remove from the user's friend list on Vkontakte.
     * @returns a Promise that resolves to a VkontakteFriendEntity object.
     */
    async removeFriend(vkontakteUserID: VkontakteUserID, vkontakteFriendUserID: VkontakteUserID): Promise<VkontakteFriendEntity> {
        const link = await this.em.findOneBy(VkontakteFriendEntity, { vkontakteUserID, vkontakteFriendUserID });

        if (!link) {
            throw new BadRequestException('Relation not found for delete friend');
        }

        return this.em.remove(VkontakteFriendEntity, link);
    }

    /**
     * The function "findFriend" takes in two Vkontakte user IDs and returns a promise that resolves to VkontakteFriendEntity or null.
     * @param {VkontakteUserID} vkontakteUserID - The Vkontakte user ID of the user for whom we want to find a friend.
     * @param {VkontakteUserID} vkontakteFriendUserID - The parameter "vkontakteFriendUserID" is the ID of the friend on Vkontakte.
     * @returns a Promise that resolves to either a VkontakteFriendEntity object or null.
     */
    findFriend(vkontakteUserID: VkontakteUserID, vkontakteFriendUserID: VkontakteUserID): Promise<VkontakteFriendEntity | null> {
        return this.em.findOneBy(VkontakteFriendEntity, { vkontakteUserID, vkontakteFriendUserID });
    }

    /**
     * The function "findFriends" takes a Vkontakte user ID as input and returns a promise that resolves
     * to an array of Vkontakte friend entities.
     * @param {VkontakteUserID} vkontakteUserID - The `vkontakteUserID` parameter is the ID of a user on
     * the Vkontakte social media platform.
     * @returns a Promise that resolves to an array of VkontakteFriendEntity objects.
     */
    findFriends(vkontakteUserID: VkontakteUserID): Promise<VkontakteFriendEntity[]> {
        return this.em.findBy(VkontakteFriendEntity, { vkontakteUserID });
    }

    /**
     * The function "findFriendVkontakteUserIDs" takes a Vkontakte user ID as input and returns an
     * array of user IDs for the user's friends.
     * @param {VkontakteUserID} vkontakteUserID - The `vkontakteUserID` parameter is the ID of a user
     * in the Vkontakte social media platform.
     * @returns an array of numbers, which are the user IDs of the friends of the specified Vkontakte
     * user.
     */
    async findFriendVkontakteUserIDs(vkontakteUserID: VkontakteUserID): Promise<number[]> {
        const user = await this.em.find(VkontakteFriendEntity, {
            where: { vkontakteUserID },
            relations: {
                vkontakteFriend: true,
            },
        });

        return user
            ? user.map(friendEntity => friendEntity.vkontakteFriend.userIDInVkontakte)
            : [];
    }
}
