import { createDatabaseConfig } from '@config/database.config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: createDatabaseConfig,
        }),
    ],
})
export class DatabaseModule { }
