import { asRecord } from 'corsair/core';

/**
 * Revolt answers a message list in one of two shapes. With `include_users=true`
 * it is `{ messages: [], users: [], members: [] }`: the messages come back with
 * the users and members they reference, already inline. Without it the route
 * answers a bare array of messages. Both are read so the output is the same
 * object either way.
 */
export function messagesShape() {
	return (
		// unknown: the response body, narrowed here and then parsed by the
		// operation's output schema.
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		if (Array.isArray(raw)) return { messages: raw };
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
		// unknown: the response body; the operation's output schema parses it
		// under `key`.
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
