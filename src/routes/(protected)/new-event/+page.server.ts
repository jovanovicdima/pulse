import type { NewTicket } from '$lib/models/Ticket';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import redis from '$lib/redis';
import { EventRepository } from '$lib/repositories/EventRepository';
import type { NewEvent } from '$lib/models/Event';
import { TicketRepository } from '$lib/repositories/TicketRepository';
import dayjs from 'dayjs';

function getStringField(form: FormData, key: string): string | null {
	const value = form.get(key);
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function parseTickets(json: string): NewTicket[] | null {
	try {
		const parsed = JSON.parse(json);

		if (!Array.isArray(parsed)) return null;

		const tickets: NewTicket[] = [];

		for (const t of parsed) {
			if (
				typeof t.name !== 'string' ||
				typeof t.count === 'undefined' ||
				typeof t.price === 'undefined' ||
				isNaN(Number(t.count)) ||
				isNaN(Number(t.price)) ||
				!t.name.trim() ||
				t.price === 0 ||
				t.count === 0
			) {
				return null;
			}

			tickets.push({
				name: t.name.trim(),
				count: Number(t.count),
				price: Number(t.price)
			});
		}

		return tickets;
	} catch {
		return null;
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.userEmail) {
			return fail(400);
		}

		const form = await request.formData();

		const title = getStringField(form, 'title');
		const description = getStringField(form, 'description');
		const location = getStringField(form, 'location');
		const date = getStringField(form, 'date');
		const time = getStringField(form, 'time');

		if (!title || !description || !location || !date || !time) {
			return fail(400, { invalidInfo: true });
		}

		const rawTicketsJson = form.get('ticketsJson');
		if (typeof rawTicketsJson !== 'string') {
			return fail(400, { invalidTicket: true });
		}

		const tickets = parseTickets(rawTicketsJson);
		if (!tickets || tickets.length === 0) {
			return fail(400, { invalidTicket: true });
		}

		const multi = redis.MULTI();

		const newEvent: NewEvent = {
			title: title,
			description: description,
			datetime: dayjs(`${date}T${time}:00`).toISOString(),
			location: location,
			postedBy: locals.userEmail
		};

		const eventID = EventRepository.createEventMulti(newEvent, multi);
		TicketRepository.createTicketsMulti(eventID, tickets, multi);

		multi.EXEC();

		return { success: true };
	}
};
