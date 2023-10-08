import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1687779514697 implements MigrationInterface {
    name = 'CreateUser1687779514697';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "telegram_users" (
            "id" uuid NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "user_id_in_telegram" integer NOT NULL, 
            CONSTRAINT "PK_id__tg_users" PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "telegram_users"');
    }

}
