export interface Ticket {
	name: string;
	count: number;
	price: number;
	available: number;
	userReserved: boolean;
}

export type NewTicket = Omit<Ticket, 'available' | 'userReserved'>;

export interface RedisTicketHash {
	name: string;
	count: string;
	price: string;
}
