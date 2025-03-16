import { MigrationInterface, QueryRunner } from "typeorm";

export class UdpateAgeType1742044625134 implements MigrationInterface {
    name = 'UdpateAgeType1742044625134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "age" character varying`);
    }

}
