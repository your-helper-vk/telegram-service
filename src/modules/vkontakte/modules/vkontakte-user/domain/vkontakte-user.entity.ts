import { ApplicationEntity } from '@common/entity/application.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { VkontakteFriendEntity } from '../../vkontakte-friend/domain/vkontakte-friend.entity';
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

    @OneToMany(() => VkontakteFriendEntity, vkontakteFriend => vkontakteFriend.vkontakteUser)
    followers: VkontakteFriendEntity[];

    @OneToMany(() => VkontakteFriendEntity, vkontakteFriend => vkontakteFriend.vkontakteFriend)
    following: VkontakteFriendEntity[];
}
