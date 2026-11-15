/**
 * Helpers shared by the test suites.
 *
 * A promise can reject with any value, so the rejection reason has no static
 * type. Every suite narrows it to the fields it asserts on, and this is the one
 * place that has to say so.
 */
export async function captureError<T>(
	promise: Promise<T>,
): Promise<unknown> /* unknown: a rejection reason has no static type */ {
	return promise.catch(
		(caught: unknown) => caught, // unknown: same reason as the return type
	);
}
