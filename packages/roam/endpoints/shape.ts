import { asRecord } from 'corsair/core';

/**
 * Roam answers a list as `{ ok: true, <key>: [...], cursor, hasMore }`, so the
 * array key differs per method. `next_cursor` is copied up beside the provider's
 * own `cursor` so a caller pages with one field; it is derived here rather than
 * in a zod transform because the docs generator reads a transform's input side.
 */
export function listShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		return {
			[key]: record?.[key],
			next_cursor: typeof record?.cursor === 'string' ? record.cursor : null,
			has_more: record?.hasMore === true,
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
