import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	FormsGetResponse,
	FormsListResponse,
	QuestionsListResponse,
	SubmissionsListResponse,
} from '../../endpoints/types';
import { getFirstFormId, getFirstWorkspaceId, getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Cross-resource Consistency', () => {
	const key = getKey();

	it('questions listed match those embedded in submissions response', async () => {
		const formId = await getFirstFormId(key);

		const questions = await makeTallyRequest<QuestionsListResponse>(
			`forms/${formId}/questions`,
			key,
			{ method: 'GET' },
		);
		const subs = await makeTallyRequest<SubmissionsListResponse>(
			`forms/${formId}/submissions`,
			key,
			{ method: 'GET', query: { page: 1, limit: 1 } },
		);

		if (subs.questions && subs.questions.length > 0) {
			const qIds = questions.questions.map((q) => q.id);
			const subQIds = (subs.questions as Array<{ id: string }>).map(
				(q) => q.id,
			);
			for (const id of subQIds) {
				expect(qIds).toContain(id);
			}
		}
	});

	it('form listed via workspace filter still accessible via formsGet', async () => {
		const wsId = await getFirstWorkspaceId(key);
		if (!wsId) return;

		const segment = `workspaceIds=${encodeURIComponent(wsId)}`;
		const forms = await makeTallyRequest<FormsListResponse>(
			`forms?${segment}`,
			key,
			{ method: 'GET', query: { page: 1, limit: 1 } },
		);
		const firstForm = forms.items[0];
		if (!firstForm) return;

		const detail = await makeTallyRequest<FormsGetResponse>(
			`forms/${firstForm.id}`,
			key,
			{ method: 'GET' },
		);
		expect(detail.id).toBe(firstForm.id);
	});
});
