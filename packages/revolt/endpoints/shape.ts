import { asRecord } from 'corsair/core';

/**
 * Revolt answers a message list as `{ messages: [], users: [], members: [] }`:
 * the messages come back with the users and members they reference, already
 * inline. The three arrays are read together so a caller never has to resolve an
 * author id itself.
 */
export function messagesShape() {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		return {
			messages: record?.messages,
			users: record?.users,
			members: record?.members,
		};
	};
}

/** Wraps a single-object answer under the operation's field. */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ [key]: raw });
}

/**
 * Revolt answers a reaction add or a message delete with a `204` and no body, so
 * the success flag is derived from the call having resolved.
 */
export function emptyShape() {
	return (
		// unknown: a bodyless answer has nothing to read.
		_raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => ({ success: true });
}
