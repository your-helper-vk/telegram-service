import { envConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { VkontakteFriendsGetResponseDto } from './dto/vkontakte-friends-get-response.dto';
import { VkontakteUserDto } from './dto/vkontakte-user.dto';
import { VkontakteClient } from './vkontakte.client';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
}

@Injectable()
export class VkontakteService {
    constructor(private readonly vkontakteClient: VkontakteClient) { }

    // TODO: Доработать обработку ошибок из ВК, желательно в клиенте
    /**
     * Возвращает список идентификаторов друзей пользователя или расширенную информацию о друзьях пользователя (при использовании параметра fields).
     * @param userID Идентификатор пользователя, для которого необходимо получить список друзей.
     * @param fields Список дополнительных полей, которые необходимо вернуть. Подробнее тут
     * https://dev.vk.com/method/friends.get#%D0%9F%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B
     * @returns Список пользователей ВК
     */
    async getFriends(userID: number, fields: string[]): Promise<VkontakteFriendsGetResponseDto> {
        const { response } = await this.vkontakteClient.sendRequest<{ response: VkontakteFriendsGetResponseDto }>(
            'friends.get',
            HttpMethod.GET,
            {
                params: {
                    // eslint-disable-next-line camelcase
                    user_id: userID,
                    fields: fields.join(','),
                    // eslint-disable-next-line camelcase
                    access_token: envConfig.VK_ACCESS_TOKEN,
                    v: envConfig.VK_VERSION,
                },
            }
        );

        return plainToInstance(VkontakteFriendsGetResponseDto, response, { excludeExtraneousValues: true });
    }

    /**
     * Возвращает расширенную информацию о пользователях ВК.
     * @param userIDs Перечисленные через запятую идентификаторы пользователей или их короткие имена.
     * @param fields Список дополнительных полей, которые необходимо вернуть. Подробнее тут
     * https://dev.vk.com/method/friends.get#%D0%9F%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B
     * @returns Список пользователей ВК
     */
    async getUsers(userIDs: string[] | number[], fields: string[]): Promise<VkontakteUserDto[]> {
        const { response } = await this.vkontakteClient.sendRequest<{ response: VkontakteUserDto[] }>(
            'users.get',
            HttpMethod.GET,
            {
                params: {
                    // eslint-disable-next-line camelcase
                    user_ids: userIDs.join(','),
                    fields: fields.join(','),
                    // eslint-disable-next-line camelcase
                    access_token: envConfig.VK_ACCESS_TOKEN,
                    v: envConfig.VK_VERSION,
                },
            }
        );

        return plainToInstance(VkontakteUserDto, response, { excludeExtraneousValues: true });
    }
}
