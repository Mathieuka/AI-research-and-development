import { Module } from '@nestjs/common';
import { PokemonModule } from '@/modules/pokemon.module';
import { DatabaseModule } from '@/modules/database.module';

@Module({
  imports: [PokemonModule, DatabaseModule],
})
export class AppModule {
  constructor() {}
}
