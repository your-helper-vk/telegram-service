import { Stage } from '@common/constants/stage.enum';
import { getEnv } from '@common/helper/get-env.helper';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createDatabaseConfig = (configService: ConfigService): DataSourceOptions => {
    const stage = getEnv(configService, 'STAGE');

    return {
        type: 'postgres',
        host: getEnv(configService, 'POSTGRES_HOST'),
        port: Number(getEnv(configService, 'POSTGRES_PORT')),
        username: getEnv(configService, 'POSTGRES_USERNAME'),
        password: getEnv(configService, 'POSTGRES_PASSWORD'),
        database: getEnv(configService, 'POSTGRES_DATABASE'),
        synchronize: false,
        logging: stage !== Stage.Production,
        maxQueryExecutionTime: Number(getEnv(configService, 'POSTGRES_MAX_QUERY_EXECUTION_TIME')),
        entities: [__dirname + '/../**/*.entity.[tj]s', __dirname + '/../**/*.view.[tj]s'],
        migrations: [__dirname + '/../../database/migrations/*.[tj]s'],
        migrationsRun: stage !== Stage.Local,
    };
};
