import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScreenNameToUser1691675546617 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE vkontakte_users ADD COLUMN screen_name character varying');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE vkontakte_users DROP COLUMN screen_name');
    }

}
