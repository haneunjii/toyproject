import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUserTable1676474116257 implements MigrationInterface {
  name = 'updateUserTable1676474116257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile" DROP COLUMN "profile_image_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "profile_image_url" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT '36.5'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT 36.5
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "profile_image_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ADD "profile_image_url" character varying NOT NULL
        `);
  }
}
