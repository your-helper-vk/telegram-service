import { buildUuidBrandMethods } from '@common/types/uuid.brand';

export type TelegramUserID = string & { readonly TelegramUserID: unique symbol }
export const TelegramUserID = buildUuidBrandMethods<TelegramUserID>();
