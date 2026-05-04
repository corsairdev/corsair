import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	WorkspacesGetResponse,
	WorkspacesListResponse,
} from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Workspaces', () => {
	const key = getKey();

	it('workspacesList returns paginated array', async () => {
		const result = await makeTallyRequest<WorkspacesListResponse>(
			'workspaces',
			key,
			{ method: 'GET', query: { page: 1 } },
		);
		TallyEndpointOutputSchemas.workspacesList.parse(result);
		expect(Array.isArray(result.items)).toBe(true);
		expect(typeof result.page).toBe('number');
		expect(typeof result.hasMore).toBe('boolean');
		expect(typeof result.total).toBe('number');
		expect(result.total).toBeGreaterThanOrEqual(result.items.length);
	});

	it('workspace items contain id, name, members, createdAt', async () => {
		const result = await makeTallyRequest<WorkspacesListResponse>(
			'workspaces',
			key,
			{ method: 'GET', query: { page: 1 } },
		);
		for (const ws of result.items) {
			expect(ws.id).toBeTruthy();
			expect(typeof ws.name).toBe('string');
			expect(ws.createdAt).toBeTruthy();
		}
	});

	it('workspacesGet returns same workspace as listed', async () => {
		const list = await makeTallyRequest<WorkspacesListResponse>(
			'workspaces',
			key,
			{ method: 'GET', query: { page: 1 } },
		);
		const first = list.items[0];
		if (!first) return;

		const result = await makeTallyRequest<WorkspacesGetResponse>(
			`workspaces/${first.id}`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.workspacesGet.parse(result);
		expect(result.id).toBe(first.id);
		expect(result.name).toBe(first.name);
	});

	it('workspacesGet with invalid id throws', async () => {
		await expect(
			makeTallyRequest('workspaces/nonexistent_id_123', key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});
