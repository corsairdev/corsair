import { asRecord } from 'corsair/core';

/**
 * Reads RepairShopr's collection envelope. Each resource names its own array
 * key (`customers`, `tickets`, `products`), and most carry a `meta` block with
 * `total_pages`.
 *
 * `next_page` is computed from `meta.total_pages` and the page the caller asked
 * for. It is derived here rather than in a zod transform because the docs
 * generator reads a transform's input side and would omit the field.
 */
export function pagedShape(key: string) {
	return (
		// unknown: the response body, which the operation's output schema parses.
		raw: unknown,
		parsed: { page?: number },
	) => {
		// RepairShopr pages from 1, and an omitted page means the first one.
		const requestedPage = parsed.page ?? 1;
		const record = asRecord(raw);
		const meta = asRecord(record?.meta);
		const totalPages =
			typeof meta?.total_pages === 'number' ? meta.total_pages : null;
		return {
			[key]: record?.[key],
			meta,
			// A collection with no meta (products, vendors) cannot be paged, so the
			// next page is only offered when the provider said how many there are.
			next_page:
				totalPages !== null && requestedPage < totalPages
					? requestedPage + 1
					: null,
			total_pages: totalPages,
			total_entries:
				typeof meta?.total_entries === 'number' ? meta.total_entries : null,
		};
	};
}

/**
 * RepairShopr answers a read, a create and an update with the record under its
 * resource name (`{ customer: {...} }`). That envelope is passed through as is;
 * a bare record is wrapped so the operation's output keeps one shape.
 */
export function singleShape(key: string) {
	return (
		// unknown: the response body, which the operation's output schema parses.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		if (record && key in record) return { [key]: record[key] };
		return { [key]: raw };
	};
}

/**
 * RepairShopr answers a delete with the deleted record. The success flag is
 * derived from the call having resolved plus the id the caller sent; the echoed
 * record is not passed on, because the caller already holds the id and its
 * fields are not read anywhere.
 */
export function deletedShape(idField: string) {
	return (
		// unknown: the echoed record is deliberately unused.
		_raw: unknown,
		// unknown: narrowed to the field this shaper reads by the caller.
		parsed: Record<string, unknown>,
	) => ({ success: true, [idField]: parsed[idField] });
}
