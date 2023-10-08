# Сервис для отслеживания пользователей

Использовать данный репозиторий как шаблон для всех приложений.

## Команды запуска

```bash
yarn start - запуск приложения
yarn start:dev - запуск приложения в режиме development
yarn build - собрать приложение
yarn test - запустить тесты
```

## Команды для миграций данных в БД

```bash
yarn db:create database/migrations/migration-name - создание пустой миграции
yarn db:generate database/migrations/migration-name - сгенерировать миграцию
yarn db:migrate - выполнить миграции
yarn db:revert - откатить последнюю миграцию
```
