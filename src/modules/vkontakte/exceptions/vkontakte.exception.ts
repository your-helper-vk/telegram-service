
/**
 * Класс ошибок ВКонтакте
 */
export class VkontakteException extends Error {
    constructor(message?: string) {
        super(message);
    }
}
