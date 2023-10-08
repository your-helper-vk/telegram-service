import { envConfig } from '@config/env.config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app/app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    if (envConfig.STAGE !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Telegram API')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(envConfig.APP_PORT || 3000);
}

bootstrap();
