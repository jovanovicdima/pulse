import type { Event, NewEvent } from '$lib/models/Event';
import redis from '$lib/redis';
import { getRedisEventKey } from '$lib/utils/redisKeyUtils';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

type RedisMultiClient = ReturnType<typeof redis.multi>;

export class EventRepository {
	private constructor() {}

	static async getEvents(take: number, skip = 0): Promise<Event[]> {
		const now = dayjs().unix(); // Current timestamp

		// Get events that start from now onwards
		const ids = await redis.ZRANGEBYSCORE('events:byStartTime', now, '+inf', {
			LIMIT: {
				offset: skip,
				count: take
			}
		});

		if (ids.length === 0) return [];

		const pipeline = redis.multi();
		for (const id of ids) {
			pipeline.HGETALL(getRedisEventKey(id));
		}

		const results = await pipeline.exec();

		if (!results) return [];

		return results
			.map((result) => {
				const data = Array.isArray(result) ? result[1] : result;

				if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
					return null;
				}

				return {
					id: data.id,
					title: data.title,
					description: data.description,
					image: data.image || undefined,
					location: data.location,
					datetime: data.datetime,
					postedBy: data.postedBy,
					postedAt: data.postedAt
				} as Event;
			})
			.filter((e): e is Event => e !== null);
	}

	static async getEvent(id: string): Promise<Event | null> {
		const key = getRedisEventKey(id);
		const data = await redis.HGETALL(key);

		if (Object.keys(data).length === 0) return null;

		return {
			id: data.id,
			title: data.title,
			description: data.description,
			image: data.image || undefined,
			location: data.location,
			datetime: data.datetime,
			postedBy: data.postedBy,
			postedAt: data.postedAt
		};
	}

	static async createEvent(event: NewEvent): Promise<void> {
		const uuid = randomUUID();
		const key = getRedisEventKey(uuid);
		const hashData: {
			id: string;
			title: string;
			description: string;
			location: string;
			datetime: string;
			postedBy: string;
			image?: string | undefined;
		} = {
			id: String(uuid),
			title: String(event.title),
			description: String(event.description),
			location: String(event.location),
			datetime: String(event.datetime),
			postedBy: String(event.postedBy)
		};

		if (event.image) {
			hashData.image = String(event.image);
		}

		await redis.ZADD('events:byStartTime', {
			score: new Date(event.datetime).getTime(),
			value: uuid
		});

		await redis.HSET(key, hashData);
	}

	static async updateEvent(event: Event): Promise<void> {
		const key = getRedisEventKey(event.id);
		const hashData: {
			id: string;
			title: string;
			description: string;
			location: string;
			datetime: string;
			postedBy: string;
			image?: string | undefined;
		} = {
			id: String(event.id),
			title: String(event.title),
			description: String(event.description),
			location: String(event.location),
			datetime: String(event.datetime),
			postedBy: String(event.postedBy)
		};

		if (event.image) {
			hashData.image = String(event.image);
		}

		await redis.ZADD('events:byStartTime', {
			score: new Date(event.datetime).getTime(),
			value: event.id
		});

		await redis.HSET(key, hashData);
	}

	static async deleteEvent(id: string): Promise<void> {
		const key = getRedisEventKey(id);
		await redis.ZREM('events:byStartTime', id);
		await redis.DEL(key);
	}

	static async eventExists(id: string): Promise<boolean> {
		const key = getRedisEventKey(id);
		return (await redis.EXISTS(key)) === 1;
	}

	// Multi methods (for batching operations)
	static createEventMulti(event: NewEvent, multi: RedisMultiClient): string {
		const uuid = randomUUID();
		const key = getRedisEventKey(uuid);
		const hashData: Record<string, string> = {
			id: String(uuid),
			title: String(event.title),
			description: String(event.description),
			location: String(event.location),
			datetime: String(event.datetime),
			postedBy: String(event.postedBy),
			postedAt: dayjs().toISOString()
		};

		if (event.image) {
			hashData.image = String(event.image);
		}

		multi.ZADD('events:byStartTime', {
			score: dayjs(event.datetime).unix(),
			value: uuid
		});

		multi.HSET(key, hashData);
		return hashData.id;
	}

	static updateEventMulti(event: Event, multi: RedisMultiClient): void {
		const key = getRedisEventKey(event.id);
		const hashData = {
			id: String(event.id),
			title: String(event.title),
			description: String(event.description),
			image: String(event.image),
			location: String(event.location),
			datetime: String(event.datetime),
			postedBy: String(event.postedBy),
			postedAt: String(event.postedAt)
		};

		multi.ZADD('events:byStartTime', {
			score: new Date(event.datetime).getTime(),
			value: event.id
		});

		multi.HSET(key, hashData);
	}

	static deleteEventMulti(id: string, multi: RedisMultiClient): void {
		const key = getRedisEventKey(id);
		multi.ZREM('events:byStartTime', id);
		multi.DEL(key);
	}
}
