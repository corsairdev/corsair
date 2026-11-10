import { asRecord } from 'corsair/core';

/**
 * Reads Rocketlane's `{ data, pagination }` page. `data` is required on a 200,
 * so it passes through unset rather than defaulting to `[]`: a body missing it
 * fails the output parse instead of looking like an empty page.
 *
 * `next_page_token` is copied up beside the provider's own `pagination` object
 * so a caller pages with one field. It is derived here rather than in a zod
 * transform because the docs generator reads a transform's input side and would
 * omit it from the reference.
 */
export function pagedShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const pagination = asRecord(record?.pagination);
		return {
			[key]: record?.data,
			pagination,
			next_page_token:
				typeof pagination?.nextPageToken === 'string'
					? pagination.nextPageToken
					: null,
			has_more: pagination?.hasMore === true,
			total_record_count:
				typeof pagination?.totalRecordCount === 'number'
					? pagination.totalRecordCount
					: null,
		};
	};
}

/**
 * Wraps a single-object answer under the operation's field so a read and a list
 * return the same top-level shape.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: raw });
}

/**
 * A delete answers `204` with no body. The success flag is derived from the
 * fact that the call resolved, plus the id the caller sent, so the output is
 * never a guess about what the provider returned.
 */
export function deletedShape(idField: string) {
	return (
		// unknown: a 204 has no body; the value is unused by design.
		_raw: unknown,
		// unknown: narrowed to the field this shaper reads by the caller.
		parsed: Record<string, unknown>,
	) => ({ success: true, [idField]: parsed[idField] });
}
