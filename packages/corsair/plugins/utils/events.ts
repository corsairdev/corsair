import { createCorsairOrm } from '../../orm';

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
	database: any,
	eventType: string,
	payload: Record<string, unknown>,
	tenantId: string = 'default',
): Promise<string | null> {
	if (!database) return null;
	try {
		const orm = createCorsairOrm(database);
		const eventId = generateUuidV4();
		await orm.events.create({
			id: eventId,
			tenant_id: tenantId,
			event_type: eventType,
			payload,
			status: 'pending',
			retry_count: 0,
		});
		return eventId;
	} catch (error) {
		console.warn('Failed to log event:', error);
		return null;
	}
}

export async function updateEventStatus(
	database: any,
	eventId: string | null,
	status: 'pending' | 'processing' | 'completed' | 'failed',
): Promise<void> {
	if (!database || !eventId) return;
	try {
		const orm = createCorsairOrm(database);
		await orm.events.updateStatus(eventId, status);
	} catch (error) {
		console.warn('Failed to update event status:', error);
	}
}

