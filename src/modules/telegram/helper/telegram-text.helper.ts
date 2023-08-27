import { MarkDownHelper } from '@common/helper/markdown.helper';
import { VK_URL } from '@vkontakte/constants/vk.constant';
import { VkontakteUserEntity } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.entity';

export class TelegramTextHelper {
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
