import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameFieldToPokemon1740308349283 implements MigrationInterface {
	name = 'AddNameFieldToPokemon1740308349283';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "pokemon" ADD "name" character varying(10)`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "name"`);
	}
}
