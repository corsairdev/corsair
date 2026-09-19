import { FlexisignAPIError, makeFlexisignRequest } from './client';
import type { ListTemplatesResponse } from './endpoints/types';
import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';

describe('Flexisign Endpoint Schemas', () => {
	it('validates ListTemplates input schema', () => {
		const input = {};

		const parsed = FlexisignEndpointInputSchemas.ListTemplates.parse(input);

		expect(parsed).toEqual(input);
	});

	it('validates ListTemplates output schema', () => {
		const output = {
			status: 'success',
			code: 200,
			data: {
				list: [
					{
						_id: '6a927012137aed058249a39b',
						name: 'corsair Flexisign API Test',
					},
				],
				meta: {
					total: 1,
					limit: 10,
					page: 1,
					pages: 1,
					previousPage: null,
					nextPage: null,
				},
			},
			message: 'Data Sent Sucessfully',
		};

		const parsed = FlexisignEndpointOutputSchemas.ListTemplates.parse(output);

		expect(parsed).toEqual(output);
	});
});

// Live tests need a real key, so they only run when FLEXISIGN_API_KEY is set.
// CI (no key) skips this block instead of failing the gate.
const LIVE_API_KEY = process.env.FLEXISIGN_API_KEY;
const describeLive = LIVE_API_KEY ? describe : describe.skip;

describeLive('Flexisign Live API', () => {
	it('lists templates with a schema-valid response', async () => {
		if (!LIVE_API_KEY) throw new Error('FLEXISIGN_API_KEY is required');

		const raw = await makeFlexisignRequest<ListTemplatesResponse>(
			'/v1/templates/all',
			LIVE_API_KEY,
			{ method: 'GET', query: { page: 1, limit: 10 } },
		);
		const parsed = FlexisignEndpointOutputSchemas.ListTemplates.parse(raw);

		expect(parsed.status).toBe('success');
		expect(parsed.code).toBe(200);
		expect(Array.isArray(parsed.data.list)).toBe(true);
		expect(parsed.data.meta.page).toBe(1);
	});

	it('rejects an invalid key with an auth error (no retries)', async () => {
		let caught: Error;
		try {
			await makeFlexisignRequest<ListTemplatesResponse>(
				'/v1/templates/all',
				'invalid-key',
				{
					method: 'GET',
				},
			);
			throw new Error('expected the request to throw');
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('expected an Error');
			caught = error;
		}

		expect(caught).toBeInstanceOf(FlexisignAPIError);
		expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
		const strategy = await errorHandlers.AUTH_ERROR.handler();
		expect(strategy.maxRetries).toBe(0);
	});
});
