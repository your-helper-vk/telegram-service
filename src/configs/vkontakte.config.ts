import { getEnv } from '@common/helpers/get-env.helper';
import { ConfigService } from '@nestjs/config';
import { Vkontakte } from 'types';

export const createVkontakteConfig = (configService: ConfigService): Vkontakte.ConfigType => ({
    VK_ACCESS_TOKEN: getEnv(configService, 'VK_ACCESS_TOKEN'),
    VK_VERSION: getEnv(configService, 'VK_VERSION'),
});
