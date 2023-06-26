import { buildUuidBrandMethods } from '@common/types/uuid.brand';

export type ChatID = string & { readonly ChatID: unique symbol }
export const ChatID = buildUuidBrandMethods<ChatID>();
