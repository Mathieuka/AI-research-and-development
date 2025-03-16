import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	email: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	age: number;

	@Column({ nullable: true })
	city: string;

	@Column()
	password: string;
}
