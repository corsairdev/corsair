import { asRecord } from 'corsair/core';

/**
 * Reads Raisely's `{ data, pagination }` envelope into the operation's field
 * plus the paging helpers. `data` is required on a 200, so it passes through
 * unset rather than defaulting to `[]`: a body missing it fails the output
 * parse instead of looking like an empty page.
 *
 * `next_offset` and `total` are copied up beside the provider's own `pagination`
 * object so a caller pages with one field. They are derived here rather than in
 * a zod transform because the docs generator reads a transform's input side and
 * would omit them from the reference.
 */
export function pagedShape(key: string) {
	return (
		// unknown: untrusted provider JSON; the operation's output schema checks
		// whatever this shaper returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const pagination = asRecord(record?.pagination);
		const offset = pagination?.offset;
		const limit = pagination?.limit;
		const total = pagination?.total;
		const hasNext =
			typeof offset === 'number' && typeof total === 'number'
				? offset + (typeof limit === 'number' ? limit : 0) < total
				: // A response without a pagination block is a single page.
					false;
		return {
			[key]: record?.data,
			pagination,
			next_offset:
				hasNext && typeof offset === 'number'
					? offset + (limit as number)
					: null,
			total: typeof total === 'number' ? total : null,
		};
	};
}

/**
 * Wraps a single-object answer under the operation's field. Raisely answers a
 * read as `{ data: {...} }`, so `data` is the record.
 */
export function singleShape(key: string) {
	return (
		// unknown: untrusted provider JSON; the operation's output schema checks
		// whatever this shaper returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: asRecord(raw)?.data });
}
