import { asRecord } from 'corsair/core';
import type { TicketmasterQuery } from '../client';
import type { TicketmasterPage } from './types';

/**
 * Builds the query string from an input.
 *
 * unknown: the input is one of the ten endpoint inputs, each with its own shape
 * and its own subset of Ticketmaster's ~40 query parameters. A union of the ten
 * would not help here — the helper's job is to copy whatever key the operation
 * declares, and a generic over the input's keys would only re-derive that. The
 * value type is not open: anything that is not a string, number, boolean or
 * array of them is dropped, so no caller can smuggle an object into the query.
 *
 * Arrays stay arrays: the shared HTTP client sends them as repeated parameters,
 * which is what Ticketmaster expects for its list filters, and `undefined` keys
 * are dropped there too.
 */
export function searchQuery(input: Record<string, unknown>): TicketmasterQuery {
	const query: TicketmasterQuery = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			query[key] = value.map(String);
			continue;
		}
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = value;
		}
	}
	return query;
}

/** Reads the `page` block of a HAL search envelope, if it is there. */
export function readPage(raw: unknown): TicketmasterPage | undefined {
	const page = asRecord(asRecord(raw)?.page);
	return page ? (page as TicketmasterPage) : undefined;
}

/**
 * Reads `_embedded.<collection>` from a HAL search envelope.
 *
 * Ticketmaster omits `_embedded` entirely when a page has no results, including
 * the last page of a set whose `page.totalPages` counts one too many. The
 * official JavaScript SDK hit exactly that (sdk-javascript issue #25: a 200 with
 * no `_embedded` key), so a missing block is an empty list, not a parse failure.
 */
export function readEmbedded(raw: unknown, collection: string): unknown[] {
	const embedded = asRecord(asRecord(raw)?._embedded)?.[collection];
	return Array.isArray(embedded) ? embedded : [];
}
