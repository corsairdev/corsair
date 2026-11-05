import { request as sharedHttpRequest } from 'corsair/http';
import { makeRecallaiContextRequest } from './client';
import {
	createMeetingDirectConnect,
	createZoomOAuthApp,
	createZoomOAuthCredential,
	deleteZoomOAuthApp,
	deleteZoomOAuthCredential,
	listMeetingDirectConnects,
	listZoomMeetingsToCredentials,
	listZoomOAuthAppLogs,
	listZoomOAuthApps,
	listZoomOAuthCredentialLogs,
	listZoomOAuthCredentials,
	retrieveBillingUsage,
	retrieveMeetingDirectConnect,
	retrieveZoomOAuthApp,
	retrieveZoomOAuthCredential,
	retrieveZoomOAuthCredentialAccessToken,
	syncZoomOAuthCredentialMeetings,
	updateZoomOAuthApp,
	validateZoomOAuthCredential,
} from './endpoints/workspace-operations';
import { recallaiTestContext } from './test-context';

jest.mock('./client', () => ({ makeRecallaiContextRequest: jest.fn() }));
jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const request = jest.mocked(makeRecallaiContextRequest);
const ctx = recallaiTestContext;
const appId = '550e8400-e29b-41d4-a716-446655440000';
const credentialId = '550e8400-e29b-41d4-a716-446655440001';
const meetingId = '550e8400-e29b-41d4-a716-446655440002';
const timestamp = '2026-01-01T00:00:00.000Z';

const credential = {
	id: credentialId,
	oauth_app: appId,
	status: 'healthy',
	user_id: 'user-1',
	account_id: null,
	access_token_callback_url: null,
	created_at: timestamp,
	meeting_sync_status: 'completed',
};

const oauthApp = {
	id: appId,
	kind: 'user_level',
	client_id: 'zoom-client',
	client_secret: 'secret',
	webhook_secret: 'hook-secret',
	webhook_last_validation: null,
	created_at: timestamp,
};

const directConnect = {
	id: meetingId,
	status: { code: 'complete', sub_code: null, updated_at: timestamp },
	zoom_rtms: null,
	google_meet_media_api: null,
	recording_config: null,
	recordings: [],
	metadata: { source: 'test' },
	created_at: timestamp,
};

