import { ApplicationDto } from '@common/dto/application.dto';
import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

import { TelegramUserID } from '../../user/domain/user.domain';
import { ChatID } from '../domain/chat.domain';

export class CreateChatDto extends ApplicationDto {
    @IsUUID()
    @Expose()
    id: ChatID;

    @IsNumber()
    @Expose()
    chatIdInTelegram: number;

    @IsUUID()
    @Expose()
    TelegramUserID: TelegramUserID;
}
