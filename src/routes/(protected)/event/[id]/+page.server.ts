import { redisPublisher } from '$lib/redis';
import { EventRepository } from '$lib/repositories/EventRepository';
import { TicketRepository } from '$lib/repositories/TicketRepository.js';
import type { Actions } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.userEmail) {
		return fail(400);
	}

	const event = await EventRepository.getEvent(params.id);

	if (event == null) {
		error(404, 'Event not found');
	}

	const tickets = await TicketRepository.getTickets(params.id, locals.userEmail);

	if (tickets == null) {
		error(404, 'Event not found');
	}

	return {
		event: event!,
		tickets: tickets!
	};
};

export const actions: Actions = {
	tempReserve: async ({ request, params, locals }) => {
		if (!locals.userEmail) {
			return fail(400);
		}

		const eventID = params.id;

		if (eventID == null) {
			error(404, 'Event not found');
		}

		const data = await request.formData();

		const ticketName = data.get('name');

		if (typeof ticketName !== 'string' || !ticketName) {
			return fail(400);
		}

		TicketRepository.reserveTickets(eventID, ticketName, locals.userEmail);

		redisPublisher.publish('ticket-realtime', '');
	},

	buy: async ({ request, params, locals }) => {
		if (!locals.userEmail) {
			error(400);
		}

		const eventID = params.id;
		if (eventID == null) {
			error(404, 'Event not found');
		}

		const data = await request.formData();
		const ticketName = data.get('name');

		if (typeof ticketName !== 'string' || !ticketName) {
			return error(400);
		}

		try {
			await TicketRepository.purchaseTicket(eventID, ticketName, locals.userEmail);
		} catch (e) {
			if (e instanceof Error) {
				error(400, e.message);
			} else {
				error(400, 'Unknown error');
			}
		}
	}
};
