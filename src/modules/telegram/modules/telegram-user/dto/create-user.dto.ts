import { ApplicationDto } from '@common/dto/application.dto';
import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

import { TelegramUserID } from '../domain/telegram-user.domain';

export class CreateTelegramUserDto extends ApplicationDto {
    @IsUUID()
    @Expose()
    id: TelegramUserID;

    @IsNumber()
    @Expose()
    TelegramUserIDInTelegram: number;
}
