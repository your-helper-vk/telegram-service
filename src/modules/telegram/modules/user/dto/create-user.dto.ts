import { ApplicationDto } from '@common/dto/application.dto';
import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

import { UserID } from '../domain/user.domain';

export class CreateUserDto extends ApplicationDto {
    @IsUUID()
    @Expose()
    id: UserID;

    @IsNumber()
    @Expose()
    userIdInTelegram: number;
}
