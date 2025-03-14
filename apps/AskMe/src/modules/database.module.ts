import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { User } from '@/infrastructure/database/entities/user.entity';
import { testConfig } from '@/test/integration/datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'db',
      entities: [Pokemon, User],
      synchronize: false,
      logging: false,
      ...(process.env.NODE_ENV === 'test' ? testConfig : {}),
    }),
  ],
})
export class DatabaseModule {}
