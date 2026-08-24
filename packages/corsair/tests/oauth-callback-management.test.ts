import type { CorsairInternalConfig } from '../core';
import { completeOAuthCallback } from '../core/management/operations';
import { processOAuthCallback } from '../oauth';

// operations.ts reaches the OAuth exchange via `await import('../../oauth')`;
// both specifiers resolve to the same module. Stub only processOAuthCallback so
// the rest of the module (used elsewhere in the import chain) stays real.
jest.mock('../oauth', () => ({
	...jest.requireActual('../oauth'),
	processOAuthCallback: jest.fn(async () => ({
		plugin: 'github',
		tenantId: 't1',
	})),
}));

const mockProcess = processOAuthCallback as jest.MockedFunction<
	typeof processOAuthCallback
>;

const internal = {
	manual: { baseUrl: 'https://x', redirectUri: 'https://app/cb' },
} as unknown as CorsairInternalConfig;

describe('completeOAuthCallback (management)', () => {
	beforeEach(() => mockProcess.mockClear());

	it('forwards callbackParams (e.g. installation_id) to processOAuthCallback', async () => {
		await completeOAuthCallback({}, internal, {
			code: 'c',
			state: 's',
			callbackParams: { installation_id: '123' },
		} as never);

		expect(mockProcess).toHaveBeenCalledWith(
			{},
			expect.objectContaining({
				code: 'c',
				state: 's',
				callbackParams: { installation_id: '123' },
			}),
		);
	});

	it('omits callbackParams when the caller supplies none', async () => {
		await completeOAuthCallback({}, internal, {
			code: 'c',
			state: 's',
		} as never);

		const [, opts] = mockProcess.mock.calls[0]!;
		expect(
			(opts as { callbackParams?: unknown }).callbackParams,
		).toBeUndefined();
	});
});
