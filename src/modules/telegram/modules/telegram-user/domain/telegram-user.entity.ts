import { ApplicationEntity } from '@common/entity/application.entity';
import { Column, Entity } from 'typeorm';

import { TelegramUserID } from './telegram-user.domain';

@Entity({ name: 'telegram_users' })
export class TelegramUserEntity extends ApplicationEntity<TelegramUserID> {
    @Column({ name: 'user_id_in_telegram', type: 'int' })
    userIDInTelegram: number;
}
