import type { CorsairDbAdapter } from '../../adapters';
import { generateUuidV4 } from '../../core/utils';

/**
 * Context interface with account ID resolver for logging events.
 */
export interface EventLoggingContext {
	database: CorsairDbAdapter;
	$getAccountId: () => Promise<string>;
}

/**
 * Logs an event to the corsair_events table.
 *
 * @param database - The database adapter
 * @param accountId - The account ID this event belongs to
 * @param eventType - The type of event (e.g., 'slack.message.created')
 * @param payload - The event payload data
 * @param status - The event status (defaults to 'pending')
 * @returns The event ID if successful, null if failed
 */
export async function logEvent(
	database: CorsairDbAdapter,
	accountId: string,
	eventType: string,
	payload: Record<string, unknown>,
	status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending',
): Promise<string | null> {
	try {
		const eventId = generateUuidV4();
		const now = new Date();
		await database.insert({
			table: 'corsair_events',
			data: {
				id: eventId,
				created_at: now,
				updated_at: now,
				account_id: accountId,
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

/**
 * Logs an event from a plugin context, automatically resolving the account ID.
 * This is a convenience wrapper around `logEvent` for use in plugin endpoints.
 *
 * @param ctx - The plugin context with database and account ID resolver
 * @param eventType - The type of event (e.g., 'slack.message.created')
 * @param payload - The event payload data
 * @param status - The event status (defaults to 'pending')
 * @returns The event ID if successful, null if failed
 */
export async function logEventFromContext(
	ctx: EventLoggingContext,
	eventType: string,
	payload: Record<string, unknown>,
	status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending',
): Promise<string | null> {
	try {
		const accountId = await ctx.$getAccountId();
		return logEvent(ctx.database, accountId, eventType, payload, status);
	} catch (error) {
		console.warn('Failed to log event:', error);
		return null;
	}
}
