import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VkontakteUserDto {
    @ApiProperty({ example: '1410' })
    @Expose()
    id: number;

    @ApiProperty({ example: '26.5' })
    @Expose()
    bdate?: string;

    @ApiProperty({ example: false })
    @Expose({ name: 'is_closed' })
    isClosed?: boolean;

    @ApiProperty({ example: 'Михаил' })
    @Expose({ name: 'first_name' })
    firstName?: string;

    @ApiProperty({ example: 'Иванов' })
    @Expose({ name: 'last_name' })
    lastName?: string;

    @ApiProperty({ example: 'ivanov.mm' })
    @Expose()
    nickname?: string;

    @ApiProperty({ example: 1 })
    @Expose()
    sex?: number;

    @ApiProperty({ example: false })
    @Expose({ name: 'can_access_closed' })
    canAccessClosed?: boolean;
}
