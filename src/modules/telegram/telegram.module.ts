import { Module } from '@nestjs/common';

import { TelegramChatService } from './modules/telegram-chat/telegram-chat.service';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
    imports: [],
    controllers: [TelegramController],
    providers: [
        TelegramChatService,
        TelegramService,
        TelegramUserService,
    ],
    exports: [TelegramService],
})
export class TelegramModule { }
