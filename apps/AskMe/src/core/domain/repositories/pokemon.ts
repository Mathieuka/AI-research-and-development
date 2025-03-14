import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';

export interface IPokemonRepository {
	get(): Promise<Pokemon>;
	findAll(): Promise<Pokemon[]>;
}
