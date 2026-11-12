import { asRecord } from 'corsair/core';

/**
 * Recruitee pages its collections by `page` (1-based) and `limit`. The offers
 * and locations routes answer `{ <key>: [], meta: { limit, page, total_count } }`;
 * the candidate search answers `{ hits: [], total }`. `next_page` is derived from
 * the total when the route sends one, otherwise from whether a full page came
 * back.
 *
 * It is derived here rather than in a zod transform because the docs generator
 * reads a transform's input side and would omit it.
 */
export function pagedShape(key: string, rowsKey = key) {
	return (
		// unknown: the provider's JSON body; the operation's output schema
		// validates whatever this returns.
		raw: unknown,
		parsed: { page?: number; limit?: number },
	) => {
		const record = asRecord(raw);
		const rows = record?.[rowsKey];
		const returned = Array.isArray(rows) ? rows.length : 0;
		const meta = asRecord(record?.meta);
		const page = parsed.page ?? 1;
		const total =
			typeof meta?.total_count === 'number'
				? meta.total_count
				: typeof record?.total === 'number'
					? record.total
					: undefined;
		// The search sends no `meta.limit`; with no limit from the caller either,
		// the page that came back is Recruitee's default size.
		const limit =
			parsed.limit ??
			(typeof meta?.limit === 'number' ? meta.limit : undefined) ??
			returned;
		let hasNext = false;
		if (returned > 0 && total !== undefined) {
			hasNext = page * limit < total;
		} else if (returned > 0) {
			hasNext = returned >= limit;
		}
		return {
			[key]: rows,
			total: total ?? null,
			next_page: hasNext ? page + 1 : null,
		};
	};
}

/** Wraps a single-object answer under the operation's field. */
export function singleShape(key: string) {
	return (
		// unknown: the provider's JSON body; the operation's output schema
		// validates the field read from it.
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
