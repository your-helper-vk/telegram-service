import { buildUuidBrandMethods } from '@common/types/uuid.brand';

export type VkontakteUserID = string & { readonly VkontakteUserID: unique symbol }
export const VkontakteUserID = buildUuidBrandMethods<VkontakteUserID>();
