import {
	FindAllPokemonUseCase,
	GetPokemonUseCase,
} from '@/application/usecases';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class PokemonController {
	constructor(
		private readonly getPokemonUseCase: GetPokemonUseCase,
		private readonly findAllPokemonUseCase: FindAllPokemonUseCase,
	) {}

	@Get('/pokemons')
	getPokemon(@Param('id') id: string): any {
		// console.log('%c LOG id', 'background: #222; color: #bada55', id);
		return this.findAllPokemonUseCase.execute();
	}
}
