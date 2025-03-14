import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseUuidForEntityId1740249708384 implements MigrationInterface {
	name = 'UseUuidForEntityId1740249708384';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "pokemon" DROP CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a"`,
		);
		await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "pokemon" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
		);
		await queryRunner.query(
			`ALTER TABLE "pokemon" ADD CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
		);
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
		);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(
			`ALTER TABLE "pokemon" DROP CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a"`,
		);
		await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "pokemon" ADD "id" SERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "pokemon" ADD CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id")`,
		);
	}
}
