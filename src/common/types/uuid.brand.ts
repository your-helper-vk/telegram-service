import { v4, validate } from 'uuid';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const buildUuidBrandMethods = <ID extends string>() => ({
    new: (): ID => {
        return v4() as ID;
    },
    ofString: (value: string): ID => {
        if (!validate(value)) {
            throw new Error(`Incorrect uuid ${value}`);
        }
        return value as ID;
    },
});

export type UUID = string & { readonly UUID: unique symbol }
export const UUID = buildUuidBrandMethods<UUID>();
