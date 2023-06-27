import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUsersTableName1687873111063 implements MigrationInterface {
    name = 'ChangeUsersTableName1687873111063';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE users RENAME TO telegram_users');
        await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_chats__user_id"');
        await queryRunner.query('ALTER TABLE "chats" RENAME COLUMN user_id TO telegram_user_id');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE telegram_users RENAME TO users');
        await queryRunner.query('ALTER TABLE "chats" RENAME COLUMN telegram_user_id TO user_id');
        await queryRunner.query(`
        ALTER TABLE "chats" ADD CONSTRAINT "FK_chats__user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
