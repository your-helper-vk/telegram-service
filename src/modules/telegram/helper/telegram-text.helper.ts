import { MarkDownHelper } from '@common/helper/markdown.helper';
import { VK_URL } from '@vkontakte/constants/vk.constant';
import { VkontakteUserEntity } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.entity';

export class TelegramTextHelper {
    private static readonly CHANGE_NOT_FOUND = 'Изменений не найдено';
    private static readonly LIST_OF_NEW_FRIENDS = 'Список новых друзей';
    private static readonly LIST_OF_DELETED_FRIENDS = 'Список удаленных друзей';

    /**
     * The function `getTrackedList` takes an array of `VkontakteUserEntity` objects and returns a
     * formatted string containing a list of tracked users with their names and profile URLs.
     * @param {VkontakteUserEntity[]} trackedVkontakteUsers - An array of VkontakteUserEntity objects,
     * representing the tracked Vkontakte users.
     * @returns a string that contains a list of tracked Vkontakte users.
     */
    public static getTrackedList(trackedVkontakteUsers: VkontakteUserEntity[]): string {
        let text = '';

        trackedVkontakteUsers.forEach((vkUser: VkontakteUserEntity, index: number) => {
            text += ++index + '\\)' + ' ' +
                MarkDownHelper.wrapTextWithUrl(
                    vkUser.firstName + ' ' + vkUser.lastName,
                    VK_URL + vkUser.screenName
                ) + '\n';
        });

        return text;
    }

    public static getChangeFriendsListText(
        user: VkontakteUserEntity,
        newFriends: VkontakteUserEntity[],
        deletedFriends: VkontakteUserEntity[]
    ): string {
        if (newFriends.length === 0 && deletedFriends.length === 0) {
            return this.CHANGE_NOT_FOUND;
        }

        if (newFriends.length === 0 && deletedFriends.length !== 0) {

            return this.LIST_OF_DELETED_FRIENDS +
                ' ' +
                MarkDownHelper.wrapTextWithUrl(
                    user.firstName + ' ' + user.lastName, VK_URL + user.screenName
                ) + ' :\n' +
                this.getTrackedList(deletedFriends);
        }

        if (newFriends.length !== 0 && deletedFriends.length === 0) {
            return this.LIST_OF_NEW_FRIENDS +
                ' ' +
                MarkDownHelper.wrapTextWithUrl(
                    user.firstName + ' ' + user.lastName, VK_URL + user.screenName
                ) + ' :\n' +
                this.getTrackedList(newFriends);
        }

        return this.LIST_OF_NEW_FRIENDS +
            ' ' +
            MarkDownHelper.wrapTextWithUrl(
                user.firstName + ' ' + user.lastName, VK_URL + user.screenName
            ) +
            ' :\n' +
            this.getTrackedList(newFriends) +
            '\n\n' +
            this.LIST_OF_DELETED_FRIENDS +
            ':\n' +
            this.getTrackedList(deletedFriends);
    }

    /**
     * The function takes an array of Vkontakte user entities and returns a string containing the
     * users' names wrapped in Markdown links to their profiles.
     * @param {VkontakteUserEntity[]} users - An array of VkontakteUserEntity objects. Each object
     * represents a user and contains properties such as firstName, lastName, and screenName.
     * @returns a string that contains the names of the users, wrapped with URLs. Each user's name is
     * concatenated with their first name and last name, and the resulting string is wrapped with a URL
     * using the VK_URL and the user's screen name. The names are separated by newlines.
     */
    getUsersTextWithUrl(users: VkontakteUserEntity[]): string {
        return users.reduce((text, user) => {
            text += MarkDownHelper.wrapTextWithUrl(
                user.firstName + ' ' + user.lastName,
                VK_URL + user.screenName
            ) + '\n';

            return text;
        }, '');
    }
}
