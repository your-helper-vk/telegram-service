import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';
import { VkontakteUserDto } from 'src/modules/vkontakte/dto/vkontakte-user.dto';

import { VkontakteUserID } from '../domain/vkontakte-user.domain';

export class CreateVkontakteUserDto extends OmitType(VkontakteUserDto, ['id']) {
    @IsDefined()
    @IsUUID()
    @Expose()
    id: VkontakteUserID;

    @IsDefined()
    @IsNumber()
    @Expose()
    userIDInVkontakte: number;
}
