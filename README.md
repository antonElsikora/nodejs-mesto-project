# Бэкенд Mesto. API Mesto

## Используемые технологии и решения
- TypeScript в качестве основного языка проекта
- MongoDB и ODM Mongoose для хранения данных пользователей
- Node.js в качестве среды выполнения
- Express.js для создания REST API
- JWT для аутентификации
- Celebrate и Joi для валидации данных
- Winston для логирования
- PM2 для управления процессами и деплоя

## Адреса развернутого проекта
- IP-адрес сервера: 130.193.35.84
- Frontend: https://lostfreez.ru
- Backend: https://api.lostfreez.ru

## Инструкция по локальному развертыванию
1. Клонируйте репозиторий: `git clone git@github.com:antonElsikora/nodejs-mesto-project.git`
2. Установите зависимости: `npm install`
3. Создайте файл `.env` в корне проекта (см. пример в `.env.example`)
4. Запустите MongoDB: `mongod`
5. Для разработки: `npm run dev`
6. Для сборки: `npm run build`
7. Для запуска продакшн: `npm run start`

## Инструкция по деплою
1. Настройте `.env.deploy` с параметрами вашего сервера (см. пример в `.env.deploy.example`)
2. Запустите начальную настройку: `pm2 deploy ecosystem.config.js production setup`
3. Выполните деплой: `pm2 deploy production`