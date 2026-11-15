import { asRecord } from 'corsair/core';
import { readNextCursor, readNextPageUrl } from '../client';

/**
 * Reads Rentman's `{ data, itemCount, limit, next_page_url }` envelope into the
 * operation's field plus the paging helpers. `data` is required on a 200, so it
 * passes through unset rather than defaulting to `[]`: a body missing it fails
 * the output parse instead of looking like an empty page.
 */
export function pagedShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		return {
			[key]: record?.data,
			next_cursor: readNextCursor(record),
			next_page_url: readNextPageUrl(record),
			item_count: record?.itemCount ?? 0,
			limit: record?.limit,
		};
	};
}

/**
 * Wraps a single-object answer under the operation's field. A read answered a
 * bare `{ data: {...} }` object rather than an array, so `data` is the record.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: asRecord(raw)?.data });
}

/**
 * A delete answers with no body, so the success flag is derived from the call
 * having resolved plus the id the caller sent.
 */
export function deletedShape(idField: string) {
	return (
		// unknown: a bodyless delete has nothing to read.
		_raw: unknown,
		// unknown: narrowed to the field this shaper reads by the caller.
		parsed: Record<string, unknown>,
	) => ({ success: true, [idField]: parsed[idField] });
}
