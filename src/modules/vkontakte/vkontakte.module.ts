import { Module } from '@nestjs/common';

import { VkontakteFriendService } from './modules/vkontakte-friend/vkontakte-friend.service';
import { VkontakteUserService } from './modules/vkontakte-user/vkontakte-user.service';
import { VkontakteClient } from './vkontakte.client';
import { VkontakteController } from './vkontakte.controller';
import { VkontakteService } from './vkontakte.service';

@Module({
    imports: [],
    controllers: [
        VkontakteController,
    ],
    providers: [
        VkontakteClient,
        VkontakteService,
        VkontakteUserService,
        VkontakteFriendService,
    ],
    exports: [
        VkontakteService,
        VkontakteUserService,
    ],
})
export class VkontakteModule { }
