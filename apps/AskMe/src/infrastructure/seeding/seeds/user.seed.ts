import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '@/infrastructure/database/entities/user.entity';

export default class UserSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager,
	): Promise<any> {
		// const repository = dataSource.getRepository(User);
		// await repository.save({ name: 'Matt' });

		const factory = factoryManager.get(User);
		const users = await factory.saveMany(1);
		console.log(`Created ${users.length} users`);
	}
}
