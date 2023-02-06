import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSocialGroupsPlaceTable1675665377106
  implements MigrationInterface
{
  name = 'createSocialGroupsPlaceTable1675665377106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "social_groups_place" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "latitude" character varying NOT NULL,
                "longitude" character varying NOT NULL,
                "place_address" character varying NOT NULL,
                "region1_depth_name" character varying NOT NULL,
                "region2_depth_name" character varying NOT NULL,
                "region3_depth_name" character varying NOT NULL,
                "building_name" character varying,
                CONSTRAINT "PK_4803a5f6c116a2a95f1cc8af648" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "social_at" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD "social_place_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "UQ_150d5dd43ff6f44a083a4912a23" UNIQUE ("social_place_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT '36.5'
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_150d5dd43ff6f44a083a4912a23" FOREIGN KEY ("social_place_id") REFERENCES "social_groups_place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_150d5dd43ff6f44a083a4912a23"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT 36.5
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "UQ_150d5dd43ff6f44a083a4912a23"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "social_place_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP COLUMN "social_at"
        `);
    await queryRunner.query(`
            DROP TABLE "social_groups_place"
        `);
  }
}
