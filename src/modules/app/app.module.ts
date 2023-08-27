import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';
import { VkontakteModule } from '../vkontakte/vkontakte.module';

@Module({
  imports: [
    DatabaseModule,
    VkontakteModule,
    TelegramModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
