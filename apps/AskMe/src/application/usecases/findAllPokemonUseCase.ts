import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';
import { Injectable } from '@nestjs/common';
import { PokemonRepository } from '@/infrastructure/repositories/pokemon/pokemonRepository';

@Injectable()
export class FindAllPokemonUseCase {
	constructor(private pokemonRepository: PokemonRepository) {}

	async execute(): Promise<Pokemon[]> {
		return this.pokemonRepository.findAll();
	}
}
