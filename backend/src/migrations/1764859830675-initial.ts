import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1764859830675 implements MigrationInterface {
  name = 'Initial1764859830675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "tag" character varying(10) NOT NULL, "country" character varying(3) NOT NULL DEFAULT 'FR', "logo_url" character varying(255), "founded_year" integer, "total_earnings" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ff82a08ae7a3546c1d91fb684b0" UNIQUE ("tag"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "category" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."match_format" AS ENUM('BO1', 'BO3', 'BO5')`,
    );
    await queryRunner.query(
      `CREATE TABLE "matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "match_date" TIMESTAMP, "status" character varying(20) NOT NULL DEFAULT 'SCHEDULED', "team1_score" integer NOT NULL DEFAULT '0', "team2_score" integer NOT NULL DEFAULT '0', "format" "public"."match_format", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "team1Id" uuid, "team2Id" uuid, "gameId" uuid, "winnerId" uuid, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(8,2) NOT NULL, "potential_payout" numeric(10,2) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "placed_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "matchId" uuid, "teamId" uuid, CONSTRAINT "PK_7ca91a6a39623bd5c21722bcedd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password_hash" character varying(255), "balance" numeric(10,2) NOT NULL DEFAULT '0', "total_bet" numeric(10,2) NOT NULL DEFAULT '0', "total_won" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "match_odds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "odds" numeric(4,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "matchId" uuid, "teamId" uuid, CONSTRAINT "PK_b30dced875ae8e5538465cc722a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_142e2e9501f3c551d5d7fcd6fc0" FOREIGN KEY ("team1Id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_b8621a9ae4f727940f1d28c8a2c" FOREIGN KEY ("team2Id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_aaaeb9fd98fc66bbf57dea17677" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_eb5e9984be5b3bd5c8e3ef2d9ec" FOREIGN KEY ("winnerId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" ADD CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" ADD CONSTRAINT "FK_ddd8dce54aa5f1af36c467c9dae" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" ADD CONSTRAINT "FK_bea9632c75f49d8a9d4ca3c0810" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_odds" ADD CONSTRAINT "FK_a40b243cadeec63d06c2393950e" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_odds" ADD CONSTRAINT "FK_ee4c2a6cb3fceefa5d99264e11c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match_odds" DROP CONSTRAINT "FK_ee4c2a6cb3fceefa5d99264e11c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_odds" DROP CONSTRAINT "FK_a40b243cadeec63d06c2393950e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" DROP CONSTRAINT "FK_bea9632c75f49d8a9d4ca3c0810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" DROP CONSTRAINT "FK_ddd8dce54aa5f1af36c467c9dae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bets" DROP CONSTRAINT "FK_ca8cf669d26fbfcc365a4811b22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_eb5e9984be5b3bd5c8e3ef2d9ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_aaaeb9fd98fc66bbf57dea17677"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_b8621a9ae4f727940f1d28c8a2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_142e2e9501f3c551d5d7fcd6fc0"`,
    );
    await queryRunner.query(`DROP TABLE "match_odds"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "bets"`);
    await queryRunner.query(`DROP TABLE "matches"`);
    await queryRunner.query(`DROP TYPE "public"."match_format"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "teams"`);
  }
}
