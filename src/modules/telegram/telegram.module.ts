import { Module } from '@nestjs/common';
import { VkontakteModule } from '@vkontakte/vkontakte.module';

import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramTrackedVkUserService } from './modules/telegram-tracked-user/telegram-tracked-vk-user.service';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';
import { TelegramTaskService } from './telegram-task.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
    imports: [
        VkontakteModule,
    ],
    controllers: [TelegramController],
    providers: [
        TelegramService,
        TelegramChatService,
        TelegramTrackedVkUserService,
        TelegramUserService,
        TelegramTaskService,
    ],
    exports: [TelegramService],
})
export class TelegramModule { }
