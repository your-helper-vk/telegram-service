import { Injectable } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VkontakteHelper } from '@vkontakte/helper/vkontakte.helper';
import { VkontakteFriendService } from '@vkontakte/modules/vkontakte-friend/vkontakte-friend.service';
import { VkontakteUserID } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserService } from '@vkontakte/modules/vkontakte-user/vkontakte-user.service';
import { VkontakteService } from '@vkontakte/vkontakte.service';

import { TelegramTextHelper } from './helper/telegram-text.helper';
import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramUserID } from './modules/telegram-user/domain/telegram-user.domain';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramTaskService {
    private readonly logger = new Logger();

    constructor(
        private readonly vkontakteUserService: VkontakteUserService,
        private readonly vkontakteService: VkontakteService,
        private readonly vkontakteFriendService: VkontakteFriendService,
        private readonly telegramUserService: TelegramUserService,
        private readonly telegramService: TelegramService,
        private readonly telegramChatService: TelegramChatService,
    ) { }

    /**
     * Проходит по всем отслеживаемым пользователям и проверяет друзей
     * Смотрит новых/удаленных друзей и отсылает сообщение в телеграмм
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async checkTrackedFriends(): Promise<void> {
        this.logger.log('Старт проверки отслеживаемых пользователей');

        const telegramTrackedUsers = await this.telegramUserService.findUsers();

        const usersMap = new Map<
            { id: VkontakteUserID; userIDInVkontakte: number },
            { id: TelegramUserID; userIDInTelegram: number }[]>();

        for (const telegramTrackedUser of telegramTrackedUsers) {

            for (const trackedVkontakteUser of telegramTrackedUser.trackedVkontakteUsers) {

                const key = { id: trackedVkontakteUser.id, userIDInVkontakte: trackedVkontakteUser.userIDInVkontakte };

                const value = { id: telegramTrackedUser.id, userIDInTelegram: telegramTrackedUser.userIDInTelegram };

                if (usersMap.has(key)) {
                    const usersInMap = usersMap.get({ id: trackedVkontakteUser.id, userIDInVkontakte: trackedVkontakteUser.userIDInVkontakte });

                    usersInMap.push({ id: telegramTrackedUser.id, userIDInTelegram: telegramTrackedUser.userIDInTelegram });
                } else {
                    usersMap.set(key, [value]);
                }
            }
        }

        for (const [key, value] of usersMap.entries()) {
            const oldFriendsIDsInDatabase = await this.vkontakteFriendService.findFriendVkontakteUserIDs(key.id);

            const actualFriends = await this.vkontakteService.getFriends(key.userIDInVkontakte);

            await this.vkontakteUserService.saveFriends(key.userIDInVkontakte, actualFriends.items);

            const smashFriendInfo = VkontakteHelper.smashFriendsByUserIdsInVkontakte(oldFriendsIDsInDatabase, actualFriends.items.map(item => item.id));

            const [newFriends, deletedFriends] = await Promise.all([
                await Promise.all(smashFriendInfo.newFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
                await Promise.all(smashFriendInfo.deletedFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
            ]);

            const trackedVkontakteUser = await this.vkontakteUserService.findOneByUserIDInVkontakte(key.userIDInVkontakte);

            this.logger.log(`Проверяем пользователя ${trackedVkontakteUser.firstName} ${trackedVkontakteUser.lastName}`);

            for (const tgUser of value) {

                if (newFriends.length > 0 || deletedFriends.length > 0) {
                    const resultMessage = TelegramTextHelper.getChangeFriendsListText(
                        trackedVkontakteUser,
                        newFriends,
                        deletedFriends
                    );

                    this.logger.log(`Отправляем сообщение для userIDInTelegram ${tgUser.userIDInTelegram}`);
                    await this.telegramService.sendMessage(tgUser.userIDInTelegram, resultMessage);
                }
            }
        }
        this.logger.log('Проверка пользователей окончена');
    }
}
