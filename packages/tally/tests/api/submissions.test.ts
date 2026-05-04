import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	SubmissionsGetResponse,
	SubmissionsListResponse,
} from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getFirstFormId, getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Submissions', () => {
	const key = getKey();
	let formId: string;
	let submissionId: string;

	beforeAll(async () => {
		formId = await getFirstFormId(key);

		const subs = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 1 } },
		);
		if (!subs.submissions[0]?.id) {
			throw new Error('No submissions available');
		}
		submissionId = subs.submissions[0].id;
	});

	it('submissionsList returns paginated response', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 5, filter: 'all' } },
		);
		TallyEndpointOutputSchemas.submissionsList.parse(result);
		expect(typeof result.page).toBe('number');
		expect(typeof result.hasMore).toBe('boolean');
		expect(Array.isArray(result.submissions)).toBe(true);
	});

	it('submissions contain id, formId, isCompleted, submittedAt', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 10 } },
		);
		for (const sub of result.submissions) {
			expect(sub.id).toBeTruthy();
			expect(sub.formId).toBe(formId);
			expect(typeof sub.isCompleted).toBe('boolean');
		}
	});

	it('submissionsList includes questions alongside submissions', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 5 } },
		);
		expect(Array.isArray(result.questions)).toBe(true);
		const firstQ = result.questions?.[0];
		if (firstQ) {
			expect(firstQ.id).toBeTruthy();
		}
	});

	it('submissionsList filter=completed only returns completed', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 50, filter: 'completed' } },
		);
		for (const sub of result.submissions) {
			expect(sub.isCompleted).toBe(true);
		}
	});

	it('submissionsList totalNumberOfSubmissionsPerFilter has all/completed/partial', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 1 } },
		);
		const filters = result.totalNumberOfSubmissionsPerFilter as
			| Record<string, number>
			| undefined;
		expect(filters).toBeDefined();
		expect(typeof filters?.all).toBe('number');
		expect(typeof filters?.completed).toBe('number');
		expect(typeof filters?.partial).toBe('number');
		expect(filters!.all).toBe(
			(filters!.completed ?? 0) + (filters!.partial ?? 0),
		);
	});

	it('submissionsList respects limit', async () => {
		const result = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 1 } },
		);
		expect(result.submissions.length).toBeLessThanOrEqual(1);
	});

	it('submissionsGet returns single submission with responses', async () => {
		const result = await makeTallyRequest<SubmissionsGetResponse>(
			`forms/${formId}/submissions/${submissionId}`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.submissionsGet.parse(result);
		expect(result.submission.id).toBe(submissionId);
		expect(result.submission.formId).toBe(formId);
		expect(Array.isArray(result.submission.responses)).toBe(true);
	});

	it('submissionsGet includes questions for context', async () => {
		const result = await makeTallyRequest<SubmissionsGetResponse>(
			`forms/${formId}/submissions/${submissionId}`,
			key,
			{ method: 'GET' },
		);
		expect(Array.isArray(result.questions)).toBe(true);
	});

	it('submission responses reference correct questionId and formId', async () => {
		const result = await makeTallyRequest<SubmissionsGetResponse>(
			`forms/${formId}/submissions/${submissionId}`,
			key,
			{ method: 'GET' },
		);
		const responses = result.submission.responses as Array<
			Record<string, unknown>
		>;
		if (responses && responses.length > 0) {
			for (const resp of responses) {
				expect(resp.formId).toBe(formId);
				expect(resp.questionId).toBeTruthy();
				expect(resp.submissionId).toBe(submissionId);
			}
		}
	});

	it('submissionsGet with invalid submissionId throws', async () => {
		await expect(
			makeTallyRequest(
				`forms/${formId}/submissions/invalid_sub_999`,
				key,
				{ method: 'GET' },
			),
		).rejects.toThrow();
	});
});
