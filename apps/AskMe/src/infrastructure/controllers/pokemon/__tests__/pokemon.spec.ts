import {
	Pokemon,
	PokemonType,
} from '@/infrastructure/database/entities/pokemon.entity';
import { AppModule } from '@/modules/app.module';
import { dataSourceIntegrationTest } from '@/test/integration/datasource';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
	let app: INestApplication;
	const pokemonRepository = dataSourceIntegrationTest.getRepository(Pokemon);

	beforeAll(async () => {
		await dataSourceIntegrationTest.initialize();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
		await dataSourceIntegrationTest.destroy();
	});

	afterEach(async () => {
		await pokemonRepository.clear();
	});

	it('Find all pokemon', async () => {
		const pokemon = pokemonRepository.create({
			type: PokemonType.ELECTRIC,
			name: 'Pikachu',
		});
		await pokemonRepository.save(pokemon);

		const response = await request(app.getHttpServer())
			.get('/pokemons')
			.expect(200);

		expect(response.body).toEqual([
			{ type: PokemonType.ELECTRIC, name: 'Pikachu', id: expect.any(String) },
		]);
	});

	it.skip('Rename pokemon', async () => {
		const pokemon = pokemonRepository.create({
			type: PokemonType.ELECTRIC,
			name: 'Pikachu',
		});

		await pokemonRepository.save(pokemon);

		const response_1 = await request(app.getHttpServer())
			.get('/pokemons')
			.expect(200);

		expect(response_1.body).toEqual([
			{ type: PokemonType.ELECTRIC, name: 'Pikachu', id: expect.any(String) },
		]);

		const response_2 = await request(app.getHttpServer())
			.put(`/pokemons/${response_1.body[0].id}`)
			.send({ name: 'Odorus' })
			.expect(200);

		expect(response_2.body).toEqual({
			type: PokemonType.ELECTRIC,
			name: 'Odorus',
			id: expect.any(String),
		});

		const response_3 = await request(app.getHttpServer())
			.get('/pokemons')
			.expect(200);

		expect(response_3.body).toEqual([
			{ type: PokemonType.ELECTRIC, name: 'Odorus', id: expect.any(String) },
		]);
	});
});
