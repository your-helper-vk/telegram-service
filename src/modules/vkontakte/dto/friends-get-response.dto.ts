import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { VkontakteUserDto } from './vkontakte-user.dto';

export class FriendsGetResponseDto {
    @ApiProperty({ type: [VkontakteUserDto] })
    @IsArray()
    @Type(() => VkontakteUserDto)
    @ValidateNested({ each: true })
    @Expose()
    items: VkontakteUserDto[];

    @ApiProperty({ example: 1 })
    @Expose()
    count: number;
}
