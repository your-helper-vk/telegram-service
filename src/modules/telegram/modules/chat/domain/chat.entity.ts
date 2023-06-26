import { ApplicationEntity } from '@common/entity/application.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserEntity } from '../../user/domain/user.entity';
import { ChatID } from './chat.domain';

@Entity({ name: 'chats' })
export class ChatEntity extends ApplicationEntity<ChatID> {
    @Column({ name: 'chat_id_in_telegram', type: 'int' })
    chatIdInTelegram: number;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
