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
	const items = record?.[key];
	if (items !== undefined && !Array.isArray(items)) {
		throw new OnedeskAPIError(
			`Expected ${key} to be an array in the OneDesk response.`,
		);
	}
	const returned = Array.isArray(items) ? items.length : 0;
	// unknown: totalNum is the provider's own count field, untyped until here.
	const total = record?.totalNum;
	return {
		...record,
		data: items ?? [],
		nextOffset: nextOffsetFor(
			returned,
			typeof total === 'number' ? total : null,
			offset ?? 0,
		),
	};
}

/**
 * Normalises an update response. OneDesk answers a bare code string on some
 * resources and an empty body on others, so both become `{ code: 'SUCCESS' }`
 * for the shared output schema.
 */
// unknown: the transport returns an untyped body.
export function updateCode(raw: unknown): { code: string } {
	if (typeof raw === 'string') return { code: raw };
	const record = asRecord(raw);
	if (typeof record?.code === 'string') return { code: record.code };
	// An empty 200 is a success: the client has already thrown on any error
	// code it could read.
	return { code: 'SUCCESS' };
}

/** Reads the created record's external id from a create envelope. */
// unknown: the transport returns an untyped body.
export function createdExternalId(raw: unknown): string | undefined {
	const data = asRecord(raw)?.data;
	return typeof data === 'string' ? data : undefined;
}
