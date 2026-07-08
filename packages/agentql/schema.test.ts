import {
	AgentQLEndpointInputSchemas,
	AgentQLEndpointOutputSchemas,
} from './endpoints/types';

const ENDPOINTS = [
	'queryData',
	'queryDocument',
	'createRemoteBrowserSession',
	'getUsage',
] as const;

describe('AgentQL endpoint schemas', () => {
	it('defines input and output schemas for every endpoint', () => {
		for (const endpoint of ENDPOINTS) {
			expect(AgentQLEndpointInputSchemas[endpoint]).toBeDefined();
			expect(AgentQLEndpointOutputSchemas[endpoint]).toBeDefined();
		}
	});

	it('rejects invalid queryData input', () => {
		const result = AgentQLEndpointInputSchemas.queryData.safeParse({
			query: 42,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a minimal valid queryData input', () => {
		const result = AgentQLEndpointInputSchemas.queryData.safeParse({
			url: 'https://example.com',
			query: '{ products[] { name price } }',
		});
		expect(result.success).toBe(true);
	});
});
