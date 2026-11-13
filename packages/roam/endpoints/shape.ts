import { asRecord } from 'corsair/core';

/**
 * Roam answers a list as `{ ok: true, <key>: [...], nextCursor }`, so the array
 * key differs per method and the next page's cursor is `nextCursor`, absent on
 * the last page. It is copied out as `next_cursor`, and `has_more` is derived
 * from it; both are set here rather than in a zod transform because the docs
 * generator reads a transform's input side.
 */
export function listShape(key: string) {
	return (
		// unknown: the response body has not passed the output schema yet; that
		// schema validates what this returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const nextCursor =
			typeof record?.nextCursor === 'string' && record.nextCursor.length > 0
				? record.nextCursor
				: null;
		return {
			[key]: record?.[key],
			// `expand: ['addresses']` adds this map beside the list; the output
			// schemas that declare it keep it and the others drop it.
			...(record?.addresses !== undefined
				? { addresses: record.addresses }
				: {}),
			next_cursor: nextCursor,
			has_more: nextCursor !== null,
		};
	};
}

/**
 * Roam answers a single object at the top level of the envelope, not under
 * `data`, so the whole record is the value. `ok` is dropped: the call resolving
 * is what proves success, and a `false` here would be a body this shaper should
 * not be looking at.
 */
export function envelopeShape(key: string) {
	return (
		// unknown: the response body has not passed the output schema yet; that
		// schema validates what this returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		if (!record) return { [key]: raw };
		const { ok: _ok, ...rest } = record;
		return { [key]: rest };
	};
}
