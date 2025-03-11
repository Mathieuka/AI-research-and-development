import { MigrationInterface, QueryRunner } from "typeorm";

export class UseEnumForPokemonType1740308754580 implements MigrationInterface {
    name = 'UseEnumForPokemonType1740308754580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_type_enum" AS ENUM('fire', 'water', 'grass', 'electric')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "type" "public"."pokemon_type_enum"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_type_enum"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "type" character varying NOT NULL`);
    }

}
