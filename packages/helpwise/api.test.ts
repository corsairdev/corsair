// Live Helpwise API tests. Excluded from default run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run it with:
//
//   HELPWISE_API_KEY="key:secret" pnpm test:live
//
import { makeHelpwiseRequest } from './client';
import type {
	ContactsListResponse,
	ConversationsListResponse,
	TagsListResponse,
} from './endpoints/types';
import {
	ContactsListResponseSchema,
	ConversationsListResponseSchema,
	TagsListResponseSchema,
} from './endpoints/types';

const rawKey = process.env.HELPWISE_API_KEY ?? '';
const rawSecret = process.env.HELPWISE_API_SECRET ?? '';

const liveKey = rawKey.includes(':')
	? rawKey
	: rawKey && rawSecret
		? `${rawKey}:${rawSecret}`
		: '';

const describeLive = liveKey.length > 0 ? describe : describe.skip;

if (!liveKey) {
	console.warn(
		'Skipping live Helpwise tests: HELPWISE_API_KEY (or key + HELPWISE_API_SECRET) not set',
	);
}

describeLive('Helpwise live API smoke tests (read-only)', () => {
	it('GET /conversations lists conversations for the authenticated account', async () => {
		const res = await makeHelpwiseRequest<ConversationsListResponse>(
			'/conversations',
			liveKey,
			{ method: 'GET', query: { limit: 5 } },
		);

		const parsed = ConversationsListResponseSchema.parse(res);
		expect(Array.isArray(parsed.threads)).toBe(true);
	});

	it('GET /contacts lists contacts', async () => {
		const res = await makeHelpwiseRequest<ContactsListResponse>(
			'/contacts',
			liveKey,
			{ method: 'GET', query: { limit: 5 } },
		);

		const parsed = ContactsListResponseSchema.parse(res);
		// An account with no contacts answers `results: null`.
		expect(parsed.results === null || Array.isArray(parsed.results)).toBe(true);
	});

	it('GET /tags lists tags', async () => {
		const res = await makeHelpwiseRequest<TagsListResponse>('/tags', liveKey, {
			method: 'GET',
		});

		const parsed = TagsListResponseSchema.parse(res);
		// An account with no tags answers `null`.
		expect(parsed === null || Array.isArray(parsed)).toBe(true);
	});
});
