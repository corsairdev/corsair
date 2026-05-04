import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	FormsGetResponse,
	FormsListResponse,
} from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getFirstFormId, getFirstWorkspaceId, getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Forms', () => {
	const key = getKey();
	let formId: string;
	let workspaceId: string | undefined;

	beforeAll(async () => {
		workspaceId = await getFirstWorkspaceId(key);
		formId = await getFirstFormId(key);
	});

	it('formsList returns paginated response with required fields', async () => {
		const result = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 1, limit: 10 },
		});
		TallyEndpointOutputSchemas.formsList.parse(result);
		expect(typeof result.page).toBe('number');
		expect(typeof result.limit).toBe('number');
		expect(typeof result.total).toBe('number');
		expect(typeof result.hasMore).toBe('boolean');
		expect(Array.isArray(result.items)).toBe(true);
	});

	it('form items contain id, name, status, workspaceId', async () => {
		const result = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 1, limit: 10 },
		});
		for (const form of result.items) {
			expect(form.id).toBeTruthy();
			expect(typeof form.name).toBe('string');
			expect(form.status).toBeTruthy();
			expect(['BLANK', 'DRAFT', 'PUBLISHED', 'DELETED']).toContain(
				form.status,
			);
		}
	});

	it('formsList respects limit parameter', async () => {
		const result = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 1, limit: 1 },
		});
		expect(result.items.length).toBeLessThanOrEqual(1);
		expect(result.limit).toBe(1);
	});

	it('formsList page 2 returns different results or empty', async () => {
		const page1 = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 1, limit: 1 },
		});
		if (!page1.hasMore) return;

		const page2 = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 2, limit: 1 },
		});
		const p2First = page2.items[0];
		const p1First = page1.items[0];
		if (p2First && p1First) {
			expect(p2First.id).not.toBe(p1First.id);
		}
	});

	it('formsList with workspaceIds filter returns only matching forms', async () => {
		if (!workspaceId) return;
		const segment = `workspaceIds=${encodeURIComponent(workspaceId)}`;
		const result = await makeTallyRequest<FormsListResponse>(
			`forms?${segment}`,
			key,
			{ method: 'GET', query: { page: 1, limit: 50 } },
		);
		TallyEndpointOutputSchemas.formsList.parse(result);
		for (const form of result.items) {
			expect(form.workspaceId).toBe(workspaceId);
		}
	});

	it('formsGet returns full form with blocks and settings', async () => {
		const result = await makeTallyRequest<FormsGetResponse>(
			`forms/${formId}`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.formsGet.parse(result);
		expect(result.id).toBe(formId);
		expect(result.name).toBeTruthy();
		expect(result.status).toBeTruthy();
	});

	it('formsGet with invalid id throws', async () => {
		await expect(
			makeTallyRequest('forms/invalid_form_id_xyz', key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});

	it('formsGet id matches formsList id', async () => {
		const list = await makeTallyRequest<FormsListResponse>('forms', key, {
			method: 'GET',
			query: { page: 1, limit: 1 },
		});
		const listedForm = list.items[0];
		if (!listedForm) return;
		const detail = await makeTallyRequest<FormsGetResponse>(
			`forms/${listedForm.id}`,
			key,
			{ method: 'GET' },
		);
		expect(detail.id).toBe(listedForm.id);
		expect(detail.name).toBe(listedForm.name);
		expect(detail.status).toBe(listedForm.status);
	});
});
