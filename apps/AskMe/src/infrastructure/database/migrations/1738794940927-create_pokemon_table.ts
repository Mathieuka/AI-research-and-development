import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePokemonTable1738794940927 implements MigrationInterface {
	name = 'CreatePokemonTable1738794940927';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "pokemon"`);
	}
}
