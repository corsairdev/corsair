import { makeGetProspectRequest } from './client';
import { GetProspectOperationOutputSchemas } from './endpoints/types';

const apiKey = process.env.GETPROSPECT_API_KEY;
if (!apiKey)
	console.warn(
		'Skipping GetProspect live read-only test: GETPROSPECT_API_KEY is not set.',
	);

(apiKey ? describe : describe.skip)('GetProspect live API smoke', () => {
	it('reads the authenticated account without spending credits', async () => {
		// unknown because provider JSON is untrusted until the operation output schema validates it.
		const response: unknown = await makeGetProspectRequest<unknown>(
			'/v2/me',
			apiKey,
			{
				method: 'GET',
			},
		);
		expect(
			GetProspectOperationOutputSchemas.me_get.parse(response),
		).toBeDefined();
	});
});
