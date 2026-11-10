// unknown: a promise can reject with any value, so the rejection reason has no
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

export const UNMOCKED_FETCH =
	'unmocked fetch: a test must not reach the network';

// Every fetch spy uses this as its default, so a test that queues no response
// fails here instead of calling api.teamcamp.app.
export function refuseNetwork(): Promise<Response> {
	return Promise.reject(new Error(UNMOCKED_FETCH));
}
