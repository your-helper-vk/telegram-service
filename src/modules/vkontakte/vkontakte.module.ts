import { Module } from '@nestjs/common';

import { VkontakteFriendService } from './modules/vkontakte-friend/vkontakte-friend.service';
import { VkontakteUserService } from './modules/vkontakte-user/vkontakte-user.service';
import { VkontakteClient } from './services/vkontakte.client';
import { VkontakteService } from './services/vkontakte.service';
import { VkontakteController } from './vkontakte.controller';

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
        VkontakteFriendService,
    ],
})
export class VkontakteModule { }
