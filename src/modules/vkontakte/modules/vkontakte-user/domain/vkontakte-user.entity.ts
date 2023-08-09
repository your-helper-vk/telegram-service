import { ApplicationEntity } from '@common/entity/application.entity';
import { TelegramUserEntity } from 'src/modules/telegram/modules/telegram-user/domain/telegram-user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { VkontakteUserID } from './vkontakte-user.domain';

@Entity({ name: 'vkontakte_users' })
export class VkontakteUserEntity extends ApplicationEntity<VkontakteUserID> {
    @Column({ name: 'user_id_in_vkontakte' })
    userIDInVkontakte: number;

    @Column({ nullable: true })
    bdate?: string;

    @Column({ name: 'is_closed', nullable: true })
    isClosed?: boolean;

    @Column({ name: 'first_name', nullable: true })
    firstName?: string;

    @Column({ name: 'last_name', nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    nickname?: string;

    @Column({ type: 'int', nullable: true })
    sex?: number;

    @Column({ name: 'can_access_closed', nullable: true })
    canAccessClosed?: boolean;

    @ManyToMany(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.following)
    @JoinTable({
        name: 'vkontakte_friends',
        joinColumn: { name: 'vkontakte_user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'vkontakte_friend_user_id', referencedColumnName: 'id' },
    })
    followers: VkontakteUserEntity[];

    @ManyToMany(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.followers)
    following: VkontakteUserEntity[];

    @ManyToMany(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.trackedTelegramUsers)
    trackedTelegramUsers: TelegramUserEntity[];
}
