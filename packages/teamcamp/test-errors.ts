// unknown: a promise can reject with any value, so the rejection reason has no
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}
