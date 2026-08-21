import { request } from 'corsair/http';
import { basecamp } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

type RefreshAuth = () => Promise<string>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

const FAR_FUTURE = String(Math.floor(Date.now() / 1000) + 3600);

/** Mirrors the account key manager: reads observe writes, as storage does. */
function keyStore(expiresAt: string) {
	const state = {
		access_token: 'A1',
		expires_at: expiresAt,
		refresh_token: 'R1',
	};
	return {
		state,
		keys: {
			get_access_token: jest.fn(async () => state.access_token),
			get_expires_at: jest.fn(async () => state.expires_at),
			get_refresh_token: jest.fn(async () => state.refresh_token),
			get_integration_credentials: jest.fn(async () => ({
				client_id: 'cid',
				client_secret: 'sec',
			})),
			set_access_token: jest.fn(async (value: string) => {
				state.access_token = value;
			}),
			set_expires_at: jest.fn(async (value: string) => {
				state.expires_at = value;
			}),
			set_refresh_token: jest.fn(async (value: string) => {
				state.refresh_token = value;
			}),
		},
	};
}

function refreshedWith(refreshToken: string) {
	return {
		access_token: 'A2',
		refresh_token: refreshToken,
		expires_in: 1209600,
	};
}

/** The refresh_token each exchange put on the wire, in call order. */
function submittedRefreshTokens(): string[] {
	return mockRequest.mock.calls.map(
		(call) =>
			new URLSearchParams(String(call[1]?.body)).get('refresh_token') ?? '',
	);
}

const keyBuilder = basecamp({}).keyBuilder as unknown as KeyBuilder;

beforeEach(() => mockRequest.mockReset());

describe('Basecamp keyBuilder refresh concurrency', () => {
	it('performs one exchange when concurrent calls find an expired token', async () => {
		const { keys, state } = keyStore('0');
		mockRequest.mockResolvedValue(refreshedWith('R2'));

		const tokens = await Promise.all([
			keyBuilder({ authType: 'oauth_2', keys }, 'endpoint'),
			keyBuilder({ authType: 'oauth_2', keys }, 'endpoint'),
		]);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(tokens).toEqual(['A2', 'A2']);
		expect(state.refresh_token).toBe('R2');
	});

	it('performs one exchange when two 401 retries refresh at once', async () => {
		const { keys } = keyStore(FAR_FUTURE);
		const ctx = { authType: 'oauth_2', keys } as Record<string, unknown>;

		// Two endpoint calls each run the keyBuilder, so two independent
		// _refreshAuth closures exist, both holding R1.
		await keyBuilder(ctx, 'endpoint');
		const firstRefresh = ctx._refreshAuth as RefreshAuth;
		await keyBuilder(ctx, 'endpoint');
		const secondRefresh = ctx._refreshAuth as RefreshAuth;
		expect(mockRequest).not.toHaveBeenCalled();

		mockRequest.mockResolvedValue(refreshedWith('R2'));
		const fresh = await Promise.all([firstRefresh(), secondRefresh()]);

		// Without coalescing the loser would resubmit R1 — already spent by the
		// winner — and fail with BasecampOAuthError.
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(fresh).toEqual(['A2', 'A2']);
	});

	it('submits the rotated token when a closure refreshes after another call', async () => {
		const { keys, state } = keyStore(FAR_FUTURE);
		const ctx = { authType: 'oauth_2', keys } as Record<string, unknown>;

		await keyBuilder(ctx, 'endpoint');
		const staleClosure = ctx._refreshAuth as RefreshAuth;
		await keyBuilder(ctx, 'endpoint');
		const freshClosure = ctx._refreshAuth as RefreshAuth;

		mockRequest.mockResolvedValueOnce(refreshedWith('R2'));
		await freshClosure();
		expect(state.refresh_token).toBe('R2');

		// staleClosure captured R1, which the call above has now spent. It must
		// pick up the persisted R2 rather than resubmitting R1.
		mockRequest.mockResolvedValueOnce(refreshedWith('R3'));
		await staleClosure();

		expect(submittedRefreshTokens()).toEqual(['R1', 'R2']);
		expect(state.refresh_token).toBe('R3');
	});
});
