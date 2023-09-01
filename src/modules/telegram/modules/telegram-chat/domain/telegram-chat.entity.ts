import { ApplicationEntity } from '@common/entity/application.entity';
import { TelegramUserID } from '@telegram/modules/telegram-user/domain/telegram-user.domain';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { TelegramUserEntity } from '../../telegram-user/domain/telegram-user.entity';
import { TelegramChatID } from './telegram-chat.domain';

@Entity({ name: 'telegram_chats' })
export class TelegramChatEntity extends ApplicationEntity<TelegramChatID> {
    @Column({ name: 'chat_id_in_telegram', type: 'int' })
    chatIdInTelegram: number;

    @Column({ name: 'telegram_user_id', type: 'uuid' })
    telegramUserID: TelegramUserID;

    @OneToOne(() => TelegramUserEntity)
    @JoinColumn({ name: 'telegram_user_id' })
    user: TelegramUserEntity;
}
