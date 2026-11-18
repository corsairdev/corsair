/**
 * Runs a promise that is expected to reject and returns the rejection reason.
 *
 * Each caller narrows the reason with the class it asserts on, so it needs no
 * widening at the call site. A `catch` binding is typed `unknown` by the
 * compiler, which is the type this function returns.
 */
export async function rejection(promise: Promise<unknown>): Promise<unknown> {
	try {
		await promise;
	} catch (caught) {
		return caught;
	}
	throw new Error('Expected the call to reject, but it resolved.');
}
