import { initSubscriber } from '$lib/utils/redisSubscriberUtil';
import { addClient, removeClient } from '$lib/utils/sseObserverUtil.js';
import { produce } from 'sveltekit-sse';

export const GET = async ({ url, locals }) => {
	if (locals.userEmail == null) {
		return new Response(null, { status: 401 });
	}

	const eventID = url.searchParams.get('id');
	if (!eventID) {
		return new Response(null, { status: 400, statusText: 'Missing id' });
	}

	await initSubscriber();

	return produce(({ emit }) => {
		addClient(emit);

		return async () => {
			removeClient(emit);
		};
	});
};
