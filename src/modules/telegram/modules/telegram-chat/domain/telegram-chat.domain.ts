import { buildUuidBrandMethods } from '@common/types/uuid.brand';

export type TelegramChatID = string & { readonly TelegramChatID: unique symbol }
export const TelegramChatID = buildUuidBrandMethods<TelegramChatID>();
