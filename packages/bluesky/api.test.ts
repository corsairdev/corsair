import { BlueskyEndpointInputSchemas } from './endpoints/types';

describe('Bluesky Validation Schema Tests', () => {
	describe('postsCreate input validation', () => {
		it('accepts valid text', () => {
			const result = BlueskyEndpointInputSchemas.postsCreate.safeParse({
				text: 'Hello from Corsair!',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing text', () => {
			const result = BlueskyEndpointInputSchemas.postsCreate.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe('postsDelete input validation', () => {
		it('accepts valid uri', () => {
			const result = BlueskyEndpointInputSchemas.postsDelete.safeParse({
				uri: 'at://did:plc:mockdid123/app.bsky.feed.post/mockpost123',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing uri', () => {
			const result = BlueskyEndpointInputSchemas.postsDelete.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe('profileGet input validation', () => {
		it('accepts valid actor', () => {
			const result = BlueskyEndpointInputSchemas.profileGet.safeParse({
				actor: 'shaswatraj.bsky.social',
			});
			expect(result.success).toBe(true);
		});

		it('rejects missing actor', () => {
			const result = BlueskyEndpointInputSchemas.profileGet.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe('timelineGet input validation', () => {
		it('accepts empty parameters', () => {
			const result = BlueskyEndpointInputSchemas.timelineGet.safeParse({});
			expect(result.success).toBe(true);
		});

		it('accepts valid parameters', () => {
			const result = BlueskyEndpointInputSchemas.timelineGet.safeParse({
				algorithm: 'reverse-chronological',
				limit: 20,
				cursor: 'next-page-cursor',
			});
			expect(result.success).toBe(true);
		});
	});
});
