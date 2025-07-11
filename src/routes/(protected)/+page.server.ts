import { EventRepository } from '$lib/repositories/EventRepository';

export const prerender = true;

export const load = async () => {
	const events = await EventRepository.getEvents(10);

	return {
		event: events
	};
};
