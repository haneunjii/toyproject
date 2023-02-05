import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablesV11675520977854 implements MigrationInterface {
  name = 'createTablesV11675520977854';

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
                "type" "public"."social_groups_type_enum" NOT NULL,
                "thumbnail_url" character varying NOT NULL,
                "need_approve" boolean NOT NULL DEFAULT false,
                "end_at" date NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "admin_id" uuid,
                CONSTRAINT "PK_adc1abdb0bbe7aeb66eedfe5413" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_status_enum" AS ENUM('대기', '참여', '탈퇴')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_group_users_user_role_enum" AS ENUM('주최자', '멤버')
        `);
    await queryRunner.query(`
            CREATE TABLE "social_group_users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_status" "public"."social_group_users_user_status_enum" NOT NULL,
                "user_role" "public"."social_group_users_user_role_enum" NOT NULL,
                "social_group_id" uuid,
                "user_id" uuid,
                CONSTRAINT "PK_465ce5c119ede761fee977c325f" PRIMARY KEY ("id")
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
                "profile_image_url" character varying NOT NULL,
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
            CREATE TYPE "public"."user_sns_sns_type_enum" AS ENUM('KAKAO', 'NAVER', 'GOOGLE', 'ETC')
        `);
    await queryRunner.query(`
            CREATE TABLE "user_sns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "oauth_id" character varying NOT NULL,
                "sns_type" "public"."user_sns_sns_type_enum" NOT NULL,
                CONSTRAINT "UQ_99f62ce801d9937a28ef7eff295" UNIQUE ("sns_type"),
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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "auth_type_id" uuid,
                "profile_id" uuid,
                "address_info_id" uuid,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname"),
                CONSTRAINT "REL_23371445bd80cb3e413089551b" UNIQUE ("profile_id"),
                CONSTRAINT "REL_d14d63a390d90674494444c9bf" UNIQUE ("address_info_id"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
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
            ALTER TABLE "social_groups"
            ADD CONSTRAINT "FK_fea9e5107d8b092e805f8e578f4" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "user_address"
            ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile"
            ADD CONSTRAINT "FK_eee360f3bff24af1b6890765201" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_e40f506c288497c6168f9bda251" FOREIGN KEY ("type_id") REFERENCES "post_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes"
            ADD CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes"
            ADD CONSTRAINT "FK_b40d37469c501092203d285af80" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "post_likes" DROP CONSTRAINT "FK_b40d37469c501092203d285af80"
        `);
    await queryRunner.query(`
            ALTER TABLE "post_likes" DROP CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b"
        `);
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_e40f506c288497c6168f9bda251"
        `);
    await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"
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
            ALTER TABLE "user_profile" DROP CONSTRAINT "FK_eee360f3bff24af1b6890765201"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP CONSTRAINT "FK_014951b63b356b3b3f01bb870a1"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_group_users" DROP CONSTRAINT "FK_4943108b0efee4bca40053e2382"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_groups" DROP CONSTRAINT "FK_fea9e5107d8b092e805f8e578f4"
        `);
    await queryRunner.query(`
            DROP TABLE "post_likes"
        `);
    await queryRunner.query(`
            DROP TABLE "posts"
        `);
    await queryRunner.query(`
            DROP TABLE "post_comments"
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
            DROP TYPE "public"."user_sns_sns_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile"
        `);
    await queryRunner.query(`
            DROP TABLE "user_address"
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
            DROP TABLE "social_groups"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_groups_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "post_category"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."post_category_title_enum"
        `);
  }
}
