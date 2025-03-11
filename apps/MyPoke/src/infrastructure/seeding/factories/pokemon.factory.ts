import { setSeederFactory } from 'typeorm-extension';
import {
  Pokemon,
  PokemonType,
} from '@/infrastructure/database/entities/pokemon.entity';

export default setSeederFactory(Pokemon, (faker) => {
  const pokemon = new Pokemon();

  pokemon.type = PokemonType.ELECTRIC;
  pokemon.name = 'Pikachu';
  return pokemon;
});
