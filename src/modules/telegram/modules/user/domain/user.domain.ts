import { buildUuidBrandMethods } from '@common/types/uuid.brand';

export type UserID = string & { readonly UserID: unique symbol }
export const UserID = buildUuidBrandMethods<UserID>();
