/**
 * Spies on fetch and refuses any request a test did not queue an answer for.
 * A bare `jest.spyOn(globalThis, 'fetch')` calls through to the real fetch, so
 * a test that queues one answer too few would reach api.lemonsqueezy.com.
 * Answers queued with `mockResolvedValueOnce` still take precedence.
 */
export function spyOnFetch(): jest.SpyInstance {
	return jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation((input) =>
			Promise.reject(
				new Error(
					`unmocked fetch to ${String(input)}: tests must not reach the network`,
				),
			),
		);
}
