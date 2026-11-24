/** Helpers shared by the offline suites, so each `unknown` is documented once. */

/**
 * Waits for a promise that is expected to reject and returns the rejection.
 *
 * unknown: a promise can reject with any value, so the rejection reason has no
 * static type. Each caller narrows it: to core's `ApiError`, to a ZodError by
 * its `name`, or to nothing at all.
 */
export async function captureError(
	promise: Promise<unknown>,
): Promise<unknown> {
	// unknown: the value is discarded.
	return promise.catch((caught: unknown) => caught); // unknown: returned as-is.
}

/**
 * A typed endpoint handle for request-shape tests.
 *
 * `never` parameters: every concrete endpoint is assignable to this because
 * function parameters are contravariant. The shared return is `unknown` because
 * each endpoint returns its own output type, and callers assert on the shape
 * they asked for.
 */
export type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint differs.

export const API_KEY = 'sp-test-key';
export const APPLICATION_TOKEN = 'sp-test-token';

/**
 * Calls an endpoint with a fake context and raw input.
 *
 * unknown: the negative cases pass values no schema accepts, so the input
 * cannot be typed as the endpoint's own input type.
 */
export function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: negatives pass junk.
	// The fake context carries only what the endpoints read: the resolved key
	// and the account accessor for the Application Token.
	return endpoint(
		{
			key: API_KEY,
			authType: 'api_key',
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: async () => API_KEY,
				get_application_token: async () => APPLICATION_TOKEN,
			},
		} as never,
		input as never,
	);
}
