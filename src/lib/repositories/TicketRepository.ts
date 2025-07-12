import type { NewTicket, Ticket } from '$lib/models/Ticket';
import redis from '$lib/redis';
import {
	getRedisReservationKey,
	getRedisTicketHashKey,
	getRedisTicketListKey
} from '$lib/utils/redisKeyUtils';

type RedisMultiClient = ReturnType<typeof redis.multi>;

export class TicketRepository {
	static async createTickets(eventId: string, tickets: NewTicket[]): Promise<void> {
		const listKey = getRedisTicketListKey(eventId);
		for (const ticket of tickets) {
			const hashKey = getRedisTicketHashKey(eventId, ticket.name);
			const hashData = {
				name: ticket.name,
				count: String(ticket.count),
				price: String(ticket.price)
			};
			await redis.HSET(hashKey, hashData);
			await redis.RPUSH(listKey, ticket.name);
		}
	}

	static async getTickets(eventId: string, userEmail: string): Promise<Ticket[]> {
		const listKey = getRedisTicketListKey(eventId);
		const ticketNames = await redis.LRANGE(listKey, 0, -1);
		const tickets: Ticket[] = [];

		for (const name of ticketNames) {
			const hashKey = getRedisTicketHashKey(eventId, name);
			const data = await redis.HGETALL(hashKey);

			if (data?.name && data?.count && data?.price) {
				const totalCount = Number(data.count);
				const price = Number(data.price);

				if (!isNaN(totalCount) && !isNaN(price)) {
					// Get total reserved count for this ticket
					const reservationKey = getRedisReservationKey(eventId, name);
					const reservations = await redis.HGETALL(reservationKey);

					let totalReserved = 0;
					let userReserved = 0;

					// Calculate total reservations and check if user has reserved
					for (const [email, reservedCount] of Object.entries(reservations)) {
						const reserved = Number(reservedCount);
						if (!isNaN(reserved) && reserved > 0) {
							totalReserved += reserved;
							if (userEmail && email === userEmail) {
								userReserved = reserved;
							}
						}
					}

					// Fetch total purchased tickets
					const totalSold = await TicketRepository.getTotalSold(eventId, name);

					const available = totalCount - totalSold - totalReserved + userReserved;

					const isUserBought = await TicketRepository.getPurchasedTicket(eventId, userEmail);

					tickets.push({
						name: data.name,
						count: totalCount,
						price,
						available: Math.max(0, available),
						userBought: isUserBought != null
					});
				}
			}
		}

		return tickets;
	}

	static async getTicketAvailableCount(
		eventId: string,
		name: string,
		userEmail: string
	): Promise<number> {
		let count = 0;

		const hashKey = getRedisTicketHashKey(eventId, name);
		const data = await redis.HGETALL(hashKey);

		if (data?.name && data?.count && data?.price) {
			const totalCount = Number(data.count);
			const price = Number(data.price);

			if (!isNaN(totalCount) && !isNaN(price)) {
				// Get total reserved count for this ticket
				const reservationKey = getRedisReservationKey(eventId, name);
				const reservations = await redis.HGETALL(reservationKey);

				let totalReserved = 0;
				let userReserved = 0;

				// Calculate total reservations and check if user has reserved
				for (const [email, reservedCount] of Object.entries(reservations)) {
					const reserved = Number(reservedCount);
					if (!isNaN(reserved) && reserved > 0) {
						totalReserved += reserved;
						if (userEmail && email === userEmail) {
							userReserved = reserved;
						}
					}
				}

				// Fetch total purchased tickets
				const totalSold = await TicketRepository.getTotalSold(eventId, name);

				count = totalCount - totalSold - totalReserved + userReserved;
			}
		}

		return count;
	}

	static async reserveTickets(
		eventId: string,
		ticketName: string,
		userEmail: string
	): Promise<{ success: boolean; message?: string }> {
		const reservationKey = getRedisReservationKey(eventId, ticketName);
		const hashKey = getRedisTicketHashKey(eventId, ticketName);

		// Get current ticket data
		const ticketData = await redis.HGETALL(hashKey);
		if (!ticketData?.count) {
			return { success: false, message: 'Ticket not found' };
		}

		const totalCount = Number(ticketData.count);
		if (isNaN(totalCount)) {
			return { success: false, message: 'Invalid ticket data' };
		}

		// Get all current reservations
		const reservations = await redis.HGETALL(reservationKey);
		let totalReserved = 0;
		let userCurrentReservation = 0;

		for (const [email, reservedCount] of Object.entries(reservations)) {
			const reserved = Number(reservedCount);
			if (!isNaN(reserved) && reserved > 0) {
				totalReserved += reserved;
				if (email === userEmail) {
					userCurrentReservation = reserved;
				}
			}
		}

		// Check if there are enough tickets available
		// Available = total - reserved + user's current reservation
		const available = totalCount - totalReserved + userCurrentReservation;

		if (1 > available) {
			return {
				success: false,
				message: `Not enough tickets available. Available: ${available}`
			};
		}

		// Set reservation with 15-minute expiration (always reserve 1 ticket)
		await redis.HSET(reservationKey, userEmail, '1');
		await redis.EXPIRE(reservationKey, 15 * 60); // 15 minutes

		return { success: true };
	}

