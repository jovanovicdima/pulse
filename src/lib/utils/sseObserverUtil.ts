const clients = new Set<(event: string, data: string) => void>();

export function addClient(emit: (event: string, data: string) => void) {
	clients.add(emit);
}

export function removeClient(emit: (event: string, data: string) => void) {
	clients.delete(emit);
}

export function broadcast(event: string, data: string) {
	for (const emit of clients) {
		emit(event, data);
	}
}
