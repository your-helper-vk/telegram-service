import { ApplicationEntity } from '@common/entity/application.entity';
import { Column, Entity } from 'typeorm';

import { UserID } from './user.domain';

@Entity({ name: 'users' })
export class UserEntity extends ApplicationEntity<UserID> {
    @Column({ name: 'user_id_in_telegram', type: 'int' })
    userIdInTelegram: number;
}
