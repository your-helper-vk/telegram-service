import { VkontakteFriendEntity } from '@vkontakte/modules/vkontakte-friend/domain/vkontakte-friend.entity';
import { Vkontakte } from 'types';

export class VkontakteHelper {
    /**
     * The function takes in two arrays of VkontakteFriendEntity objects and returns an object
     * containing three arrays - deletedFriends, newFriends, and oldFriends - based on the comparison
     * of the two input arrays.
     * @param {VkontakteFriendEntity[]} oldArrayVkFriends - An array of objects representing the old
     * list of Vkontakte friends.
     * @param {VkontakteFriendEntity[]} newArrayVkFriends - An array of VkontakteFriendEntity objects
     * representing the new list of friends.
     * @returns an object of type `Vkontakte.FriendsActualInfo`. This object contains three properties:
     * `deletedFriends`, `newFriends`, and `oldFriends`. Each property is an array of
     * `VkontakteFriendEntity` objects.
     */
    public static smashFriendsByFriendEntity(oldArrayVkFriends: VkontakteFriendEntity[], newArrayVkFriends: VkontakteFriendEntity[]): Vkontakte.FriendsActualInfoEntity {
        const oldFriends: VkontakteFriendEntity[] = [];
        const deletedFriends: VkontakteFriendEntity[] = [];
        const newFriends: VkontakteFriendEntity[] = [];

        oldArrayVkFriends.forEach((oldArrayVkFriend) => {
            // Если друг уже был добавлен в друзья
            if (newArrayVkFriends.includes(oldArrayVkFriend)) {
                oldFriends.push(oldArrayVkFriend);
            }

            // Если в новом списке друзей нету старого друга
            if (!newArrayVkFriends.includes(oldArrayVkFriend)) {
                deletedFriends.push(oldArrayVkFriend);
            }
        });

        newArrayVkFriends.forEach((newArrayVkFriend) => {
            // Если в старом списке друзей нету пользователя
            if (!oldArrayVkFriends.includes(newArrayVkFriend)) {
                newFriends.push(newArrayVkFriend);
            }
        });

        return {
            oldFriends,
            newFriends,
            deletedFriends,
        };
    }

    /**
     * The function takes two arrays of VKontakte friend IDs and returns an object containing the IDs
     * of old friends, new friends, and deleted friends.
     * @param {number[]} oldArrayVkFriendIDs - An array of numbers representing the IDs of friends in
     * the old list.
     * @param {number[]} newArrayVkFriendIDs - An array of numbers representing the user IDs of friends
     * in Vkontakte that are in the new list of friends.
     * @returns an object of type `Vkontakte.FriendsActualInfoID` with three properties: `oldFriends`,
     * `newFriends`, and `deletedFriends`.
     */
    public static smashFriendsByUserIdsInVkontakte(oldArrayVkFriendIDs: number[], newArrayVkFriendIDs: number[]): Vkontakte.FriendsActualInfoID {
        const oldFriends: number[] = [];
        const deletedFriends: number[] = [];
        const newFriends: number[] = [];

        oldArrayVkFriendIDs.forEach((oldArrayVkFriendID) => {
            // Если друг уже был добавлен в друзья
            if (newArrayVkFriendIDs.includes(oldArrayVkFriendID)) {
                oldFriends.push(oldArrayVkFriendID);
            }

            // Если в новом списке друзей нету старого друга
            if (!newArrayVkFriendIDs.includes(oldArrayVkFriendID)) {
                deletedFriends.push(oldArrayVkFriendID);
            }
        });

        newArrayVkFriendIDs.forEach((newArrayVkFriendID) => {
            // Если в старом списке друзей нету пользователя
            if (!oldArrayVkFriendIDs.includes(newArrayVkFriendID)) {
                newFriends.push(newArrayVkFriendID);
            }
        });

        return {
            oldFriends,
            newFriends,
            deletedFriends,
        };
    }
}
