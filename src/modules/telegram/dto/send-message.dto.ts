import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
    @ApiProperty({ example: 311129883 })
    @IsNumber()
    @Expose()
    chatID: number;

    @ApiProperty({ example: 'Тестовое сообщение из Swagger' })
    @IsString()
    @Expose()
    message: string;
}
