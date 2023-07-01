import { Module } from '@nestjs/common';

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
    ],
    exports: [
        VkontakteService,
    ],
})
export class VkontakteModule { }
