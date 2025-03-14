import { setSeederFactory } from 'typeorm-extension';
import { User } from '@/infrastructure/database/entities/user.entity';

export default setSeederFactory(User, (faker) => {
	const user = new User();

	user.name = faker.person.firstName();
	user.password = faker.internet.password();
	user.email = faker.internet.email();

	return user;
});
