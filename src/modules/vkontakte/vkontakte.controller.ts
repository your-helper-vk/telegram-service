import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { VkontakteFriendsGetResponseDto } from './dto/vkontakte-friends-get-response.dto';
import { VkontakteGetUsersDto } from './dto/vkontakte-get-users.dto';
import { VkontakteUserDto } from './dto/vkontakte-user.dto';
import { VkontakteService } from './vkontakte.service';

@ApiTags('Vkontakte endpoints')
@Controller('vkontakte')
export class VkontakteController {

    constructor(private readonly vkontakteService: VkontakteService) { }

    @Get('friends/:userID')
    @ApiQuery({
        name: 'fields',
        example: [
            'bdate',
            'sex',
            'nickname',
        ],
    })
    @ApiOkResponse({ type: VkontakteFriendsGetResponseDto })
    getFriends(@Param('userID') userID: number, @Query('fields') fields: string[]): Promise<VkontakteFriendsGetResponseDto> {
        return this.vkontakteService.getFriends(userID, fields);
    }

    @Get('users')
    @ApiOkResponse({ type: [VkontakteUserDto] })
    getUsers(@Query() { userIDs, fields }: VkontakteGetUsersDto): Promise<VkontakteUserDto[]> {
        return this.vkontakteService.getUsers(userIDs, fields);
    }
}
