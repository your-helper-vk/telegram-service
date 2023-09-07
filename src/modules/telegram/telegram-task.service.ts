import { Injectable } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VkontakteHelper } from '@vkontakte/helper/vkontakte.helper';
import { VkontakteFriendService } from '@vkontakte/modules/vkontakte-friend/vkontakte-friend.service';
import { VkontakteUserService } from '@vkontakte/modules/vkontakte-user/vkontakte-user.service';
import { VkontakteService } from '@vkontakte/vkontakte.service';

import { TelegramTextHelper } from './helper/telegram-text.helper';
import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
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
        for (const telegramTrackedUser of telegramTrackedUsers) {
            const telegramChat = await this.telegramChatService.findChatByUserTelegramId(telegramTrackedUser.id);

            this.logger.log('Проверка отслеживаемых пользователей для ' + telegramTrackedUser.userIDInTelegram);
            for (const trackedVkontakteUser of telegramTrackedUser.trackedVkontakteUsers) {
                this.logger.log('Пользователь ' + trackedVkontakteUser.firstName + ' ' + trackedVkontakteUser.lastName);
                const oldFriendsIDsInDatabase = await this.vkontakteFriendService.findFriendVkontakteUserIDs(trackedVkontakteUser.id);

                const actualFriends = await this.vkontakteService.getFriends(trackedVkontakteUser.userIDInVkontakte);

                await this.vkontakteUserService.saveFriends(trackedVkontakteUser.userIDInVkontakte, actualFriends.items);

                const smashFriendInfo = VkontakteHelper.smashFriendsByUserIdsInVkontakte(oldFriendsIDsInDatabase, actualFriends.items.map(item => item.id));

                const [newFriends, deletedFriends] = await Promise.all([
                    await Promise.all(smashFriendInfo.newFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
                    await Promise.all(smashFriendInfo.deletedFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
                ]);

                if (newFriends.length > 0 || deletedFriends.length > 0) {
                    const resultMessage = TelegramTextHelper.getChangeFriendsListText(newFriends, deletedFriends);
                    await this.telegramService.sendMessage(telegramChat.chatIdInTelegram, resultMessage);
                }
            }
            this.logger.log('Проверка отслеживаемых пользователей окончена для ' + telegramTrackedUser.userIDInTelegram);
        }
        this.logger.log('Проверка пользователей окончена');
    }
}
