import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTrackedVkUsers1688778170465 implements MigrationInterface {
    name = 'CreateTrackedVkUsers1688778170465';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_tracked_vk_users" (
        "id" SERIAL NOT NULL, 
        "telegram_user_id" uuid NOT NULL, 
        "vkontakte_user_id" uuid NOT NULL, 
        CONSTRAINT "PK_tg_tracked_vk_users__id" PRIMARY KEY ("id")
        )`);

        await queryRunner.query('ALTER TABLE "telegram_tracked_vk_users" ADD CONSTRAINT "FK_tg_tracked_vk_users__tg_user" FOREIGN KEY ("telegram_user_id") REFERENCES "telegram_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');

        await queryRunner.query('ALTER TABLE "telegram_tracked_vk_users" ADD CONSTRAINT "FK_tg_tracked_vk_users__vk_user" FOREIGN KEY ("vkontakte_user_id") REFERENCES "vkontakte_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "telegram_tracked_vk_users" DROP CONSTRAINT "FK_tg_tracked_vk_users__tg_user"');
        await queryRunner.query('ALTER TABLE "telegram_tracked_vk_users" DROP CONSTRAINT "FK_tg_tracked_vk_users__vk_user"');

        await queryRunner.query('DROP TABLE "telegram_tracked_vk_users"');
    }

}
