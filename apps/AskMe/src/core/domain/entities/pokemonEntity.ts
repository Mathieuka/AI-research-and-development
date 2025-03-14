import { PokemonType } from '@/infrastructure/database/entities/pokemon.entity';

export interface IPokemon {
	rename(newName: string): PokemonEntity;
}

class PokemonEntity implements IPokemon {
	constructor(
		private readonly type: PokemonType,
		private readonly name: string,
	) {
		this.type = type;
		this.name = name;
	}

	rename(newName: string) {
		if (newName.length > 10) {
			throw new Error('Name is too long');
		}

		return new PokemonEntity(this.type, newName);
	}
}

export default PokemonEntity;
