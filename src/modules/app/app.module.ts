import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';
import { VkontakteModule } from '../vkontakte/vkontakte.module';

@Module({
  imports: [
    DatabaseModule,
    VkontakteModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
