import { VkontakteFriendEntity } from '@vkontakte/modules/vkontakte-friend/domain/vkontakte-friend.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Vkontakte {
    export type FriendsActualInfoEntity = {
        oldFriends: VkontakteFriendEntity[];
        deletedFriends: VkontakteFriendEntity[];
        newFriends: VkontakteFriendEntity[];
    }

    export type FriendsActualInfoID = {
        oldFriends: number[];
        deletedFriends: number[];
        newFriends: number[];
    }

    export type ConfigType = {
        VK_ACCESS_TOKEN: string;
        VK_VERSION: string;
    }
}
