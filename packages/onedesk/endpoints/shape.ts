import { asRecord } from 'corsair/core';
import { OnedeskAPIError } from '../client';
import { nextOffsetFor } from './types';

/**
 * Adds the derived `nextOffset` to a paged response. OneDesk sends `totalNum`
 * and the page it just returned, so the next offset is arithmetic; `null`
 * means this page was the last one.
 */
// unknown: the transport returns an untyped body; the endpoint's output schema
// validates it once shaped.
export function withNextOffset(
	raw: unknown,
	offset: number | undefined,
	key = 'data',
): unknown {
	const record = asRecord(raw);
	if (!record) {
		throw new OnedeskAPIError('Expected an object in the OneDesk response.');
	}
	const items = record[key];
	if (items !== undefined && !Array.isArray(items)) {
		throw new OnedeskAPIError(
			`Expected ${key} to be an array in the OneDesk response.`,
		);
	}
	// unknown: totalNum is the provider's own count field, untyped until here.
	const total = record.totalNum;
	const totalCount = typeof total === 'number' ? total : null;
	// A missing list with records still to come is a broken page, not an empty
	// one: returning `[]` would look like the end of the data. At or past the
	// end (offset >= totalNum) there is nothing to return, so it is empty.
	if (
		items === undefined &&
		totalCount !== null &&
		totalCount > (offset ?? 0)
	) {
		throw new OnedeskAPIError(
			`The OneDesk response has no ${key} array but reports ${totalCount} rows.`,
		);
	}
	const returned = Array.isArray(items) ? items.length : 0;
	return {
		...record,
		data: items ?? [],
		nextOffset: nextOffsetFor(returned, totalCount, offset ?? 0),
	};
}

/**
 * Normalises an update response. OneDesk answers a bare code string on some
 * resources and an empty 200 on others, so both become `{ code }` for the
 * shared output schema. A structured body without a `code` is neither: it is
 * a shape this plugin does not understand, so it fails rather than reporting
 * a success that was never confirmed.
 */
// unknown: the transport returns an untyped body.
export function updateCode(raw: unknown): { code: string } {
	if (typeof raw === 'string' && raw.length > 0) return { code: raw };
	if (raw === undefined || raw === null || raw === '') {
		return { code: 'SUCCESS' };
	}
	const record = asRecord(raw);
	const code = record?.code;
	if (typeof code === 'string' && code.length > 0) return { code };
	// An empty object carries nothing, so it is the same as an empty body.
	// Anything with content but no code cannot be read as a success.
	if (record && Object.keys(record).length === 0) return { code: 'SUCCESS' };
	throw new OnedeskAPIError(
		'The OneDesk update response carried data but no code, so it cannot be read as a success.',
	);
}

/** Reads the created record's external id from a create envelope. */
// unknown: the transport returns an untyped body.
export function createdExternalId(raw: unknown): string | undefined {
	const data = asRecord(raw)?.data;
	return typeof data === 'string' ? data : undefined;
}
