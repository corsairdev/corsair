import { makeTextrazorRequest } from './client';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

import {
	AccountEndpoints,
	AnalysisEndpoints,
	ClassifierEndpoints,
	DictionaryEndpoints,
} from './endpoints';

const LIVE_KEY = process.env.TEXTRAZOR_API_KEY ?? '';
const describeLive = LIVE_KEY ? describe : describe.skip;

function ctx() {
	return {
		key: LIVE_KEY,
		db: {
			accounts: { upsertByEntityId: async () => undefined },
			dictionaries: { upsertByEntityId: async () => undefined },
			dictionaryEntries: { upsertByEntityId: async () => undefined },
			categories: { upsertByEntityId: async () => undefined },
			entities: { upsertByEntityId: async () => undefined },
		},
	};
}

function call<T>(fn: unknown, input?: unknown): Promise<T> {
	return (fn as (c: unknown, i: unknown) => Promise<T>)(ctx(), input);
}

describeLive('TextRazor live API', () => {
	it('gets account usage from GET /account/', async () => {
		const account = await call<{
			ok?: boolean;
			response?: { plan?: string; planDailyRequestsIncluded?: number };
		}>(AccountEndpoints.get, {});
		expect(account.ok).toBe(true);
		expect(account.response?.plan).toEqual(expect.any(String));
		expect(account.response?.planDailyRequestsIncluded).toEqual(
			expect.any(Number),
		);
	});

	it('analyzes, classifies, and extracts entities', async () => {
		const analyzed = await call<{
			ok?: boolean;
			response?: { entities?: unknown[]; topics?: unknown[] };
		}>(AnalysisEndpoints.analyzeContent, {
			text: 'Apple Inc. announced a partnership with OpenAI in California.',
			extractors: ['entities', 'topics'],
		});
		expect(analyzed.ok).toBe(true);
		expect((analyzed.response?.entities ?? []).length).toBeGreaterThan(0);

		const classified = await call<{
			ok?: boolean;
			response?: { categories?: Array<{ classifierId?: string }> };
		}>(AnalysisEndpoints.classifyText, {
			text: 'The football match ended with a last-minute goal from the striker.',
			classifiers: ['textrazor_iab'],
		});
		expect(classified.ok).toBe(true);
		expect(classified.response?.categories?.[0]?.classifierId).toBe(
			'textrazor_iab',
		);

		const extracted = await call<{
			ok?: boolean;
			response?: { entities?: unknown[] };
		}>(AnalysisEndpoints.extractEntities, {
			text: 'Apple Inc. is based in California.',
			minRelevanceScore: 0.1,
		});
		expect(extracted.ok).toBe(true);
		expect((extracted.response?.entities ?? []).length).toBeGreaterThan(0);
	});

	it('manages a custom dictionary end to end', async () => {
		const id = `corsair_test_${Date.now()}`;
		try {
			await call(DictionaryEndpoints.create, {
				id,
				matchType: 'token',
				caseInsensitive: true,
				language: 'eng',
			});
			await call(DictionaryEndpoints.addEntries, {
				id,
				entries: [{ text: 'Corsair Test Entity', id: 'DEV1' }],
			});
			const listed = await makeTextrazorRequest<{ ok?: boolean }>(
				'entities/',
				LIVE_KEY,
				{ method: 'GET' },
			);
			expect(listed.ok).toBe(true);
			const entry = await call<{
				ok?: boolean;
				response?: { text?: string };
			}>(DictionaryEndpoints.getEntry, { id, entryId: 'DEV1' });
			expect(entry.ok).toBe(true);
			await call(DictionaryEndpoints.deleteEntry, { id, entryId: 'DEV1' });
		} finally {
			await call(DictionaryEndpoints.delete, { id });
		}
	});

	it('manages a custom classifier end to end', async () => {
		const id = `corsair_clf_${Date.now()}`;
		try {
			await call(ClassifierEndpoints.put, {
				id,
				categories: [
					{
						categoryId: '100',
						label: 'Golf',
						query: "concept('sport>golf')",
					},
				],
			});
			const listed = await call<{ ok?: boolean }>(
				ClassifierEndpoints.listCategories,
				{ id, limit: 20, offset: 0 },
			);
			expect(listed.ok).toBe(true);
		} finally {
			await call(ClassifierEndpoints.delete, { id });
		}
	});
});
