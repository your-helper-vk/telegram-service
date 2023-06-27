import { ApplicationEntity } from '@common/entity/application.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { TelegramUserEntity } from '../../telegram-user/domain/telegram-user.entity';
import { ChatID } from './chat.domain';

@Entity({ name: 'chats' })
export class ChatEntity extends ApplicationEntity<ChatID> {
    @Column({ name: 'chat_id_in_telegram', type: 'int' })
    chatIdInTelegram: number;

    @OneToOne(() => TelegramUserEntity)
    @JoinColumn({ name: 'telegram_user_id' })
    user: TelegramUserEntity;
}
