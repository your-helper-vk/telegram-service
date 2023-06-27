import { Module } from '@nestjs/common';

import { ChatService } from './modules/chat/chat.service';
import { TelegramUserService } from './modules/telegram-user/telegram-user.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
    imports: [],
    controllers: [TelegramController],
    providers: [
        ChatService,
        TelegramService,
        TelegramUserService,
    ],
    exports: [TelegramService],
})
export class TelegramModule { }
