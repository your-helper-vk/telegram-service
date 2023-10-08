import { ConfigService } from '@nestjs/config';

import { assertDefined } from './assert-defined.helper';

/**
 * Функция для получения env переменных из ConfigService
 * @returns Значение env переменной или ошибка AssertDefinedException если его нет
 * @param configService - инстанс ConfigService
 * @param name - имя env переменной
 * @param required - является ли переменная обязательной
 */
export function getEnv(configService: ConfigService, name: string, required: true): string;

/**
 * Функция для получения env переменных из ConfigService
 * @returns Значение env переменной или undefined
 * @param configService - инстанс ConfigService
 * @param name - имя env переменной
 */
export function getEnv(configService: ConfigService, name: string): string | undefined;

export function getEnv(configService: ConfigService, name: string, required = true): string | undefined {
    return required ? assertDefined(configService.get(name), `Required environment variable "${name}" is not defined`) : configService.get(name);
}
