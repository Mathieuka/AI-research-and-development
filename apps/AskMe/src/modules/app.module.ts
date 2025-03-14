import { DatabaseModule } from '@/modules/database.module';
import { PokemonModule } from '@/modules/pokemon.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [PokemonModule, DatabaseModule],
})
export class AppModule {}
