import { makeRedditRequest } from '../client';
import type {
	RedditEntityEnvelopeRaw,
	RedditListingRaw,
} from '../endpoints/types';
import {
	CommentDataSchema,
	PostDataSchema,
	UserDataSchema,
} from '../endpoints/types';
import { TEST_USERNAME } from '../endpoints/utils';

describe('User endpoints test suite', () => {
	describe('Reddit JSON: /user/{username}/about.json', () => {
		it('returns user profile (t2)', async () => {
			const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
				`/user/${TEST_USERNAME}/about.json`,
			);
			expect(raw.kind).toBe('t2');
			const parsed = UserDataSchema.parse(raw.data);
			expect(parsed.name).toBe(TEST_USERNAME);
		});

		it('parses all required fields', async () => {
			const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
				`/user/${TEST_USERNAME}/about.json`,
			);
			const parsed = UserDataSchema.parse(raw.data);
			expect(parsed.id).toBeTruthy();
			expect(typeof parsed.link_karma).toBe('number');
			expect(typeof parsed.comment_karma).toBe('number');
			expect(typeof parsed.total_karma).toBe('number');
			expect(typeof parsed.has_verified_email).toBe('boolean');
			expect(typeof parsed.created_utc).toBe('number');
		});
	});

	describe('Reddit JSON: /user/{username}/comments.json', () => {
		it('returns a listing of t1 comments', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/user/${TEST_USERNAME}/comments.json`,
				{ query: { limit: 3 } },
			);
			expect(raw.kind).toBe('Listing');
			const t1 = raw.data.children.filter((c) => c.kind === 't1');
			expect(t1.length).toBeGreaterThan(0);
			for (const child of t1) {
				expect(() => CommentDataSchema.parse(child.data)).not.toThrow();
			}
		});

		it('accepts sort parameter', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/user/${TEST_USERNAME}/comments.json`,
				{ query: { limit: 2, sort: 'top' } },
			);
			expect(raw.kind).toBe('Listing');
		});
	});

	describe('Reddit JSON: /user/{username}/overview.json', () => {
		it('returns a listing with mixed t1/t3 children', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/user/${TEST_USERNAME}/overview.json`,
				{ query: { limit: 5 } },
			);
			expect(raw.kind).toBe('Listing');
			const kinds = new Set(raw.data.children.map((c) => c.kind));
			expect(kinds.size).toBeGreaterThan(0);
			for (const k of kinds) {
				expect(['t1', 't3']).toContain(k);
			}
		});
	});

	describe('Reddit JSON: /user/{username}/submitted.json', () => {
		it('returns a listing of t3 posts', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/user/${TEST_USERNAME}/submitted.json`,
				{ query: { limit: 3 } },
			);
			expect(raw.kind).toBe('Listing');
			const t3 = raw.data.children.filter((c) => c.kind === 't3');
			expect(t3.length).toBeGreaterThan(0);
			for (const child of t3) {
				expect(() => PostDataSchema.parse(child.data)).not.toThrow();
			}
		});

		it('accepts sort and time filter', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/user/${TEST_USERNAME}/submitted.json`,
				{ query: { limit: 2, sort: 'top', t: 'year' } },
			);
			expect(raw.kind).toBe('Listing');
		});
	});
});
