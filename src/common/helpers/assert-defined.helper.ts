import { AssertDefinedException } from '@common/exceptions/assert-defined.exception';

/**
 * Проверка значения на undefined, в случае undefined бросаем ошибку
 * @param val Значение
 * @param msg Сообщение в случае пустого значения
 * @returns Значение, которое было на входе
 */
export const assertDefined = <T>(val?: T, msg?: string): T => {
    if (val === undefined) {
        throw new AssertDefinedException(msg);
    }

    return val;
};
