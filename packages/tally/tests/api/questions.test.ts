import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type { QuestionsListResponse } from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getFirstFormId, getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Questions', () => {
	const key = getKey();
	let formId: string;

	beforeAll(async () => {
		formId = await getFirstFormId(key);
	});

	it('questionsList returns questions array and hasResponses flag', async () => {
		const result = await makeTallyRequest<QuestionsListResponse>(
			`forms/${formId}/questions`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.questionsList.parse(result);
		expect(Array.isArray(result.questions)).toBe(true);
		expect(typeof result.hasResponses).toBe('boolean');
	});

	it('each question has id, type, formId matching the queried form', async () => {
		const result = await makeTallyRequest<QuestionsListResponse>(
			`forms/${formId}/questions`,
			key,
			{ method: 'GET' },
		);
		for (const q of result.questions) {
			expect(q.id).toBeTruthy();
			expect(q.type).toBeTruthy();
			expect(q.formId).toBe(formId);
		}
	});

	it('questions have fields sub-array with uuid and type', async () => {
		const result = await makeTallyRequest<QuestionsListResponse>(
			`forms/${formId}/questions`,
			key,
			{ method: 'GET' },
		);
		for (const q of result.questions) {
			if (q.fields && Array.isArray(q.fields)) {
				for (const field of q.fields as Array<Record<string, unknown>>) {
					expect(field.uuid).toBeTruthy();
					expect(field.type).toBeTruthy();
				}
			}
		}
	});

	it('questionsList with invalid formId throws', async () => {
		await expect(
			makeTallyRequest('forms/invalid_form_123/questions', key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});
