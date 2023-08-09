import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { VkontakteUserID } from '../../vkontakte-user/domain/vkontakte-user.domain';
import { VkontakteUserEntity } from '../../vkontakte-user/domain/vkontakte-user.entity';

@Entity({ name: 'vkontakte_friends' })
export class VkontakteFriendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vkontakte_user_id', type: 'uuid' })
    vkontakteUserID: VkontakteUserID;

    @Column({ name: 'vkontakte_friend_user_id', type: 'uuid' })
    vkontakteFriendUserID: VkontakteUserID;

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.followers)
    @JoinColumn({ name: 'vkontakte_user_id', referencedColumnName: 'id' })
    vkontakteUsers: VkontakteUserEntity[];

    @ManyToOne(() => VkontakteUserEntity, vkontakteUser => vkontakteUser.following)
    @JoinColumn({ name: 'vkontakte_friend_user_id', referencedColumnName: 'id' })
    vkontakteFriends: VkontakteUserEntity[];
}
