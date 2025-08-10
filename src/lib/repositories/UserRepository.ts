import neo from '$lib/neo4j';
import redis from '$lib/redis';
import { getRedisUserKey } from '$lib/utils/redisKeyUtils';
import bcrypt from 'bcrypt';

export class UserRepository {
	static async createUser(email: string, password: string) {
		// create user
		const hashedPassword = await bcrypt.hash(password, 12);

		// Store in Redis
		await redis.SET(getRedisUserKey(email), hashedPassword);

		// Create user in neo4j
		const session = neo.session();

		try {
			await session.run('CREATE (u:User {email: $email})', {
				email
			});
		} catch (error) {
			console.error(error);
		} finally {
			await session.close();
		}
	}
}
