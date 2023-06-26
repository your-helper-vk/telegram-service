import { validateDto } from '@common/operations/validate-dto.operation';
import { Injectable } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';

import { ChatService } from './modules/chat/chat.service';
import { ChatID } from './modules/chat/domain/chat.domain';
import { CreateChatDto } from './modules/chat/dto/create-chat.dto';
import { UserID } from './modules/user/domain/user.domain';
import { CreateUserDto } from './modules/user/dto/create-user.dto';
import { UserService } from './modules/user/user.service';
import { telegramBot } from './telegram.bot';

@Injectable()
export class TelegramService {
    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService,
    ) {
        this.initialize();
    }

    initialize(): void {
        telegramBot.on('message', async (messageInfo: Message) => {
            const message = messageInfo.text;
            const chatIdInTelegram = messageInfo.chat.id;
            const userIdInTelegram = messageInfo.from.id;

            switch (message) {
                case '/start':
                    const user = await this.userService.findOneByUserIdInTelegram(userIdInTelegram);

                    if (!user) {
                        const userInput = await validateDto(CreateUserDto, {
                            id: UserID.new(),
                            userIdInTelegram,
                        });
                        const newUser = await this.userService.create(userInput);

                        const chatInput = await validateDto(CreateChatDto, {
                            id: ChatID.new(),
                            chatIdInTelegram,
                            userID: newUser.id,
                        });
                        await this.chatService.create(chatInput);
                    }
            }
        });
    }

    sendMessage(chatID: number, message: string): Promise<Message> {
        return telegramBot.sendMessage(chatID, message);
    }


}
