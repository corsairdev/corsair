import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

// A JSON response that fails to parse resolves to an undefined body. The
// parser's error message can quote the body, so the log must not include it.

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
};

const secret = 'ssn-12345';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request with a malformed JSON response', () => {
	it('resolves to undefined and logs nothing from the body', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(`${secret} is not JSON`, {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		const log = jest.spyOn(console, 'error').mockImplementation(() => {});

		await expect(
			request(config, { method: 'GET', url: '/records' }),
		).resolves.toBeUndefined();

		expect(log).toHaveBeenCalledTimes(1);
		const logged = log.mock.calls.flat().map(String).join(' ');
		expect(logged).toBe('Could not parse the 200 response body');
		expect(logged).not.toContain(secret);
	});
});
