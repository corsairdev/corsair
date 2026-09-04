import 'dotenv/config';
import { makeGriptapeRequest } from './client';
import type {
	AssistantGetResponse,
	AssistantListResponse,
} from './endpoints/types';
import { GriptapeEndpointOutputSchemas } from './endpoints/types';

// Live Griptape Cloud tests. These only run when GRIPTAPE_API_KEY is set;
// otherwise the suite skips so CI stays green without credentials.
const LIVE_KEY = process.env.GRIPTAPE_API_KEY;
const describeLive = LIVE_KEY ? describe : describe.skip;

describeLive('Griptape live API', () => {
	it('assistant.list returns a paginated assistant list', async () => {
		const response = await makeGriptapeRequest<AssistantListResponse>(
			'assistants',
			LIVE_KEY as string,
			{ method: 'GET', query: { page: 1, page_size: 10 } },
		);

		const parsed = GriptapeEndpointOutputSchemas.assistantList.parse(response);
		expect(Array.isArray(parsed.assistants)).toBe(true);
		expect(parsed.pagination.page_number).toBe(1);
	});

	it('assistant.get returns a single assistant', async () => {
		const listed = await makeGriptapeRequest<AssistantListResponse>(
			'assistants',
			LIVE_KEY as string,
			{ method: 'GET', query: { page: 1, page_size: 1 } },
		);
		const first = listed.assistants[0];
		expect(first).toBeDefined();
		if (!first) return;

		const response = await makeGriptapeRequest<AssistantGetResponse>(
			`assistants/${first.assistant_id}`,
			LIVE_KEY as string,
			{ method: 'GET' },
		);

		const parsed = GriptapeEndpointOutputSchemas.assistantGet.parse(response);
		expect(parsed.assistant_id).toBe(first.assistant_id);
	});

	it('thread.list returns a thread list', async () => {
		const response = await makeGriptapeRequest<Record<string, unknown>>(
			'threads',
			LIVE_KEY as string,
			{ method: 'GET', query: { page: 1, page_size: 10 } },
		);

		expect(response).toBeDefined();
		expect(typeof response).toBe('object');
	});

	it('rejects invalid credentials with an auth error', async () => {
		await expect(
			makeGriptapeRequest<AssistantListResponse>(
				'assistants',
				'griptape-invalid-key-for-test',
				{ method: 'GET' },
			),
		).rejects.toThrow();
	});
});
