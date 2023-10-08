
export const TelegramMessage = {
    CHAT_NOT_FOUND: 'К сожалению чат не найден ☹\n' +
        'Попробуйте для начала воспользоваться командой */start* 🤗',

    INITIALIZE: 'Добро пожаловать\\!\n' +
        '\nЯ помогаю следить за страницами людей в социальной сети ВКонтакте 👩‍💼 😊\n' +
        'Нажми ❓ Помощь чтобы узнать, как пользоваться системой\n' +
        '\nЯ могу ответить на твой вопрос, касающийся функционала',

    USER_NOT_FOUND: 'Пользователь не найден ☹\n' +
        'Необходимо связаться с автором бота',

    USER_PROFILE_IS_CLOSED: 'У пользователя скрыт профиль 😔\n\n' +
        'К сожалению закрытый профиль мы не отследим 🙈',
    USER_ALREADY_EXIST: 'Пользователь уже сохранён',
    USER_SUCCESSFULLY_ADDED: 'Пользователь успешно добавлен к отслеживанию ✅',

    TRACKED_VK_LIST_IS_EMPTY: 'Список отслеживаемых пользователей пуст 😔',
    DELETE_TRACKED_VK_USERS_SUCCESSFULLY: 'Список отслеживаемых пользователей очищен ✅',
    TRACKED_VK_USERS_CHECK_START: 'Начинаю следить за вашими пользователями 👁‍🗨',
    TRACKED_VK_USERS_CHECK_END: 'Проверка успешно окончена ✅',

    UNDEFINED_COMMAND: 'Я тебя совсем не понимаю 🤷‍♀\n' +
        'Разве я должен это знать? 🤔\n' +
        '\nЕсли я работаю неправильно, нажми\n *"👱 Связаться с разработчиками"*, ' +
        'чтобы я перенаправил твои вопросы, а они то уж точно тебе помогут 😊',
};

export const TelegramReplyMarkup = {
    // eslint-disable-next-line camelcase
    reply_markup: {
        keyboard: [
            [
                { text: 'Список отслеживаемых пользователей' },
                { text: 'Добавить пользователя к отслеживанию' },
                { text: 'Удалить пользователя из отслеживания' },
                { text: 'Удалить всех пользователей из отслеживания' },
            ],
            [
                { text: 'Информация о боте' },
                { text: 'Об авторе' },
            ],
        ],
    },
};
