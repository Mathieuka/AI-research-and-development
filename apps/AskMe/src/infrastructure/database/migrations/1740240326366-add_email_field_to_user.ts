import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailFieldToUser1740240326366 implements MigrationInterface {
	name = 'AddEmailFieldToUser1740240326366';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
	}
}
