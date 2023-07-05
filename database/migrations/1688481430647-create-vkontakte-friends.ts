import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVkontakteFriends1688481430647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "vkontakte_friends" (
            id SERIAL NOT NULL,
            "vkontakte_user_id" uuid NOT NULL, 
            "vkontakte_friend_user_id" uuid NOT NULL, 
            CONSTRAINT "PK_vk_friends__id" PRIMARY KEY ("id")
        )`);

        await queryRunner.query('ALTER TABLE "vkontakte_friends" ADD CONSTRAINT "FK_vk_friends__vk_user" FOREIGN KEY ("vkontakte_user_id") REFERENCES "vkontakte_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');

        await queryRunner.query('ALTER TABLE "vkontakte_friends" ADD CONSTRAINT "FK_vk_friends__vk_friend" FOREIGN KEY ("vkontakte_friend_user_id") REFERENCES "vkontakte_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "vkontakte_friends" DROP CONSTRAINT "FK_vk_friends__vk_user"');
        await queryRunner.query('ALTER TABLE "vkontakte_friends" DROP CONSTRAINT "FK_vk_friends__vk_friend"');

        await queryRunner.query('DROP TABLE "vkontakte_friends"');
    }

}
