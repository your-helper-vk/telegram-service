import { ApiProperty } from '@nestjs/swagger';

export class VkontakteGetUsersDto {
    @ApiProperty({
        description: 'Nickname/ID пользователей ВК',
        example: [
            'mmbalabaev',
            'dimapichuev',
            'hollera20',
        ],
    })
    userIDs: string[] | number[];

    @ApiProperty({
        description: 'Дополнительная информация о пользователях',
        example: [
            'bdate',
            'sex',
            'nickname',
        ],
    })
    fields: string[];
}
