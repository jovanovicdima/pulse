export function getRedisUserKey(email: string): string {
	return `user:${email}`;
}

export function getRedisUserSessionKey(sessionID: string): string {
	return `session:${sessionID}`;
}
