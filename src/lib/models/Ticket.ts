export interface Ticket {
	name: string;
	count: number;
	price: number;
	available: number;
	userBought: boolean;
}

export type NewTicket = Omit<Ticket, 'available' | 'userReserved'>;

export interface RedisTicketHash {
	name: string;
	count: string;
	price: string;
}
