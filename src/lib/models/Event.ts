export interface Event {
	id: string;
	title: string;
	description: string;
	image?: string;
	location: string;
	datetime: string;
	postedBy: string;
	postedAt: string;
}

export type NewEvent = Omit<Event, 'id' | 'postedAt'>;
