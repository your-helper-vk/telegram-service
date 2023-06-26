import { DataSourceOptions } from 'typeorm';

import { envConfig as env } from './env.config';

export const appConfig = {
    get typeorm(): DataSourceOptions {
        return {
            type: 'postgres',
            host: env.POSTGRES_HOST,
            port: env.POSTGRES_PORT,
            username: env.POSTGRES_USERNAME,
            password: env.POSTGRES_PASSWORD,
            database: env.POSTGRES_DATABASE,
            synchronize: env.POSTGRES_SYNCHRONIZE,
            logging: env.POSTGRES_LOGGING,
            maxQueryExecutionTime: env.POSTGRES_MAX_QUERY_EXECUTION_TIME,
            entities: [__dirname + '/../**/*.entity.[tj]s', __dirname + '/../**/*.view.[tj]s'],
            migrations: [__dirname + '/../../database/migrations/*.[tj]s'],
            migrationsRun: env.POSTGRES_MIGRATIONS_RUN,
        };
    },

    AXIOS_DEFAULT_TIMEOUT: 5000,
};
