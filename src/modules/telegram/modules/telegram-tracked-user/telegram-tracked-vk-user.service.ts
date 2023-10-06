import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TelegramMessage } from '@telegram/constants/telegram';
import { VkontakteUserID } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';
import { EntityManager } from 'typeorm';

import { TelegramUserID } from '../telegram-user/domain/telegram-user.domain';
import { TelegramTrackedVkUserEntity } from './domain/telegram-tracked-vk-user.entity';


@Injectable()
export class TelegramTrackedVkUserService {
    constructor(@InjectEntityManager() private em: EntityManager) { }

    /**
     * The function addUserToTracking adds a new link between a Telegram user and a Vkontakte user to
     * the tracking system.
     * @param {TelegramUserID} telegramUserID - The telegramUserID parameter is the unique identifier
     * for a user on the Telegram platform. It is used to track the user's activity and interactions on
     * Telegram.
     * @param {VkontakteUserID} vkontakteUserID - The `vkontakteUserID` parameter is the unique
     * identifier of a user on the Vkontakte social media platform.
     * @returns the saved instance of the TelegramTrackedVkUserEntity.
     */
    async addUserToTracking(telegramUserID: TelegramUserID, vkontakteUserID: VkontakteUserID): Promise<TelegramTrackedVkUserEntity> {
        const oldLink = await this.em.findOneBy(TelegramTrackedVkUserEntity, { telegramUserID, vkontakteUserID });

        if (oldLink) {
            throw new BadRequestException('Пользователь уже добавлен к отслеживанию ❌');
        }

        const newLink = this.em.create(TelegramTrackedVkUserEntity, { telegramUserID, vkontakteUserID });
        return this.em.save(TelegramTrackedVkUserEntity, newLink);
    }

    /**
     * The function removes a user from tracking by deleting the link between their Telegram and
     * Vkontakte user IDs.
     * @param {TelegramUserID} telegramUserID - The `telegramUserID` parameter is the unique identifier
     * of a user in the Telegram messaging platform. It is used to identify the user who is being
     * tracked.
     * @param {VkontakteUserID} vkontakteUserID - The `vkontakteUserID` parameter is the ID of the user
     * on the Vkontakte platform.
     * @returns a Promise that resolves to a TelegramTrackedVkUserEntity object.
     */
    async removeUserFromTracking(telegramUserID: TelegramUserID, vkontakteUserID: VkontakteUserID): Promise<TelegramTrackedVkUserEntity> {
        const link = await this.em.findOneBy(TelegramTrackedVkUserEntity, { telegramUserID, vkontakteUserID });

        if (!link) {
            throw new BadRequestException('Пользователь не был добавлен к отслеживанию');
        }

        return this.em.remove(TelegramTrackedVkUserEntity, link);
    }

    async removeAllUsersFromTracking(telegramUserID: TelegramUserID): Promise<void> {
        const links = await this.em.findBy(TelegramTrackedVkUserEntity, { telegramUserID });

        if (links.length === 0) {
            throw new Error(TelegramMessage.TRACKED_VK_LIST_IS_EMPTY);
        }

        for (const link of links) {
            await this.em.remove(TelegramTrackedVkUserEntity, link);
        }
    }
}
