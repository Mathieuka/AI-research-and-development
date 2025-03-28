import { DataSource } from 'typeorm';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { User } from '@/infrastructure/database/entities/user.entity';

const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5434,
	username: 'postgres',
	password: 'postgres',
	database: 'db-pgai',
	entities: [Pokemon, User],
	migrations: ['src/infrastructure/database/migrations/*.ts'],
	// logging: true,
});

export default AppDataSource;
