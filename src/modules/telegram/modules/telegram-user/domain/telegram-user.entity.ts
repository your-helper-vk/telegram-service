import { ApplicationEntity } from '@common/entity/application.entity';
import { VkontakteUserEntity } from 'src/modules/vkontakte/modules/vkontakte-user/domain/vkontakte-user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { TelegramUserID } from './telegram-user.domain';

@Entity({ name: 'telegram_users' })
export class TelegramUserEntity extends ApplicationEntity<TelegramUserID> {
    @Column({ name: 'user_id_in_telegram', type: 'int' })
    userIDInTelegram: number;

    @ManyToMany(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.trackedTelegramUsers)
    @JoinTable({
        name: 'telegram_tracked_vk_users',
        joinColumn: { name: 'telegram_user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'vkontakte_user_id', referencedColumnName: 'id' },
    })
    trackedVkontakteUsers: VkontakteUserEntity[];
}
