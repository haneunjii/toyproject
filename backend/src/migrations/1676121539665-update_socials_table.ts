import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSocialsTable1676121539665 implements MigrationInterface {
  name = 'updateSocialsTable1676121539665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "social_recruitment_conditions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "max_age" integer NOT NULL,
                "min_age" integer NOT NULL,
                "only_female" boolean NOT NULL DEFAULT false,
                "only_male" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_da4aa4ba946366c56087cad70e8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "member_count" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "like_count" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "is_offline" boolean NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "recruitment_conditions_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "UQ_bfff1854c8f90a44c1f7b8b4d6c" UNIQUE ("recruitment_conditions_id")
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."social_group_users_user_status_enum"
            RENAME TO "social_group_users_user_status_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_status_enum" AS ENUM('대기', '참여', '탈퇴', '강퇴')
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ALTER COLUMN "user_status" TYPE "public"."social_group_users_user_status_enum" USING "user_status"::"text"::"public"."social_group_users_user_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_users_user_status_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT '36.5'
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_bfff1854c8f90a44c1f7b8b4d6c" FOREIGN KEY ("recruitment_conditions_id") REFERENCES "social_recruitment_conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_bfff1854c8f90a44c1f7b8b4d6c"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT 36.5
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_status_enum_old" AS ENUM('대기', '참여', '탈퇴')
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ALTER COLUMN "user_status" TYPE "public"."social_group_users_user_status_enum_old" USING "user_status"::"text"::"public"."social_group_users_user_status_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_users_user_status_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."social_group_users_user_status_enum_old"
            RENAME TO "social_group_users_user_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "UQ_bfff1854c8f90a44c1f7b8b4d6c"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "recruitment_conditions_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "is_offline"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "like_count"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "member_count"
        `);
    await queryRunner.query(`
            DROP TABLE "social_recruitment_conditions"
        `);
  }
}
