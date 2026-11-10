import { asRecord } from 'corsair/core';

/**
 * Recruitee answers a collection as `{ <key>: [] }` with the rows at the top
 * level; some routes also carry `meta`. Paging is `limit`/`offset`, so
 * `next_offset` is derived from the rows returned and the caller's offset.
 *
 * It is derived here rather than in a zod transform because the docs generator
 * reads a transform's input side and would omit it.
 */
export function listShape(key: string) {
	return (
		raw: unknown,
		// unknown: the parsed input, narrowed to the offset this shaper reads.
		parsed: { offset?: number; limit?: number },
	) => {
		const record = asRecord(raw);
		const rows = record?.[key];
		const returned = Array.isArray(rows) ? rows.length : 0;
		const offset = parsed.offset ?? 0;
		const limit = parsed.limit;
		const meta = asRecord(record?.meta);
		// A full page may have more behind it; a short one is the last.
		const hasNext =
			limit !== undefined &&
			returned >= limit &&
			(meta?.total === undefined ||
				typeof meta.total !== 'number' ||
				offset + returned < meta.total);
		return {
			[key]: rows,
			meta,
			next_offset: hasNext ? offset + returned : null,
		};
	};
}

/** Wraps a single-object answer under the operation's field. */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: asRecord(raw)?.[key] });
}

/**
 * Recruitee answers a delete with the deleted record or a bare `200`, so the
 * success flag is derived from the call resolving plus the id sent.
 */
export function deletedShape(idField: string) {
	return (
		// unknown: the bodyless answer has nothing else to read.
		_raw: unknown,
		// unknown: narrowed to the field this shaper reads by the caller.
		parsed: Record<string, unknown>,
	) => ({ success: true, [idField]: parsed[idField] });
}
