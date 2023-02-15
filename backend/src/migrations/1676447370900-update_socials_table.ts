import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSocialsTable1676447370900 implements MigrationInterface {
  name = 'updateSocialsTable1676447370900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "social_group_report_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "social_group_report_log_id" uuid,
                CONSTRAINT "PK_0d582f51398ee6690f578124553" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "social_group_report_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "reason" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                "social_group_id" uuid,
                CONSTRAINT "PK_fb558a8ea2eaee8ae946e03b2b2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."user_oauth_types_sns_type_enum" AS ENUM('KAKAO', 'NAVER', 'GOOGLE', 'ETC')
        `);
    await queryRunner.query(`
            CREATE TABLE "user_oauth_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "sns_type" "public"."user_oauth_types_sns_type_enum" NOT NULL,
                "user_sns_id" uuid,
                CONSTRAINT "UQ_a21896eb086b2479db4e9eb8c2f" UNIQUE ("username"),
                CONSTRAINT "PK_a9ef797b05496d6e55e3f12551e" PRIMARY KEY ("id", "sns_type")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_reports_social_group_report_enum" AS ENUM(
                '특정 제품, 서비스, 사무임 단순 홍보',
                '성적인 내용',
                '전화번호, 이메일, SNS 등 개인정보 요구',
                '기타'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "social_group_reports" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "social_group_report" "public"."social_group_reports_social_group_report_enum" NOT NULL,
                "social_group_report_log_id" uuid,
                CONSTRAINT "PK_d0dab5a1654f1be0fbbb3a2fb93" PRIMARY KEY ("id", "social_group_report")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP CONSTRAINT "UQ_99f62ce801d9937a28ef7eff295"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP COLUMN "sns_type"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_sns_sns_type_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP COLUMN "oauth_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD CONSTRAINT "UQ_c4817611a5ca4e418abc2f4367d" UNIQUE ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT '36.5'
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_9895c2142d57eee9325874b118d"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_9895c2142d57eee9325874b118d" UNIQUE ("auth_type_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_images"
            ADD CONSTRAINT "FK_deeebd3879e99c5cebb9c1d7f21" FOREIGN KEY ("social_group_report_log_id") REFERENCES "social_group_report_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_logs"
            ADD CONSTRAINT "FK_727142301abb5d11f2d0acee614" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_logs"
            ADD CONSTRAINT "FK_9aa46a9fa7ad0e1f47fa0dedaf6" FOREIGN KEY ("social_group_id") REFERENCES "social_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth_types"
            ADD CONSTRAINT "FK_e7a61c7707d526e470abf3a8217" FOREIGN KEY ("user_sns_id") REFERENCES "user_sns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD CONSTRAINT "FK_c4817611a5ca4e418abc2f4367d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_9895c2142d57eee9325874b118d" FOREIGN KEY ("auth_type_id") REFERENCES "user_sns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_reports"
            ADD CONSTRAINT "FK_57f35d7b9f087768fe707342757" FOREIGN KEY ("social_group_report_log_id") REFERENCES "social_group_report_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_group_reports" DROP CONSTRAINT "FK_57f35d7b9f087768fe707342757"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_9895c2142d57eee9325874b118d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP CONSTRAINT "FK_c4817611a5ca4e418abc2f4367d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth_types" DROP CONSTRAINT "FK_e7a61c7707d526e470abf3a8217"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_logs" DROP CONSTRAINT "FK_9aa46a9fa7ad0e1f47fa0dedaf6"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_logs" DROP CONSTRAINT "FK_727142301abb5d11f2d0acee614"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_report_images" DROP CONSTRAINT "FK_deeebd3879e99c5cebb9c1d7f21"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_9895c2142d57eee9325874b118d"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_9895c2142d57eee9325874b118d" FOREIGN KEY ("auth_type_id") REFERENCES "user_sns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ALTER COLUMN "manner_temperature"
            SET DEFAULT 36.5
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP CONSTRAINT "UQ_c4817611a5ca4e418abc2f4367d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD "oauth_id" character varying NOT NULL
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."user_sns_sns_type_enum" AS ENUM('KAKAO', 'NAVER', 'GOOGLE', 'ETC')
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD "sns_type" "public"."user_sns_sns_type_enum" NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns"
            ADD CONSTRAINT "UQ_99f62ce801d9937a28ef7eff295" UNIQUE ("sns_type")
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_reports"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_reports_social_group_report_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "user_oauth_types"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_oauth_types_sns_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_report_logs"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_report_images"
        `);
  }
}
