import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { User } from '@/infrastructure/database/entities/user.entity';
import * as path from 'node:path';

const seedPath = path.join(__dirname, './seeds/*.seed.ts');
const factoryPath = path.join(__dirname, 'factories/*.factory.ts');

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'postgres',
  password: 'postgres',
  database: 'db',
  entities: [Pokemon, User],
  migrationsRun: false,
  seedTracking: false,
  factories: [factoryPath],
  seeds: [seedPath],
};

const AppDataSource = new DataSource(options);

export default AppDataSource;
