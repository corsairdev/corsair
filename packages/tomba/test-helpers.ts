/** Helpers shared by the offline suites. */

/**
 * Waits for a promise that is expected to reject and returns the rejection.
 *
 * unknown: a promise can reject with any value, so the rejection reason has no
 * static type. Each caller narrows it by `name`, by `type`, or not at all.
 */
export async function captureError(
	promise: Promise<unknown>,
): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

/**
 * A typed endpoint handle for request-shape tests.
 *
 * `never` parameters: every concrete endpoint is assignable to this because
 * function parameters are contravariant. The shared return is `unknown` because
 * each endpoint returns its own output type.
 */
export type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

export const API_KEY = 'tb-test-key';
export const API_SECRET = 'tb-test-secret';

/**
 * Calls an endpoint with a fake context and raw input.
 *
 * unknown: the negative cases pass values no schema accepts, so the input
 * cannot be typed as the endpoint's own input type.
 */
export function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(
		{
			key: API_KEY,
			authType: 'api_key',
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: async () => API_KEY,
				get_api_secret: async () => API_SECRET,
			},
		} as never,
		input as never,
	);
}
