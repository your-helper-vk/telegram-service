import { Stage } from '@common/constants/stage.enum';
import { getEnv } from '@common/helper/get-env.helper';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app/app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    if (getEnv(configService, 'STAGE') !== Stage.Production) {
        const config = new DocumentBuilder()
            .setTitle('Telegram API')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(getEnv(configService, 'APP_PORT') || 3000);
}

bootstrap();
