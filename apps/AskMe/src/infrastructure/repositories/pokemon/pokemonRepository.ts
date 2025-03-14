import { IPokemonRepository } from '@/core/domain/repositories';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	Pokemon,
	PokemonType,
} from '@/infrastructure/database/entities/pokemon.entity';

@Injectable()
export class PokemonRepository implements IPokemonRepository {
	constructor(
		@InjectRepository(Pokemon)
		private pokemonRepository: Repository<Pokemon>,
	) {}

	async get() {
		const response = await this.pokemonRepository.findOne({
			where: { type: PokemonType.ELECTRIC },
		});

		if (!response) {
			throw new Error('Pokemon not found');
		}

		return response;
	}

	async findAll() {
		const response = await this.pokemonRepository.find();

		if (!response) {
			throw new Error('Pokemon not found');
		}

		return response;
	}
}
