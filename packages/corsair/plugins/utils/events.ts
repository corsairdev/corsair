import { generateUUID } from '../../core/utils';
import { loadAccountDek, sealJson } from '../../db/data-at-rest';
import type { CorsairDatabase } from '../../db/kysely/database';

/**
 * Context interface with account ID resolver for logging events.
 */
export interface EventLoggingContext {
	database?: CorsairDatabase | undefined;
	$getAccountId: () => Promise<string>;
	/** When true, `logEventFromContext` seals the payload with the account DEK. */
	encryptDataAtRest?: boolean;
	kek?: string;
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
	database: CorsairDatabase | undefined,
	accountId: string,
	eventType: string,
	payload: Record<string, unknown>,
	status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending',
	kek?: string,
): Promise<string | null> {
	if (!database) {
		return null;
	}
	try {
		const eventId = generateUUID();
		const now = new Date();
		const stored = kek
			? sealJson(payload, await loadAccountDek(database.db, accountId, kek))
			: payload;
		await database.db
			.insertInto('corsair_events')
			.values({
				id: eventId,
				created_at: now,
				updated_at: now,
				account_id: accountId,
				event_type: eventType,
				payload: stored,
				status,
			})
			.execute();
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
		if (ctx.encryptDataAtRest && !ctx.kek) {
			throw new Error('encryptDataAtRest requires kek');
		}
		return logEvent(
			ctx.database,
			accountId,
			eventType,
			payload,
			status,
			ctx.encryptDataAtRest ? ctx.kek : undefined,
		);
	} catch (error) {
		console.warn('Failed to log event:', error);
		return null;
	}
}
