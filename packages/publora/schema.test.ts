import { PubloraAccount, PubloraPost, PubloraSchema } from './schema';

describe('Publora schema', () => {
	it('declares a semver version and the two cached entities', () => {
		expect(PubloraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PubloraSchema.entities).sort()).toEqual([
			'accounts',
			'posts',
		]);
	});

	it('parses a connection as Publora returns it, nulls included', () => {
		const account = PubloraAccount.parse({
			platformId: 'telegram-1001234567890',
			username: null,
			displayName: 'Launch channel',
			profileImageUrl: null,
			profileUrl: null,
			accessTokenExpiresAt: null,
			tokenStatus: 'unknown',
			connectionStatus: 'active',
			tokenExpiresIn: null,
			lastSuccessfulPost: null,
			lastError: {
				message: 'Bot was removed',
				occurredAt: '2026-11-01T10:00:00.000Z',
			},
			subscriptionType: null,
			connectionId: '6900f1c2a1b2c3d4e5f60718',
		});

		expect(account.platformId).toBe('telegram-1001234567890');
		expect(account.lastError?.message).toBe('Bot was removed');
		// Fields Publora adds later are kept.
		expect((account as Record<string, unknown>).connectionId).toBe(
			'6900f1c2a1b2c3d4e5f60718',
		);
	});

	it('requires the primary keys', () => {
		expect(PubloraAccount.safeParse({ username: 'x' }).success).toBe(false);
		expect(PubloraPost.safeParse({ status: 'draft' }).success).toBe(false);
	});

	it('parses both platform shapes: get-post strings and list-posts objects', () => {
		const fromGet = PubloraPost.parse({
			postGroupId: 'g1',
			platforms: ['linkedin-ABC123'],
		});
		const fromList = PubloraPost.parse({
			postGroupId: 'g1',
			platforms: [
				{ platformId: 'ABC123', platform: 'linkedin', status: 'scheduled' },
			],
		});

		expect(fromGet.platforms?.[0]).toBe('linkedin-ABC123');
		expect(fromList.platforms?.[0]).toEqual(
			expect.objectContaining({ platform: 'linkedin', status: 'scheduled' }),
		);
	});
});
