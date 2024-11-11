const MESSAGES = {
  DEFAULT_ERROR: {
    INCORRECT_REQUEST: 'Некорректный запрос',
    NOT_FOUND: 'Ресурс не найден',
  },
  CARD: {
    NOT_FOUND: 'Карточка с указанным _id не найдена.',
    INVALID_ID: 'Переданы некорректные данные для постановки/снятия лайка.',
    INVALID_CREATE: 'Переданы некорректные данные при создании карточки.',
    DELETED: 'Карточка удалена.',
  },
  USER: {
    NOT_FOUND: 'Пользователь с указанным _id не найден.',
    INVALID_ID: 'Некорректный формат идентификатора пользователя.',
    INVALID_UPDATE: 'Переданы некорректные данные при обновлении профиля.',
    INVALID_AVATAR: 'Переданы некорректные данные при обновлении аватара.',
    AVATAR_REQUIRED: 'Поле "avatar" обязательно.',
    INVALID_CREATE: 'Переданы некорректные данные при создании пользователя.',
    EMAIL_EXISTS: 'Пользователь с таким email уже существует',
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    LOGIN_SUCCESS: 'Успешная авторизация',
    REQUIRED_CREDENTIALS: 'Недостаточно данных. Требуется email и password',
    NEED_LOGIN: 'Необходима авторизация',
    NOT_ALLOW: 'Нет доступа',
  },
  SYSTEM: {
    INCORRECT_TOKEN: 'Некорректный токен',
    SERVER_ERROR: 'На сервере произошла ошибка.',
  },
} as const;

export default MESSAGES;
