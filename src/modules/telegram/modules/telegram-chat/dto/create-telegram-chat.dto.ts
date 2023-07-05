import { ApplicationDto } from '@common/dto/application.dto';
import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

import { TelegramUserID } from '../../telegram-user/domain/telegram-user.domain';
import { TelegramChatID } from '../domain/telegram-chat.domain';

export class CreateTelegramChatDto extends ApplicationDto {
    @IsUUID()
    @Expose()
    id: TelegramChatID;

    @IsNumber()
    @Expose()
    chatIdInTelegram: number;

    @IsUUID()
    @Expose()
    TelegramUserID: TelegramUserID;
}
