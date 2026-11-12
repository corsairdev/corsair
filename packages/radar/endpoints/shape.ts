import { asRecord } from 'corsair/core';

/**
 * Reads Radar's `{ meta, <key>: [...] }` envelope into the operation's field
 * plus the paging flag. The array key differs per resource, and `meta.hasMore`
 * is the only cursor Radar offers on the list routes, so it is copied up.
 *
 * `data` is required on a 200, so it passes through unset rather than
 * defaulting to `[]`: a body missing it fails the output parse instead of
 * looking like an empty page.
 */
export function listShape(key: string) {
	return (
		// unknown: the unchecked Radar response body; the operation's output
		// schema parses what this returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const meta = asRecord(record?.meta);
		return {
			[key]: record?.[key],
			has_more: meta?.hasMore === true,
			// Radar pages by the `updatedBefore`/`createdBefore` cursor on the
			// last record, which the caller reads from the row itself.
			meta,
		};
	};
}

/**
 * Reads a single-object answer. Radar names the record beside `meta` — `user`,
 * `geofence`, `trip` or `event` — so the named key is lifted. A missing key fails output validation.
 */
export function singleShape(key: string) {
	return (
		// unknown: the unchecked Radar response body; the operation's output
		// schema parses what this returns.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		if (!record) return { [key]: raw };
		if (record[key] !== undefined) return { [key]: record[key] };
		// Named single-record routes must contain that record. A meta-only
		// response must fail output validation rather than become an empty row.
		return { [key]: undefined };
	};
}

/**
 * Radar answers a delete with `{ meta: { code: 200 } }` and no record, so the
 * success flag is derived from the call having resolved plus the id sent.
 */
export function deletedShape(idField: string) {
	return (
		// unknown: the bodyless answer has nothing else to read.
		_raw: unknown,
		// unknown: narrowed to the field this shaper reads by the caller.
		parsed: Record<string, unknown>,
	) => ({ success: true, [idField]: parsed[idField] });
}
