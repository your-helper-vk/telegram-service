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

    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleCron() {
        const telegramTrackedUsers = await this.telegramUserService.findUsers();
        this.logger.log('Start cron for check users');
        for (const telegramTrackedUser of telegramTrackedUsers) {
            const telegramChat = await this.telegramChatService.findChatByUserTelegramId(telegramTrackedUser.id);

            this.logger.log('Start check for user id ' + telegramTrackedUser.userIDInTelegram);
            for (const trackedVkontakteUser of telegramTrackedUser.trackedVkontakteUsers) {
                const oldFriendsIDsInDatabase = await this.vkontakteFriendService.findFriendVkontakteUserIDs(trackedVkontakteUser.id);

                const actualFriends = await this.vkontakteService.getFriends(trackedVkontakteUser.userIDInVkontakte);

                await this.vkontakteUserService.saveFriends(trackedVkontakteUser.userIDInVkontakte, actualFriends.items);

                const smashFriendInfo = VkontakteHelper.smashFriendsByUserIdsInVkontakte(oldFriendsIDsInDatabase, actualFriends.items.map(item => item.id));

                const [newFriends, deletedFriends] = await Promise.all([
                    await Promise.all(smashFriendInfo.newFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
                    await Promise.all(smashFriendInfo.deletedFriends.map(async (newFriendID) => await this.vkontakteUserService.findOneByUserIDInVkontakte(newFriendID))),
                ]);

                const resultMessage = TelegramTextHelper.getChangeFriendsListText(newFriends, deletedFriends);

                await this.telegramService.sendMessage(telegramChat.chatIdInTelegram, resultMessage);
            }
        }
    }
}
