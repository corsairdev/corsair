import { asRecord } from 'corsair/core';

/**
 * RedCircle answers `type=…` requests with the results at the top level under a
 * name of their own (`search_results`, `product`, `reviews`, `category`), beside
 * `request_info`, `request_metadata` and `pagination`.
 *
 * `next_page` is derived from `pagination.next.page`, so a caller pages with one
 * field. It is derived here rather than in a zod transform because the docs
 * generator reads a transform's input side and would omit it.
 */
export function envelopeShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const pagination = asRecord(record?.pagination);
		const next = asRecord(pagination?.next);
		const current = asRecord(pagination?.current);
		return {
			[key]: record?.[key],
			request_info: asRecord(record?.request_info),
			request_metadata: asRecord(record?.request_metadata),
			next_page: typeof next?.page === 'number' ? next.page : null,
			current_page: typeof current?.page === 'number' ? current.page : null,
			total_pages:
				typeof pagination?.total_pages === 'number'
					? pagination.total_pages
					: null,
			total_results:
				typeof pagination?.total_results === 'number'
					? pagination.total_results
					: null,
		};
	};
}
