import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '$env/static/private';

const redisUrl = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

const redis = createClient({
	url: redisUrl
});

redis.on('error', (err) => console.error('Redis Client Error', err));

await redis.connect();

export default redis;
