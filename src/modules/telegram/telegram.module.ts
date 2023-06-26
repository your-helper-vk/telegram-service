import { Module } from '@nestjs/common';

import { ChatService } from './modules/chat/chat.service';
import { UserService } from './modules/user/user.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
    imports: [],
    controllers: [TelegramController],
    providers: [
        ChatService,
        TelegramService,
        UserService,
    ],
    exports: [TelegramService],
})
export class TelegramModule { }
