import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	email: string;

	@Column()
	name: string;

	@Column()
	password: string;
}
