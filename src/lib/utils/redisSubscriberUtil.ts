import { redisSubscriber } from '$lib/redis';
import { broadcast } from './sseObserverUtil';

let initialized = false;

export async function initSubscriber() {
	if (initialized) return;
	initialized = true;

	await redisSubscriber.subscribe('ticket-realtime', (message) => {
		broadcast('message', message);
	});
}