describe('Recall.ai final workspace operations', () => {
	beforeEach(() => request.mockReset());

	it('retrieves billing usage with exact date bounds and validates the response', async () => {
		request.mockResolvedValue({ bot_total: 123.5 });
		await expect(
			retrieveBillingUsage(ctx, { start: timestamp, end: timestamp }),
		).resolves.toEqual({ bot_total: 123.5 });
		expect(request).toHaveBeenCalledWith(ctx, '/api/v1/billing/usage/', {
			method: 'GET',
			query: { start: timestamp, end: timestamp },
		});
	});

	it('lists meeting direct connects with no undocumented query parameters', async () => {
		request.mockResolvedValue([directConnect]);
		await expect(listMeetingDirectConnects(ctx, {})).resolves.toEqual([
			directConnect,
		]);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v1/meeting_direct_connect/',
			{ method: 'GET' },
		);
	});

	it('creates a meeting direct connect with only documented top-level fields', async () => {
		request.mockResolvedValue(directConnect);
		const body = {
			google_meet_media_api: {
				space_name: 'abc-defg-hij',
				access_token: 'google-access-token',
			},
			recording_config: { video_mixed_layout: 'speaker_view' },
			metadata: { source: 'test' },
		};
		await expect(createMeetingDirectConnect(ctx, body)).resolves.toEqual(
			directConnect,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v1/meeting_direct_connect/',
			{ method: 'POST', body },
		);
	});

	it('retrieves a meeting direct connect by its encoded UUID', async () => {
		request.mockResolvedValue(directConnect);
		await expect(
			retrieveMeetingDirectConnect(ctx, { id: meetingId }),
		).resolves.toEqual(directConnect);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v1/meeting_direct_connect/${encodeURIComponent(meetingId)}/`,
			{ method: 'GET' },
		);
	});

	it('lists Zoom meeting credential mappings with every documented filter', async () => {
		const response = {
			next: null,
			previous: null,
			results: [
				{ meeting_id: 12345, credential: credentialId, synced_at: timestamp },
			],
		};
		const query = {
			credential: credentialId,
			cursor: 'cursor-1',
			meeting_id: 12345,
			ordering: '-synced_at',
			synced_at_after: timestamp,
			synced_at_before: timestamp,
		};
		request.mockResolvedValue(response);
		await expect(listZoomMeetingsToCredentials(ctx, query)).resolves.toEqual(
			response,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v2/zoom-meetings-to-credentials/',
			{ method: 'GET', query },
		);
	});

	it('lists Zoom OAuth app logs with the documented filters', async () => {
		const response = {
			next: null,
			previous: null,
			results: [
				{ oauth_app: appId, message: 'validated', created_at: timestamp },
			],
		};
		const query = {
			created_at_after: timestamp,
			created_at_before: timestamp,
			cursor: 'cursor-2',
			oauth_app: appId,
			ordering: '-created_at',
		};
		request.mockResolvedValue(response);
		await expect(listZoomOAuthAppLogs(ctx, query)).resolves.toEqual(response);
		expect(request).toHaveBeenCalledWith(ctx, '/api/v2/zoom-oauth-app-logs/', {
			method: 'GET',
			query,
		});
	});

	it('lists Zoom OAuth apps with all documented filters', async () => {
		const response = { next: null, previous: null, results: [oauthApp] };
		const query = {
			client_id: 'zoom-client',
			created_at_after: timestamp,
			created_at_before: timestamp,
			cursor: 'cursor-3',
			kind: 'user_level' as const,
			ordering: 'created_at',
			webhook_last_validation_after: timestamp,
			webhook_last_validation_before: timestamp,
		};
		request.mockResolvedValue(response);
		await expect(listZoomOAuthApps(ctx, query)).resolves.toEqual(response);
		expect(request).toHaveBeenCalledWith(ctx, '/api/v2/zoom-oauth-apps/', {
			method: 'GET',
			query,
		});
	});

	it('creates a Zoom OAuth app with its required credentials', async () => {
		request.mockResolvedValue(oauthApp);
		const body = {
			kind: 'user_level' as const,
			client_id: 'zoom-client',
			client_secret: 'secret',
			webhook_secret: 'hook-secret',
		};
		await expect(createZoomOAuthApp(ctx, body)).resolves.toEqual(oauthApp);
		expect(request).toHaveBeenCalledWith(ctx, '/api/v2/zoom-oauth-apps/', {
			method: 'POST',
			body,
		});
	});

	it('retrieves a Zoom OAuth app by UUID', async () => {
		request.mockResolvedValue(oauthApp);
		await expect(retrieveZoomOAuthApp(ctx, { id: appId })).resolves.toEqual(
			oauthApp,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-apps/${encodeURIComponent(appId)}/`,
			{ method: 'GET' },
		);
	});

	it('partially updates a Zoom OAuth app without sending its identifier in the body', async () => {
		request.mockResolvedValue(oauthApp);
		const body = { webhook_secret: 'replacement-secret' };
		await expect(
			updateZoomOAuthApp(ctx, { id: appId, ...body }),
		).resolves.toEqual(oauthApp);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-apps/${encodeURIComponent(appId)}/`,
			{ method: 'PATCH', body },
		);
	});

	it('only sends the two fields Recall lets a Zoom OAuth app update', async () => {
		request.mockReset();
		await expect(
			updateZoomOAuthApp(ctx, { id: appId, client_id: 'new-id' } as never),
		).rejects.toThrow();
		await expect(updateZoomOAuthApp(ctx, { id: appId })).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('deletes a Zoom OAuth app and returns undefined for the 204 response', async () => {
		request.mockResolvedValue(undefined);
		await expect(
			deleteZoomOAuthApp(ctx, { id: appId }),
		).resolves.toBeUndefined();
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-apps/${encodeURIComponent(appId)}/`,
			{ method: 'DELETE' },
		);
	});

	it('lists Zoom OAuth credential logs with documented filters', async () => {
		const response = {
			next: null,
			previous: null,
			results: [
				{
					credential: credentialId,
					message: 'refreshed',
					created_at: timestamp,
				},
			],
		};
		const query = {
			created_at_after: timestamp,
			created_at_before: timestamp,
			credential: credentialId,
			cursor: 'cursor-4',
			ordering: '-created_at',
		};
		request.mockResolvedValue(response);
		await expect(listZoomOAuthCredentialLogs(ctx, query)).resolves.toEqual(
			response,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v2/zoom-oauth-credential-logs/',
			{ method: 'GET', query },
		);
	});

	it('lists Zoom OAuth credentials with documented filters and enum values', async () => {
		const response = { next: null, previous: null, results: [credential] };
		const query = {
			account_id: 'account-1',
			created_at_after: timestamp,
			created_at_before: timestamp,
			cursor: 'cursor-5',
			meeting_sync_status: 'completed' as const,
			oauth_app: appId,
			ordering: 'created_at',
			status: 'healthy' as const,
			user_id: 'user-1',
		};
		request.mockResolvedValue(response);
		await expect(listZoomOAuthCredentials(ctx, query)).resolves.toEqual(
			response,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v2/zoom-oauth-credentials/',
			{ method: 'GET', query },
		);
	});

	it('creates a Zoom OAuth credential with the documented managed OAuth body', async () => {
		request.mockResolvedValue(credential);
		const body = {
			oauth_app: appId,
			authorization_code: {
				code: 'one-time-code',
				redirect_uri: 'https://example.test/callback',
			},
		};
		await expect(createZoomOAuthCredential(ctx, body)).resolves.toEqual(
			credential,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/api/v2/zoom-oauth-credentials/',
			{ method: 'POST', body },
		);
	});

	it('retrieves a Zoom OAuth credential by UUID', async () => {
		request.mockResolvedValue(credential);
		await expect(
			retrieveZoomOAuthCredential(ctx, { id: credentialId }),
		).resolves.toEqual(credential);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-credentials/${encodeURIComponent(credentialId)}/`,
			{ method: 'GET' },
		);
	});

	it('deletes a Zoom OAuth credential with a no-content response', async () => {
		request.mockResolvedValue(undefined);
		await expect(
			deleteZoomOAuthCredential(ctx, { id: credentialId }),
		).resolves.toBeUndefined();
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-credentials/${encodeURIComponent(credentialId)}/`,
			{ method: 'DELETE' },
		);
	});

	it('retrieves the credential access token with its expiry contract', async () => {
		const response = { token: 'zoom-access-token', expires_at: timestamp };
		request.mockResolvedValue(response);
		await expect(
			retrieveZoomOAuthCredentialAccessToken(ctx, { id: credentialId }),
		).resolves.toEqual(response);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-credentials/${encodeURIComponent(credentialId)}/access-token/`,
			{ method: 'GET' },
		);
	});

	it('manually resyncs credential meetings using the documented no-body POST', async () => {
		request.mockResolvedValue(undefined);
		await expect(
			syncZoomOAuthCredentialMeetings(ctx, { id: credentialId }),
		).resolves.toBeUndefined();
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-credentials/${encodeURIComponent(credentialId)}/sync-meetings/`,
			{ method: 'POST' },
		);
	});

	it('ignores an empty text body on the no-content POSTs', async () => {
		// corsair/http returns '' for an empty non-JSON 200.
		request.mockResolvedValue('');
		await expect(
			syncZoomOAuthCredentialMeetings(ctx, { id: credentialId }),
		).resolves.toBeUndefined();
		await expect(
			validateZoomOAuthCredential(ctx, { id: credentialId }),
		).resolves.toBeUndefined();
	});

	it('manually validates credentials using the documented no-body POST', async () => {
		request.mockResolvedValue(undefined);
		await expect(
			validateZoomOAuthCredential(ctx, { id: credentialId }),
		).resolves.toBeUndefined();
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/zoom-oauth-credentials/${encodeURIComponent(credentialId)}/validate/`,
			{ method: 'POST' },
		);
	});

	it('rejects invalid UUIDs and malformed responses before returning', async () => {
		request.mockReset();
		await expect(
			retrieveZoomOAuthApp(ctx, { id: '../other' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		request.mockResolvedValue({ bot_total: 'not-a-number' });
		await expect(retrieveBillingUsage(ctx, {})).rejects.toThrow();
	});

	it('sends the Recall Token authorization header through the region-aware helper', async () => {
		const actualHttpRequest = jest.mocked(sharedHttpRequest);
		actualHttpRequest.mockResolvedValue({ bot_total: 4 });
		const client = jest.requireActual<typeof import('./client')>('./client');
		await client.makeRecallaiContextRequest(
			{ key: 'recall-key', options: { region: 'eu-central-1' } },
			'/api/v1/billing/usage/',
			{ method: 'GET' },
		);
		expect(actualHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://eu-central-1.recall.ai',
				HEADERS: expect.objectContaining({
					Authorization: 'Token recall-key',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: '/api/v1/billing/usage/' }),
			expect.any(Object),
		);
	});
});
