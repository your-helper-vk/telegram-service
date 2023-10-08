import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';
import { VkontakteModule } from '../vkontakte/vkontakte.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      isGlobal: true,
    }),
    DatabaseModule,
    VkontakteModule,
    TelegramModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
