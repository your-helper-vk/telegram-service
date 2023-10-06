import { TelegramUserID } from '@telegram/modules/telegram-user/domain/telegram-user.domain';
import { VkontakteUserID } from '@vkontakte/modules/vkontakte-user/domain/vkontakte-user.domain';

export function hasObjectInMap<K extends UsersMapKeyType, V extends UsersMapValueType>(map: Map<K, V[]>, key: K): boolean {
    const keys = map.keys();
    let anotherKey: K | undefined;

    while (anotherKey = keys.next().value) {
        if (key.id === anotherKey.id) {
            return true;
        }
    }

    return false;
}

export function getValueByKeyObjectFromMap<K extends UsersMapKeyType, V extends UsersMapValueType>(map: Map<K, V[]>, key: K): V[] | undefined {
    const keys = map.keys();
    let anotherKey: K | undefined;

    while (anotherKey = keys.next().value) {
        if (key.id === anotherKey.id && key.userIDInVkontakte === anotherKey.userIDInVkontakte) {
            return map.get(anotherKey);
        }
    }

    return undefined;
}

export type UsersMapKeyType = {
    id: VkontakteUserID;
    userIDInVkontakte: number;
};

export type UsersMapValueType = {
    id: TelegramUserID;
    userIDInTelegram: number;
}
