/**
 * Test helpers that need a loose type in exactly one place, each with the
 * explanation the repository rule requires.
 */

/**
 * A JSON response mock. `body` is unknown because every fixture is a plain
 * object of arbitrary shape; typing it per call site would mean a generic
 * parameter at eight call sites for no assertion benefit, since each fixture is
 * already validated by the output schema under test.
 */
export function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

/**
 * Resolves a rejection to the value thrown. Tests take the error as its real
 * type through the generic argument, so the `unknown` stays here once instead
 * of at every `catch`.
 */
export async function rejection<T>(run: Promise<unknown>): Promise<T> {
	try {
		await run;
	} catch (error) {
		// unknown: a rejection is any value; the caller names what it expects.
		return error as T;
	}
	throw new Error('expected the call to reject, but it resolved');
}
