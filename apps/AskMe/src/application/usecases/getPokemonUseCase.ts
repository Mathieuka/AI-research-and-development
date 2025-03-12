import { Injectable } from '@nestjs/common';
import { PokemonRepository } from '@/infrastructure/repositories/pokemon/pokemonRepository';
import { Pokemon } from '@/infrastructure/database/entities/pokemon.entity';

@Injectable()
export class GetPokemonUseCase {
  constructor(private pokemonRepository: PokemonRepository) {}

  async execute(): Promise<Pokemon> {
    return this.pokemonRepository.get();
  }
}
