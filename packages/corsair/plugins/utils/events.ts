import type { CorsairDbAdapter } from '../../adapters';

function generateUuidV4(): string {
	const cryptoAny = globalThis.crypto as unknown as
		| { randomUUID?: () => string }
		| undefined;
	if (cryptoAny?.randomUUID) {
		return cryptoAny.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export async function logEvent(
	database: CorsairDbAdapter,
	eventType: string,
	payload: Record<string, unknown>,
	status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending',
	tenantId: string = 'default',
): Promise<string | null> {
	try {
		const eventId = generateUuidV4();
		await database.insert({
			table: 'corsair_events',
			data: {
				id: eventId,
				tenant_id: tenantId,
				event_type: eventType,
				payload,
				status,
			},
		});
		return eventId;
	} catch (error) {
		console.warn('Failed to log event:', error);
		return null;
	}
}
