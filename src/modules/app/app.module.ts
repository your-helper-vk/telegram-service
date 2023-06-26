import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    DatabaseModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
