import { removeItem } from './endpoints/playlists';

describe('spotify playlists.removeItem DELETE body', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('sends tracks in the body without playlist_id', async () => {
		let capturedBody: string | undefined;
		global.fetch = (async (_url: string, init: RequestInit) => {
			capturedBody = init.body as string;
			return {
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () => JSON.stringify({ snapshot_id: 'snap123' }),
				json: async () => ({ snapshot_id: 'snap123' }),
			} as unknown as Response;
		}) as unknown as typeof fetch;

		const ctx = {
			key: 'test-token',
			$getAccountId: async () => 'test-account',
			database: undefined,
		} as any;

		await removeItem(ctx, {
			playlist_id: 'playlist-abc',
			tracks: [{ uri: 'spotify:track:xyz' }],
		});

		expect(capturedBody).toBeDefined();
		const parsed = JSON.parse(capturedBody!);
		expect(parsed).toEqual({ tracks: [{ uri: 'spotify:track:xyz' }] });
		expect(parsed).not.toHaveProperty('playlist_id');
	});

	it('includes snapshot_id when provided', async () => {
		let capturedBody: string | undefined;
		global.fetch = (async (_url: string, init: RequestInit) => {
			capturedBody = init.body as string;
			return {
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () => JSON.stringify({ snapshot_id: 'snap456' }),
				json: async () => ({ snapshot_id: 'snap456' }),
			} as unknown as Response;
		}) as unknown as typeof fetch;

		const ctx = {
			key: 'test-token',
			$getAccountId: async () => 'test-account',
			database: undefined,
		} as any;

		await removeItem(ctx, {
			playlist_id: 'playlist-abc',
			tracks: [{ uri: 'spotify:track:xyz' }],
			snapshot_id: 'snap789',
		});

		const parsed = JSON.parse(capturedBody!);
		expect(parsed).toEqual({
			tracks: [{ uri: 'spotify:track:xyz' }],
			snapshot_id: 'snap789',
		});
	});
});
