import { makeWorkiomRequest, WorkiomAPIError } from './client';
import { WorkiomList, WorkiomRecordPage } from './schema';

const LIVE_KEY = process.env.WORKIOM_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Workiom live API (unauthenticated)', () => {
	it('rejects an invalid API key', async () => {
		const err = await makeWorkiomRequest(
			'/api/services/app/Lists/GetAll',
			'invalid-live-check',
			{ query: { appId: '00000000-0000-0000-0000-000000000000' } },
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(WorkiomAPIError);
		expect((err as WorkiomAPIError).status).toBeGreaterThanOrEqual(400);
	});
});

describeIfKey('Workiom live API (authenticated)', () => {
	it('lists lists then records from the first app', async () => {
		const apps = (await makeWorkiomRequest(
			'/api/services/app/Apps/GetAll',
			LIVE_KEY as string,
		)) as { items?: Array<{ id: string }> };
		const appId = apps.items?.[0]?.id;
		expect(appId).toBeTruthy();

		const listsRaw = await makeWorkiomRequest(
			'/api/services/app/Lists/GetAll',
			LIVE_KEY as string,
			{ query: { appId } },
		);
		const lists = WorkiomList.array().parse(
			listsRaw && typeof listsRaw === 'object' && 'items' in listsRaw
				? (listsRaw as { items: unknown }).items
				: listsRaw,
		);
		expect(lists.length).toBeGreaterThan(0);
		expect(lists[0]?.id.length).toBeGreaterThan(0);

		const page = WorkiomRecordPage.parse(
			await makeWorkiomRequest(
				'/api/services/app/Data/All',
				LIVE_KEY as string,
				{
					method: 'POST',
					body: {
						listId: lists[0]?.id,
						maxResultCount: 2,
						skipCount: 0,
					},
				},
			),
		);
		expect(page.totalCount).toBeGreaterThanOrEqual(0);
		expect(Array.isArray(page.items)).toBe(true);
	});
});
