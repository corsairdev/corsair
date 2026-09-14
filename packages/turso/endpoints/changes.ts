import { AuthMissingError, asRecord, logEventFromContext } from 'corsair/core';
import {
	parseSseBuffer,
	TRANSPORT_ERROR_CODE,
	TursoAPIError,
	tursoPipelineHealthCheck,
} from '../client';
import type { TursoEndpoints } from '../index';
import type { ChangeEvent, ListenToChangesResponse } from './types';
import {
	ListenToChangesInputSchema,
	ListenToChangesResponseSchema,
} from './types';

/** Statuses Turso returns when /beta/listen is not offered for a database. */
const LISTEN_UNAVAILABLE_STATUSES = new Set([400, 403, 404, 501]);

/**
 * Decodes one SSE payload into a change event.
 *
 * The payload is provider-shaped, so anything that is not a JSON object is
 * preserved under `data.raw` rather than dropped.
 */
function toChangeEvent(
	table: string,
	action: ChangeEvent['action'],
	payload: string,
): ChangeEvent {
	const receivedAt = new Date().toISOString();
	try {
		// `unknown` because the SSE payload is provider-shaped and unvalidated;
		// asRecord narrows it before it is used.
		const parsed: unknown = JSON.parse(payload);
		const record = asRecord(parsed);
		if (record) {
			return { table, action, receivedAt, data: record };
		}
		return { table, action, receivedAt, data: { raw: parsed } };
	} catch {
		return { table, action, receivedAt, data: { raw: payload } };
	}
}

/**
 * Streams committed table changes from a Turso database.
 *
 * API: GET https://{database}-{org}.turso.io/beta/listen?table=&action=
 * Docs: https://docs.turso.tech/sdk/http/reference
 *
 * Requires the database-specific URL, not the platform API host. The endpoint
 * is a technical preview and is not offered on AWS regions for the Free,
 * Developer and Scaler plans; when it is unavailable this falls back to a
 * POST /v2/pipeline health check so the caller still learns whether the
 * database is reachable.
 *
 * Listening is bounded by `maxEvents` and `timeoutMs` so the call always
 * terminates.
 *
 * @param ctx - Corsair plugin context carrying the resolved API token.
 * @param rawInput - Database URL, table, action and the stop conditions.
 * @returns Collected change events, or the health-check fallback result.
 */
export const listen: TursoEndpoints['listenToChanges'] = async (
	ctx,
	rawInput,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('turso', 'api_key');
	}

	const input = ListenToChangesInputSchema.parse(rawInput);
	const base = input.databaseUrl.replace(/\/$/, '');

	// The database host takes a database auth token, not the platform API token.
	// Fall back to ctx.key so a single-credential setup still works.
	const databaseToken =
		ctx.options?.databaseToken ??
		(await ctx.keys?.get_database_token?.().catch(() => undefined)) ??
		ctx.key;

	const url = new URL(`${base}/beta/listen`);
	url.searchParams.set('table', input.table);
	url.searchParams.set('action', input.action);

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), input.timeoutMs);

	/** Builds the documented fallback result. */
	const fallback = async (
		reason: string,
	): Promise<ListenToChangesResponse> => ({
		mode: 'health_check',
		table: input.table,
		action: input.action,
		listenAvailable: false,
		reason,
		databaseReachable: await tursoPipelineHealthCheck(base, databaseToken),
	});

	let result: ListenToChangesResponse;
	try {
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${databaseToken}`,
				Accept: 'text/event-stream',
			},
			redirect: 'error',
			signal: controller.signal,
		});

		if (!response.ok) {
			if (LISTEN_UNAVAILABLE_STATUSES.has(response.status)) {
				result = await fallback(
					`/beta/listen unavailable (HTTP ${response.status})`,
				);
			} else {
				throw new TursoAPIError(
					`Turso listen request failed with status ${response.status}`,
					undefined,
					response.status,
				);
			}
		} else if (!response.body) {
			result = await fallback('/beta/listen returned no stream body');
		} else {
			const events: ChangeEvent[] = [];
			let stoppedBy: 'max_events' | 'timeout' | 'stream_closed' =
				'stream_closed';
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			try {
				while (events.length < input.maxEvents) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const { events: frames, rest } = parseSseBuffer(buffer);
					buffer = rest;

					for (const frame of frames) {
						events.push(toChangeEvent(input.table, input.action, frame.data));
						if (events.length >= input.maxEvents) break;
					}
				}
				if (events.length >= input.maxEvents) stoppedBy = 'max_events';
			} catch (err) {
				// An abort here is the timeout firing, which is a normal stop.
				if (!(err instanceof Error && err.name === 'AbortError')) throw err;
				stoppedBy = 'timeout';
			} finally {
				await reader.cancel().catch(() => undefined);
			}

			result = {
				mode: 'stream',
				table: input.table,
				action: input.action,
				events,
				stoppedBy,
			};
		}
	} catch (err) {
		if (err instanceof Error && err.name === 'AbortError') {
			result = {
				mode: 'stream',
				table: input.table,
				action: input.action,
				events: [],
				stoppedBy: 'timeout',
			};
		} else if (err instanceof TursoAPIError) {
			throw err;
		} else {
			const detail = err instanceof Error ? `: ${err.message}` : '';
			throw new TursoAPIError(
				`Failed to reach Turso listen stream${detail}`,
				TRANSPORT_ERROR_CODE,
			);
		}
	} finally {
		clearTimeout(timer);
	}

	const parsed = ListenToChangesResponseSchema.parse(result);

	if (parsed.mode === 'stream' && ctx.db?.changeEvents) {
		for (const [index, event] of parsed.events.entries()) {
			// receivedAt is only millisecond-precise, so frames decoded in the
			// same tick would collide. Prefer a provider row id when the payload
			// carries one, and fall back to the position within this batch.
			const rowId = event.data?.id;
			const suffix =
				typeof rowId === 'string' || typeof rowId === 'number'
					? String(rowId)
					: `${event.receivedAt}:${index}`;
			try {
				await ctx.db.changeEvents.upsertByEntityId(
					`${base}:${event.table}:${event.action}:${suffix}`,
					{
						databaseUrl: base,
						table: event.table,
						action: event.action,
						receivedAt: event.receivedAt,
						data: event.data ?? null,
					},
				);
			} catch (error) {
				console.warn('Failed to save Turso change event to database:', error);
			}
		}
	}

	// Event payloads can carry row data, so only the routing fields are logged.
	await logEventFromContext(
		ctx,
		'turso.changes.listen',
		{
			table: input.table,
			action: input.action,
			mode: parsed.mode,
			eventCount: parsed.mode === 'stream' ? parsed.events.length : 0,
		},
		'completed',
	);

	return parsed;
};
