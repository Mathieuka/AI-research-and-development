import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum PokemonType {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
}

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PokemonType,
    nullable: true,
  })
  type: PokemonType;

  @Column({ length: 10 })
  name: string;
}
