import type { Event } from '$lib/models/Event.js';
import neo from '$lib/neo4j.js';
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

	const session = neo.session();
	let recommendedEvents: Event[] = [];

	try {
		const result = await session.run(
			`
			MATCH (targetUser:User {email: $email})-[:PURCHASED]->(event:Event)
			MATCH (otherUser:User)-[:PURCHASED]->(event)
			WHERE otherUser <> targetUser
			MATCH (otherUser)-[:PURCHASED]->(recommended:Event)
			WHERE NOT (targetUser)-[:PURCHASED]->(recommended)
			OPTIONAL MATCH (recommended)-[r:CREATED_BY]->(creator:User)
			RETURN recommended, r.datetime AS datetime, creator.email AS postedBy, COUNT(*) AS score
			ORDER BY score DESC
			LIMIT 3
		`,
			{ email: locals.userEmail }
		);

		recommendedEvents = result.records.map((record) => {
			const eventNode = record.get('recommended');
			return {
				...eventNode.properties,
				datetime: record.get('datetime'),
				postedBy: record.get('postedBy')
			};
		});

		recommendedEvents = recommendedEvents.filter((item) => item.id != event.id);
	} catch (err) {
		console.error(err);
	} finally {
		await session.close();
	}

	return {
		event: event!,
		tickets: tickets!,
		recommendedEvents: recommendedEvents
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
