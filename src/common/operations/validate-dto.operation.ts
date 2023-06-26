import { ApplicationDto } from '@common/dto/application.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';


export async function validateDto<T extends ApplicationDto>(dtoClass: { new(): T }, input: object): Promise<T> {
    const dto = input instanceof dtoClass
        ? input
        : plainToInstance(dtoClass, input || {}, { excludeExtraneousValues: true });

    const errors = await validate(
        dto,
        { whitelist: true, validationError: { target: false, value: false } }
    );

    if (errors.length > 0) {
        // TODO: validation error
        throw new Error('validation error');
    } else {
        return dto;
    }
}
