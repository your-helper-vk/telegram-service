import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { VkontakteUserDto } from 'src/modules/vkontakte/dto/vkontakte-user.dto';

import { VkontakteUserID } from '../domain/vkontakte-user.domain';

export class CreateVkontakteUserDto extends OmitType(VkontakteUserDto, ['id']) {
    @IsUUID()
    @Expose()
    id: VkontakteUserID;

    @Expose()
    userIDInVkontakte: number;
}
