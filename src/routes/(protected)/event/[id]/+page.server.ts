import { EventRepository } from '$lib/repositories/EventRepository';
import { TicketRepository } from '$lib/repositories/TicketRepository.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load = async ({ params }) => {
	const event = await EventRepository.getEvent(params.id);

	if (event == null) {
		return error(404, 'Event not found');
	}

	const tickets = await TicketRepository.getTickets(params.id);

	return {
		event: event,
		tickets: tickets
	};
};
