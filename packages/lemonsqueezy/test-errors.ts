/**
 * Resolves a rejected promise to its error, for tests that assert on a thrown
 * value. One annotated helper replaces `(caught: unknown) => caught` at every
 * call site.
 */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}
