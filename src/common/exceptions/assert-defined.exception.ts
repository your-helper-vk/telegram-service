/**
 * Класс ошибок для неустановленных значений
 */
export class AssertDefinedException extends Error {
    /**
     * Конструктор класса
     * @param message Сообщение в ошибке при отсутствующем значении
     */
    constructor(message?: string) {
        super(message || 'Значение должно быть установлено.');
    }
}
