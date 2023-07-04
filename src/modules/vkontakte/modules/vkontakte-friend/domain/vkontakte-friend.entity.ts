import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { VkontakteUserID } from '../../vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserEntity } from '../../vkontakte-user/domain/vkontakte-user.entity';

@Entity({ name: 'vkontakte_friends' })
export class VkontakteFriendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vkontakte_user_id', type: 'uuid' })
    vkontakteUserID: VkontakteUserID;

    @Column({ name: 'vkontakte_friend_user_id', type: 'uuid' })
    vkontakteFriendUserID: number;

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.followers)
    vkontakteUser: VkontakteUserEntity;

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.following)
    vkontakteFriend: VkontakteUserEntity;
}
