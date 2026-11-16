import type { MailssoContext } from './index';

export const API_KEY = 'mails-secret-test-key';

/** Any JSON value, so a test body needs no loose type. */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export function jsonResponse(
	body: JsonValue,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

/** What a rejected promise carries. */
export type Caught = unknown; // unknown: a promise can reject with any value, so each caller narrows it to the fields it asserts on.

export async function captureError<T>(promise: Promise<T>): Promise<Caught> {
	return promise.then(
		() => undefined,
		(caught: Caught) => caught,
	);
}

/**
 * A context with the two members the endpoints read: `key`, and
 * `$getAccountId` for the event log (the log writer tolerates a missing
 * database). retry.test.ts runs the same endpoints through createCorsair.
 */
export function makeContext(key = API_KEY): MailssoContext {
	const ctx = {
		key,
		$getAccountId: jest.fn(async () => 'account-1'),
	};
	return ctx as unknown as MailssoContext; // unknown: only `key` and `$getAccountId` are read; the rest of the context is never touched by these endpoints.
}
