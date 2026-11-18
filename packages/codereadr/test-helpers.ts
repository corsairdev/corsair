/** A typed view of a value a test already knows the shape of. */
export function asRecord(value: unknown): Record<string, unknown> {
	// unknown: the caller asserts the shape under test; this is the one place
	// the assertion happens instead of at every use site.
	return value as Record<string, unknown>;
}

export function asArray(value: unknown): unknown[] {
	// unknown: same as asRecord, for an array of values under test.
	return value as unknown[];
}

/**
 * Resolves a rejection to the value that was thrown. Tests take the error as
 * its real type (`CodereadrAPIError`) so assertions stay typed, and this keeps
 * the try/catch boilerplate out of each one.
 */
export async function rejection<T>(run: Promise<unknown>): Promise<T> {
	try {
		await run;
	} catch (error) {
		// unknown: the rejection is the value under test; the caller names the
		// type it expects through the generic argument.
		return error as T;
	}
	throw new Error('expected the call to reject, but it resolved');
}
