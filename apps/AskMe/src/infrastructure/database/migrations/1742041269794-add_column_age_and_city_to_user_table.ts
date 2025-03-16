import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAgeAndCityToUserTable1742041269794 implements MigrationInterface {
    name = 'AddColumnAgeAndCityToUserTable1742041269794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "age" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    }

}
