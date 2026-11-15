import { asRecord } from 'corsair/core';

/**
 * Reads v5's `{ data, links, meta }` page into the operation's field plus the
 * paging helpers. `data` is required on a 200, so it is passed through unset
 * rather than defaulted to `[]`: a body missing it fails the output parse
 * instead of looking like an empty page.
 */
export function pagedShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const meta = asRecord(record?.meta);
		const current = meta?.current_page;
		const last = meta?.last_page;
		const hasNext =
			typeof current === 'number' && typeof last === 'number'
				? current < last
				: null;
		return {
			[key]: record?.data,
			current_page: current,
			last_page: last,
			total: meta?.total,
			next_page:
				hasNext === true && typeof current === 'number'
					? current + 1
					: hasNext === null
						? null
						: null,
		};
	};
}

/**
 * Wraps a single-object answer under the operation's field, so a read and a
 * list return the same top-level shape.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: raw });
}

/**
 * This host answers a list as a bare JSON array, not an envelope, so the array
 * is the whole body. A non-array fails the output parse rather than becoming an
 * empty list.
 */
export function bareArrayShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: raw });
}
