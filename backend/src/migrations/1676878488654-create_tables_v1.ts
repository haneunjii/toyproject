import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablesV11676878488654 implements MigrationInterface {
  name = 'createTablesV11676878488654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."post_category_title_enum" AS ENUM('질문', '자기계발', '자유', 'ETC')
        `);
    await queryRunner.query(`
            CREATE TABLE "post_category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" "public"."post_category_title_enum" NOT NULL,
                CONSTRAINT "PK_388636ba602c312da6026dc9dbc" PRIMARY KEY ("id")
            )
        `);
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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_4803a5f6c116a2a95f1cc8af648" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "post_likes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                "post_id" uuid,
                CONSTRAINT "UQ_8f64693922a9e8c4e2605850d0b" UNIQUE ("user_id", "post_id"),
                CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(50) NOT NULL,
                "content" character varying NOT NULL,
                "like_count" integer NOT NULL DEFAULT '0',
                "comment_count" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "author_id" uuid,
                "type_id" uuid,
                CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "post_comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "author_id" uuid,
                "post_id" uuid,
                "parent_comment_id" uuid,
                CONSTRAINT "PK_2e99e04b4a1b31de6f833c18ced" PRIMARY KEY ("id")
            )
        `);
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
            CREATE TABLE "user_address" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "longitude" character varying NOT NULL,
                "latitude" character varying NOT NULL,
                "region1_depth_name" character varying NOT NULL,
                "region2_depth_name" character varying NOT NULL,
                "region3_depth_name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                CONSTRAINT "REL_29d6df815a78e4c8291d3cf5e5" UNIQUE ("user_id"),
                CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_profile" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "follower_count" integer NOT NULL DEFAULT '0',
                "following_count" integer NOT NULL DEFAULT '0',
                "introduction" text NOT NULL DEFAULT '',
                "manner_temperature" numeric NOT NULL DEFAULT '36.5',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                CONSTRAINT "REL_eee360f3bff24af1b689076520" UNIQUE ("user_id"),
                CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id")
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
            CREATE TABLE "user_sns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid,
                CONSTRAINT "REL_c4817611a5ca4e418abc2f4367" UNIQUE ("user_id"),
                CONSTRAINT "PK_f957bcd9aa9a44ae947b3ca9ad3" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_todos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "content" character varying NOT NULL,
                "is_publish" boolean NOT NULL DEFAULT false,
                "end_at" date NOT NULL,
                "is_done" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "author_id" uuid,
                CONSTRAINT "PK_1566314d42aaca43b9f0f422df5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_follow" (
                "id" uuid NOT NULL,
                "following_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "followingId" uuid,
                CONSTRAINT "PK_38b0ee929b5f68c8146afffd850" PRIMARY KEY ("id", "following_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "nickname" character varying NOT NULL,
                "profile_image_url" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "auth_type_id" uuid,
                "profile_id" uuid,
                "address_info_id" uuid,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname"),
                CONSTRAINT "REL_9895c2142d57eee9325874b118" UNIQUE ("auth_type_id"),
                CONSTRAINT "REL_23371445bd80cb3e413089551b" UNIQUE ("profile_id"),
                CONSTRAINT "REL_d14d63a390d90674494444c9bf" UNIQUE ("address_info_id"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_status_enum" AS ENUM('대기', '참여', '탈퇴', '강퇴')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_role_enum" AS ENUM('주최자', '멤버')
        `);
    await queryRunner.query(`
            CREATE TABLE "social_group_users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_status" "public"."social_group_users_user_status_enum" NOT NULL,
                "user_role" "public"."social_group_users_user_role_enum" NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "social_group_id" uuid,
                "user_id" uuid,
                CONSTRAINT "PK_465ce5c119ede761fee977c325f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_groups_type_enum" AS ENUM(
                '운동',
                '노래',
                '춤',
                '재테크',
                '자격증',
                '외국어',
                '공부',
                '독서',
                '글쓰기',
                '포트폴리오',
                '자유'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "social_groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(100) NOT NULL,
                "content" character varying NOT NULL,
                "recruitment" integer NOT NULL,
                "member_count" integer NOT NULL DEFAULT '0',
                "type" "public"."social_groups_type_enum" NOT NULL,
                "thumbnail_url" character varying NOT NULL,
                "need_approve" boolean NOT NULL DEFAULT false,
                "end_at" date NOT NULL,
                "like_count" integer NOT NULL DEFAULT '0',
                "is_offline" boolean NOT NULL,
                "social_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "admin_id" uuid,
                "recruitment_conditions_id" uuid,
                "social_place_id" uuid,
                CONSTRAINT "REL_bfff1854c8f90a44c1f7b8b4d6" UNIQUE ("recruitment_conditions_id"),
                CONSTRAINT "REL_150d5dd43ff6f44a083a4912a2" UNIQUE ("social_place_id"),
                CONSTRAINT "PK_adc1abdb0bbe7aeb66eedfe5413" PRIMARY KEY ("id")
            )
        `);
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
            ALTER TABLE "post_likes"
            ADD CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes"
            ADD CONSTRAINT "FK_b40d37469c501092203d285af80" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_e40f506c288497c6168f9bda251" FOREIGN KEY ("type_id") REFERENCES "post_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_comments"
            ADD CONSTRAINT "FK_abbd11ae09b9fe33103b6c1e6ad" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_comments"
            ADD CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_comments"
            ADD CONSTRAINT "FK_47e60da1f7aeb75961190bff75d" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "user_address"
            ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ADD CONSTRAINT "FK_eee360f3bff24af1b6890765201" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "user_todos"
            ADD CONSTRAINT "FK_0cbdf7f7b520fb7491590324cce" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follow"
            ADD CONSTRAINT "FK_9dcfbeea350dbb23069bea9d7eb" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follow"
            ADD CONSTRAINT "FK_0892d05a7341b2b7abdf3da577d" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_9895c2142d57eee9325874b118d" FOREIGN KEY ("auth_type_id") REFERENCES "user_sns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_d14d63a390d90674494444c9bf0" FOREIGN KEY ("address_info_id") REFERENCES "user_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ADD CONSTRAINT "FK_4943108b0efee4bca40053e2382" FOREIGN KEY ("social_group_id") REFERENCES "social_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users"
            ADD CONSTRAINT "FK_014951b63b356b3b3f01bb870a1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_fea9e5107d8b092e805f8e578f4" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_bfff1854c8f90a44c1f7b8b4d6c" FOREIGN KEY ("recruitment_conditions_id") REFERENCES "social_recruitment_conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_150d5dd43ff6f44a083a4912a23" FOREIGN KEY ("social_place_id") REFERENCES "social_groups_place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_150d5dd43ff6f44a083a4912a23"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_bfff1854c8f90a44c1f7b8b4d6c"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_fea9e5107d8b092e805f8e578f4"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP CONSTRAINT "FK_014951b63b356b3b3f01bb870a1"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP CONSTRAINT "FK_4943108b0efee4bca40053e2382"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_d14d63a390d90674494444c9bf0"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_9895c2142d57eee9325874b118d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follow" DROP CONSTRAINT "FK_0892d05a7341b2b7abdf3da577d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follow" DROP CONSTRAINT "FK_9dcfbeea350dbb23069bea9d7eb"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_todos" DROP CONSTRAINT "FK_0cbdf7f7b520fb7491590324cce"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_sns" DROP CONSTRAINT "FK_c4817611a5ca4e418abc2f4367d"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth_types" DROP CONSTRAINT "FK_e7a61c7707d526e470abf3a8217"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile" DROP CONSTRAINT "FK_eee360f3bff24af1b6890765201"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"
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
            ALTER TABLE "post_comments" DROP CONSTRAINT "FK_47e60da1f7aeb75961190bff75d"
        `);
    await queryRunner.query(`
            ALTER TABLE "post_comments" DROP CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59"
        `);
    await queryRunner.query(`
            ALTER TABLE "post_comments" DROP CONSTRAINT "FK_abbd11ae09b9fe33103b6c1e6ad"
        `);
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_e40f506c288497c6168f9bda251"
        `);
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes" DROP CONSTRAINT "FK_b40d37469c501092203d285af80"
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes" DROP CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_reports"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_reports_social_group_report_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "social_recruitment_conditions"
        `);
    await queryRunner.query(`
            DROP TABLE "social_groups"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_groups_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_users"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_users_user_role_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_group_users_user_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TABLE "user_follow"
        `);
    await queryRunner.query(`
            DROP TABLE "user_todos"
        `);
    await queryRunner.query(`
            DROP TABLE "user_sns"
        `);
    await queryRunner.query(`
            DROP TABLE "user_oauth_types"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_oauth_types_sns_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile"
        `);
    await queryRunner.query(`
            DROP TABLE "user_address"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_report_logs"
        `);
    await queryRunner.query(`
            DROP TABLE "social_group_report_images"
        `);
    await queryRunner.query(`
            DROP TABLE "post_comments"
        `);
    await queryRunner.query(`
            DROP TABLE "posts"
        `);
    await queryRunner.query(`
            DROP TABLE "post_likes"
        `);
    await queryRunner.query(`
            DROP TABLE "social_groups_place"
        `);
    await queryRunner.query(`
            DROP TABLE "post_category"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."post_category_title_enum"
        `);
  }
}
