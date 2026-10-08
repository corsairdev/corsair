import { makeContextSevenMcpRequest } from './client';
import type { ContextSevenMcpEndpointOutputs } from './endpoints/types';
import {
	ContextSevenMcpEndpointInputSchemas,
	ContextSevenMcpEndpointOutputSchemas,
} from './endpoints/types';

const TEST_API_KEY = process.env.CONTEXT7_API_KEY;

const liveApi = TEST_API_KEY ? describe : describe.skip;

liveApi('Context7 API Type Tests', () => {
	const apiKey = TEST_API_KEY ?? '';

	it('library.search returns ranked libraries', async () => {
		const input = ContextSevenMcpEndpointInputSchemas.librarySearch.parse({
			libraryName: 'react',
			query: 'manage state with hooks',
		});
		const response = await makeContextSevenMcpRequest<
			ContextSevenMcpEndpointOutputs['librarySearch']
		>('/v2/libs/search', apiKey, {
			method: 'GET',
			query: {
				libraryName: input.libraryName,
				query: input.query,
			},
		});
		const result =
			ContextSevenMcpEndpointOutputSchemas.librarySearch.parse(response);
		expect(Array.isArray(result.results)).toBe(true);
		expect(result.results[0]?.id).toBeTruthy();
	}, 60_000);

	it('context.get returns code and info snippets', async () => {
		const input = ContextSevenMcpEndpointInputSchemas.contextGet.parse({
			libraryId: '/facebook/react',
			query: 'How do I use useState?',
		});
		const response = await makeContextSevenMcpRequest<
			ContextSevenMcpEndpointOutputs['contextGet']
		>('/v2/context', apiKey, {
			method: 'GET',
			query: {
				libraryId: input.libraryId,
				query: input.query,
				type: 'json',
			},
		});
		const result =
			ContextSevenMcpEndpointOutputSchemas.contextGet.parse(response);
		expect(Array.isArray(result.codeSnippets)).toBe(true);
		expect(Array.isArray(result.infoSnippets)).toBe(true);
	}, 60_000);
});
