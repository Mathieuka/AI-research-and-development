import { DataSource } from 'typeorm';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { User } from '@/infrastructure/database/entities/user.entity';

type TestConfig = {
  port: number;
  database: string;
};

export const testConfig: TestConfig = {
  port: 5435,
  database: 'my-pokemon-integration-dev',
};

export const dataSourceIntegrationTest = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'user',
  password: 'password',
  entities: [Pokemon, User],
  ...(process.env.NODE_ENV === 'test' ? testConfig : {}),
});
