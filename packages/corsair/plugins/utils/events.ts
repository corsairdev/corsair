import type { CorsairDbAdapter } from '../../adapters';
import { generateUuidV4 } from '../../core/utils';

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
