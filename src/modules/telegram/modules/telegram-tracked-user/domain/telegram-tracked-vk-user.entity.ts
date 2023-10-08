import { VkontakteUserID } from 'src/modules/vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserEntity } from 'src/modules/vkontakte/modules/vkontakte-user/domain/vkontakte-user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TelegramUserID } from '../../telegram-user/domain/telegram-user.domain';
import { TelegramUserEntity } from '../../telegram-user/domain/telegram-user.entity';

@Entity({ name: 'telegram_tracked_vk_users' })
export class TelegramTrackedVkUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'telegram_user_id', type: 'uuid' })
    telegramUserID: TelegramUserID;

    @Column({ name: 'vkontakte_user_id', type: 'uuid' })
    vkontakteUserID: VkontakteUserID;

    @ManyToOne(() => TelegramUserEntity, telegramUser => telegramUser.trackedVkontakteUsers)
    @JoinColumn({ name: 'telegram_user_id', referencedColumnName: 'id' })
    telegramUsers: TelegramUserEntity[];

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.trackedTelegramUsers)
    @JoinColumn({ name: 'vkontakte_user_id', referencedColumnName: 'id' })
    vkontakteUsers: VkontakteUserEntity[];
}
