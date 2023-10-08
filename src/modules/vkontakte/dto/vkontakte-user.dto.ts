import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class VkontakteUserDto {
    @ApiProperty({ example: '1410' })
    @IsDefined()
    @IsNumber()
    @Expose()
    id: number;

    @ApiProperty({ example: '26.5' })
    @IsOptional()
    @IsString()
    @Expose()
    bdate?: string;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    @Expose({ name: 'is_closed' })
    isClosed?: boolean;

    @ApiProperty({ example: 'Михаил' })
    @IsOptional()
    @IsString()
    @Expose({ name: 'first_name' })
    firstName?: string;

    @ApiProperty({ example: 'Иванов' })
    @IsOptional()
    @IsString()
    @Expose({ name: 'last_name' })
    lastName?: string;

    @ApiProperty({ example: 'Иванов' })
    @IsOptional()
    @IsString()
    @Expose()
    nickname?: string;

    @ApiProperty({ example: 'ivanov.mm' })
    @IsOptional()
    @IsString()
    @Expose({ name: 'screen_name' })
    screenName?: string;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    @Expose()
    sex?: number;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    @Expose({ name: 'can_access_closed' })
    canAccessClosed?: boolean;
}
