import { MarkDownHelper } from '@common/helper/markdown.helper';
import { VK_URL } from '@vkontakte/constants/vk.constant';
import { VkontakteUserEntity } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.entity';

export class TelegramTextHelper {
    /**
     * The function `getTrackedList` takes an array of `VkontakteUserEntity` objects and returns a
     * formatted string containing a list of tracked users with their names and profile URLs.
     * @param {VkontakteUserEntity[]} trackedVkontakteUsers - An array of VkontakteUserEntity objects,
     * representing the tracked Vkontakte users.
     * @returns a string that contains a list of tracked Vkontakte users.
     */
    public static getTrackedList(trackedVkontakteUsers: VkontakteUserEntity[]): string {
        let text = 'Список отслеживаемых пользователей:\n';

        trackedVkontakteUsers.forEach((vkUser: VkontakteUserEntity, index: number) => {
            text += ++index + '\\)' + ' ' +
                MarkDownHelper.wrapTextWithUrl(
                    vkUser.firstName + ' ' + vkUser.lastName,
                    VK_URL + vkUser.screenName
                ) + '\n';
        });

        return text;
    }
}
