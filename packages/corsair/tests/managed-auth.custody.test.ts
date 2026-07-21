const hubApiPost = jest.fn();
jest.mock('../hub/client/http', () => ({
	hubApiPost: (...a: unknown[]) => hubApiPost(...a),
}));

import { getManagedAccessToken } from '../hub/managed-auth';

function makeKeys(initial: Record<string, string | null>) {
	const store = { ...initial };
	return {
		get_access_token: async () => store.access_token ?? null,
		get_expires_at: async () => store.expires_at ?? null,
		get_refresh_token: async () => store.refresh_token ?? null,
		set_access_token: jest.fn(async (v: string) => {
			store.access_token = v;
		}),
		set_expires_at: jest.fn(async (v: string) => {
			store.expires_at = v;
		}),
		set_refresh_token: jest.fn(async (v: string) => {
			store.refresh_token = v;
		}),
		set_scope: jest.fn(async () => {}),
	};
}

test('a Hub refresh caches the access token but NEVER persists the refresh token app-side', async () => {
	hubApiPost.mockResolvedValue({
		access_token: 'fresh-access',
		refresh_token: 'SECRET-REFRESH',
		expires_in: 3600,
		scope: 'a b',
	});
	// expired access token forces a refresh via Hub
	const keys = makeKeys({
		access_token: 'old',
		expires_at: '1',
		refresh_token: null,
	});

	const result = await getManagedAccessToken({
		keys: keys as never,
		hub: { apiUrl: 'h' } as never,
		plugin: 'gmail',
		tenantId: 't1',
	});

	expect(result.accessToken).toBe('fresh-access');
	expect(keys.set_access_token).toHaveBeenCalledWith('fresh-access');
	expect(keys.set_expires_at).toHaveBeenCalled();
	expect(keys.set_refresh_token).not.toHaveBeenCalled(); // custody: refresh token stays at Hub
});
