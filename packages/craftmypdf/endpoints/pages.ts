import { asRecord } from 'corsair/core';
import { CraftmypdfAPIError } from '../client';

/**
 * Reads a list field from a CraftMyPDF response. A missing field is an empty
 * page; a field of the wrong shape throws rather than becoming a blank row,
 * because a page of empty records looks like data.
 */
// unknown: the transport returns an untyped body; the endpoint's output
// schema is what actually validates it.
export function readList(raw: unknown, key: string): unknown[] {
	const items = asRecord(raw)?.[key];
	if (items === undefined) return [];
	if (!Array.isArray(items)) {
		throw new CraftmypdfAPIError(
			`Expected ${key} to be an array in the CraftMyPDF response.`,
		);
	}
	return items;
}

/**
 * CraftMyPDF reports no total and no cursor, so the only signal that another
 * page exists is a full page: a short page is the end.
 */
export function nextOffsetFor(
	returned: number,
	limit: number,
	offset: number,
): number | undefined {
	return returned === limit ? offset + returned : undefined;
}
