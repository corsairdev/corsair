/**
 * Runs a promise that is expected to reject and returns the reason.
 *
 * Each caller narrows the reason with the class it asserts on, so it needs no
 * widening at the call site. A catch binding has no type, so this is the one
 * place that narrows it: every caller's promise rejects with an Error.
 */
export async function rejection(
	// unknown: a promise can reject with any value, so the input has no stricter
	// type; the return type is where it is narrowed.
	promise: Promise<unknown>,
): Promise<Error> {
	try {
		await promise;
	} catch (caught) {
		return caught instanceof Error ? caught : new Error(String(caught));
	}
	throw new Error('Expected the call to reject, but it resolved.');
}
