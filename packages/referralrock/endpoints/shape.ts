import { asRecord } from 'corsair/core';

/**
 * Referral Rock answers a collection as `{ offset, total, message, <key>: [] }`.
 * The array key differs per resource, so it is passed in.
 *
 * `next_offset` is derived from `offset` plus the rows returned, and is null once
 * they have reached `total`. It is derived here rather than in a zod transform
 * because the docs generator reads a transform's input side and would omit it.
 */
export function setShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const rows = record?.[key];
		const offset = record?.offset;
		const total = record?.total;
		const returned = Array.isArray(rows) ? rows.length : 0;
		const hasNext =
			typeof offset === 'number' &&
			typeof total === 'number' &&
			returned > 0 &&
			offset + returned < total;
		return {
			[key]: rows,
			offset: typeof offset === 'number' ? offset : null,
			total: typeof total === 'number' ? total : null,
			next_offset: hasNext ? (offset as number) + returned : null,
			message: record?.message,
		};
	};
}

/**
 * A single record answer names it beside a `message`, so the named key is
 * lifted and the message kept.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		return {
			[key]: record?.[key],
			message: record?.message,
		};
	};
}
