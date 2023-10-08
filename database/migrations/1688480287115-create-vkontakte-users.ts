import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVkontakteUsers1688480287115 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "vkontakte_users" (
            "id" uuid NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "user_id_in_vkontakte" integer NOT NULL, 
            "bdate" character varying, 
            "is_closed" boolean, 
            "first_name" character varying, 
            "last_name" character varying, 
            "nickname" character varying, 
            "sex" integer, 
            "can_access_closed" boolean, 
            CONSTRAINT "PK_vkontakte_users__id" PRIMARY KEY ("id")
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "vkontakte_users"');
    }

}
