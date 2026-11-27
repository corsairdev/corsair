import { z } from 'zod';
import { makeSegmentRequest } from './client';
import { SegmentEndpointOutputSchemas } from './endpoints/types';

// Live smoke against the Segment Public API: read-only, three calls. Route
// every answer through its output schema so a field typed wrongly fails here
// and not in a caller's hands.
const KEY_CHECK = z.string().min(1).safeParse(process.env.SEGMENT_API_KEY);
const describeLive = KEY_CHECK.success ? describe : describe.skip;

describeLive('Segment live API', (): void => {
	jest.setTimeout(30_000);

	const key = (): string => KEY_CHECK.data!;

	it('workspaces.get returns the token workspace', async (): Promise<void> => {
		const response = SegmentEndpointOutputSchemas.workspacesGet.parse(
			await makeSegmentRequest(key(), { method: 'GET', path: '/' }),
		);
		expect(response.data.workspace.id).toBeDefined();
		expect(response.data.workspace.slug).toBeDefined();
	});

	it('sources.list returns a page of sources', async (): Promise<void> => {
		const response = SegmentEndpointOutputSchemas.sourcesList.parse(
			await makeSegmentRequest(key(), {
				method: 'GET',
				path: '/sources',
				query: { 'pagination.count': 5 },
			}),
		);
		expect(response.data.pagination.current).toBeDefined();
	});

	it('catalog.listSources returns the catalog page', async (): Promise<void> => {
		const response = SegmentEndpointOutputSchemas.catalogListSources.parse(
			await makeSegmentRequest(key(), {
				method: 'GET',
				path: '/catalog/sources',
				query: { 'pagination.count': 5 },
			}),
		);
		expect(response.data.sourcesCatalog).toBeDefined();
	});
});
