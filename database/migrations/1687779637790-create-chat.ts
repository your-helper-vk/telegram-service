import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChat1687779637790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "chats" (
            "id" uuid NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, "chat_id_in_telegram" integer NOT NULL, 
            "user_id" uuid, 
            CONSTRAINT "REL_chats__user_id" UNIQUE ("user_id"), 
            CONSTRAINT "PK_id__chats" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`
        ALTER TABLE "chats" ADD CONSTRAINT "FK_chats__user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_chats__user_id"');
        await queryRunner.query('DROP TABLE "chats"');
    }

}
