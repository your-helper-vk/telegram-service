import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { VkontakteUserDto } from './vkontakte-user.dto';

export class VkontakteFriendsGetResponseDto {
    @ApiProperty({ type: [VkontakteUserDto] })
    @Type(() => VkontakteUserDto)
    @ValidateNested({ each: true })
    @Expose()
    items: VkontakteUserDto[];

    @ApiProperty({ example: 1 })
    @Expose()
    count: number;
}
