import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { VkontakteUserID } from '../../vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserEntity } from '../../vkontakte-user/domain/vkontakte-user.entity';

@Entity({ name: 'vkontakte_friends' })
export class VkontakteFriendEntity {
    @PrimaryColumn({ name: 'vkontakte_user_id', type: 'uuid' })
    vkontakteUserID: VkontakteUserID;

    @PrimaryColumn({ name: 'vkontakte_friend_user_id', type: 'uuid' })
    vkontakteFriendUserID: VkontakteUserID;

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.followers)
    @JoinColumn({ name: 'vkontakte_user_id', referencedColumnName: 'id' })
    vkontakteUser: VkontakteUserEntity;

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.following)
    @JoinColumn({ name: 'vkontakte_friend_user_id', referencedColumnName: 'id' })
    vkontakteFriend: VkontakteUserEntity;
}
