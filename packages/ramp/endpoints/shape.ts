import { asRecord } from 'corsair/core';
import { readNextCursor, readNextUrl } from '../client';

/**
 * Reads Ramp's `{ data, page }` envelope into the operation's field plus the
 * paging helpers. `data` is required on a 200 response, so it is passed through
 * unset rather than defaulted to `[]`: a body without it then fails the output
 * parse instead of looking like an empty page.
 *
 * `next_cursor` and `next_page_url` are derived here rather than in a zod
 * transform, because the docs generator reads a transform's input side and the
 * field would be missing from the API reference.
 */
export function pagedShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const page = record?.page;
		const pageRecord = asRecord(page);
		return {
			[key]: record?.data,
			page,
			next: readNextUrl(page),
			next_cursor: readNextCursor(page),
			next_page_url: readNextUrl(page),
			total_count: pageRecord?.total_count,
			total_count_capped: pageRecord?.total_count_capped,
		};
	};
}

/**
 * Wraps a single-object response under the operation's field name, so a read
 * and a list return the same top-level shape.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: raw });
}
