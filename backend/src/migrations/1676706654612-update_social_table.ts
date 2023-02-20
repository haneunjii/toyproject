import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSocialTable1676706654612 implements MigrationInterface {
  name = 'updateSocialTable1676706654612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ADD "deleted_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups_place"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups_place"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups_place"
            ADD "deleted_at" TIMESTAMP
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
            ALTER TABLE "social_groups_place" DROP COLUMN "deleted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups_place" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups_place" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP COLUMN "deleted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP COLUMN "created_at"
        `);
  }
}
