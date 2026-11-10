import { createCorsair } from 'corsair/core';
import { nutshell } from './index';

const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
const api = corsair.nutshell.api;

describe('Nutshell request guards', () => {
	let fetchSpy: jest.SpyInstance;

	beforeEach(() => {
		// No test in this file may reach the network: a 204 stands in for the
		// provider, and each case asserts whether a request was attempted.
		fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => new Response(null, { status: 204 }));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each(['.', '..'])(
		'refuses the path value %p instead of requesting another route',
		async (id) => {
			// fetch would normalise /rest/accounts/.. to /rest/, a different route.
			await expect(api.accounts.delete({ id })).rejects.toThrow(
				/invalid path parameter: id/,
			);
			await expect(
				api.leads.status({ id, body: { outcomeId: '1-outcomes' } }),
			).rejects.toThrow(/invalid path parameter: id/);
			expect(fetchSpy).not.toHaveBeenCalled();
		},
	);

	it('still encodes ordinary path values', async () => {
		await api.contacts.delete({ id: '7-contacts/../x' });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://app.nutshell.com/rest/contacts/7-contacts%2F..%2Fx',
		);
	});
});
