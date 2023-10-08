import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChat1687779637790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "telegram_chats" (
            "id" uuid NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP,
            "chat_id_in_telegram" integer NOT NULL, 
            "telegram_user_id" uuid, 
            CONSTRAINT "REL_tg_chats__tg_user_id" UNIQUE ("telegram_user_id"), 
            CONSTRAINT "PK_id__tg_chats" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`
        ALTER TABLE "telegram_chats" ADD CONSTRAINT "FK_tg_chats__tg_user_id" FOREIGN KEY ("telegram_user_id") REFERENCES "telegram_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "telegram_chats" DROP CONSTRAINT "FK_tg_chats__tg_user_id"');
        await queryRunner.query('DROP TABLE "telegram_chats"');
    }

}
