import { asRecord } from 'corsair/core';

/**
 * Reads Rollbar's `{ err, result }` envelope. `result` is an object for a single
 * record and a page object for a list, so the caller names the array key and the
 * paging fields are lifted beside it.
 */
export function listShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const result = asRecord(asRecord(raw)?.result);
		return {
			[key]: result?.[key],
			page: typeof result?.page === 'number' ? result.page : null,
			total_count:
				typeof result?.total_count === 'number' ? result.total_count : null,
		};
	};
}

/** Wraps a single record, which Rollbar returns as `result`. */
export function resultShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: asRecord(raw)?.result });
}
