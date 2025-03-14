import { DataSource } from 'typeorm';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { User } from '@/infrastructure/database/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5435,
  username: 'postgres',
  password: 'postgres',
  database: 'test-db',
  entities: [Pokemon, User],
  synchronize: false,
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  migrationsRun: false,
});

export default AppDataSource;
