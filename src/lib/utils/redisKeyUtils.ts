export function getRedisUserKey(email: string): string {
	return `user:${email}`;
}

export function getRedisUserSessionKey(sessionID: string): string {
	return `session:${sessionID}`;
}

export function getRedisEventKey(eventID: string): string {
	return `event:${eventID}`;
}

export function getRedisTicketListKey(eventId: string): string {
	return `tickets:${eventId}`;
}

export function getRedisTicketHashKey(eventId: string, ticketName: string): string {
	return `ticket:${eventId}:${ticketName}`;
}

export function getRedisReservationKey(eventId: string, ticketName: string): string {
	return `reservation:${eventId}:${ticketName}`;
}
