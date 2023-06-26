import { appConfig } from '@config/app.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({ ...appConfig.typeorm }),
    ],
})
export class DatabaseModule { }