	static async cancelReservation(
		eventId: string,
		ticketName: string,
		userEmail: string
	): Promise<void> {
		const reservationKey = getRedisReservationKey(eventId, ticketName);
		await redis.HDEL(reservationKey, userEmail);
	}

	static async getUserReservations(eventId: string, userEmail: string): Promise<string[]> {
		const listKey = getRedisTicketListKey(eventId);
		const ticketNames = await redis.LRANGE(listKey, 0, -1);
		const userReservations: string[] = [];

		for (const ticketName of ticketNames) {
			const reservationKey = getRedisReservationKey(eventId, ticketName);
			const reservedCount = await redis.HGET(reservationKey, userEmail);

			if (reservedCount) {
				const quantity = Number(reservedCount);
				if (!isNaN(quantity) && quantity > 0) {
					userReservations.push(ticketName);
				}
			}
		}

		return userReservations;
	}

	static async updateCount(eventId: string, ticketName: string, delta: number): Promise<void> {
		const hashKey = getRedisTicketHashKey(eventId, ticketName);
		await redis.HINCRBY(hashKey, 'count', delta);
	}

	static async deleteTickets(eventId: string): Promise<void> {
		const listKey = getRedisTicketListKey(eventId);
		const ticketNames = await redis.LRANGE(listKey, 0, -1);

		const keysToDelete = [
			...ticketNames.map((name) => getRedisTicketHashKey(eventId, name)),
			...ticketNames.map((name) => getRedisReservationKey(eventId, name)),
			listKey
		];

		if (keysToDelete.length > 1) {
			await redis.DEL(keysToDelete);
		}
	}

	static async purchaseTicket(eventId: string, ticketName: string, email: string): Promise<void> {
		const purchaseKey = `purchase:${eventId}:${email}`;

		// Check if user already purchased
		const alreadyBought = await redis.exists(purchaseKey);
		if (alreadyBought) {
			throw new Error('You already purchased a ticket for this event.');
		}

		const available = await TicketRepository.getTicketAvailableCount(eventId, ticketName, email);

		if (available <= 0) {
			throw new Error('No tickets available.');
		}

		// Save purchase and increment sold count
		await redis.set(purchaseKey, ticketName);
		await redis.incr(`sold:${eventId}:${ticketName}`);
	}

	static async getPurchasedTicket(eventId: string, email: string): Promise<string | null> {
		const purchaseKey = `purchase:${eventId}:${email}`;
		return await redis.get(purchaseKey);
	}

	static async getTotalSold(eventId: string, ticketName: string): Promise<number> {
		const count = await redis.get(`sold:${eventId}:${ticketName}`);
		return parseInt(count ?? '0') || 0;
	}

	// Multi methods (for batching operations)
	static createTicketsMulti(eventId: string, tickets: NewTicket[], multi: RedisMultiClient): void {
		const listKey = getRedisTicketListKey(eventId);
		for (const ticket of tickets) {
			const hashKey = getRedisTicketHashKey(eventId, ticket.name);
			const hashData = {
				name: ticket.name,
				count: String(ticket.count),
				price: String(ticket.price)
			};
			multi.HSET(hashKey, hashData);
			multi.RPUSH(listKey, ticket.name);
		}
	}

	static reserveTicketsMulti(
		eventId: string,
		ticketName: string,
		userEmail: string,
		multi: RedisMultiClient
	): void {
		const reservationKey = getRedisReservationKey(eventId, ticketName);
		multi.HSET(reservationKey, userEmail, '1');
		multi.EXPIRE(reservationKey, 15 * 60); // 15 minutes
	}

	static cancelReservationMulti(
		eventId: string,
		ticketName: string,
		userEmail: string,
		multi: RedisMultiClient
	): void {
		const reservationKey = getRedisReservationKey(eventId, ticketName);
		multi.HDEL(reservationKey, userEmail);
	}

	static updateCountMulti(
		eventId: string,
		ticketName: string,
		delta: number,
		multi: RedisMultiClient
	): void {
		const hashKey = getRedisTicketHashKey(eventId, ticketName);
		multi.HINCRBY(hashKey, 'count', delta);
	}

	static async deleteTicketsMulti(eventId: string, multi: RedisMultiClient): Promise<void> {
		const listKey = getRedisTicketListKey(eventId);
		const ticketNames = await redis.LRANGE(listKey, 0, -1);

		const keysToDelete = [
			...ticketNames.map((name) => getRedisTicketHashKey(eventId, name)),
			...ticketNames.map((name) => getRedisReservationKey(eventId, name)),
			listKey
		];

		if (keysToDelete.length > 1) {
			multi.DEL(keysToDelete);
		}
	}
}
