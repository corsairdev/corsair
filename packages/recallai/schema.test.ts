import { recallai, recallaiEndpointSchemas } from './index';
import { RecallaiSchema } from './schema';
import { recallaiTestContext } from './test-context';

jest.mock('./client', () => {
	const makeRecallaiRequest = jest.fn();
	return {
		makeRecallaiRequest,
		makeRecallaiContextRequest: jest.fn((ctx, path, options) =>
			makeRecallaiRequest(path, ctx.key, options),
		),
	};
});

import { makeRecallaiRequest } from './client';

describe('Recall.ai schema', () => {
	it('declares a semver version and stores no local entities', () => {
		expect(RecallaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(RecallaiSchema.entities).toEqual({});
	});

	it('registers every implemented operation with executable contracts', () => {
		expect(Object.keys(recallaiEndpointSchemas)).toHaveLength(111);
		expect(Object.keys(recallaiEndpointSchemas)).toEqual(
			expect.arrayContaining([
				'bots.list',
				'bots.create',
				'bots.retrieve',
				'bots.update',
				'bots.delete',
				'botActions.deleteBotMedia',
				'botActions.leaveBotCall',
				'botActions.outputAudio',
				'botActions.stopOutputAudio',
				'botActions.outputMedia',
				'botActions.stopOutputMedia',
				'botActions.startScreenshare',
				'botActions.stopScreenshare',
				'botActions.outputVideo',
				'botActions.stopOutputVideo',
				'botActions.pauseRecording',
				'botActions.pinParticipant',
				'botActions.resumeRecording',
				'botActions.sendChatMessage',
				'botActions.startRecording',
				'botActions.stopRecording',
				'recordings.list',
				'recordings.retrieve',
				'recordings.update',
				'recordings.delete',
				'recordings.createTranscript',
				'realtimeEndpoints.list',
				'realtimeEndpoints.retrieve',
				'realtimeEndpoints.update',
				'sdkUploads.list',
				'meetingMetadata.list',
				'meetingMetadata.retrieve',
				'participantEvents.list',
				'participantEvents.retrieve',
				'participantEvents.update',
				'transcripts.list',
				'transcripts.retrieve',
				'audioMixed.list',
				'audioMixed.retrieve',
				'audioMixed.update',
				'audioMixed.delete',
				'audioSeparate.list',
				'audioSeparate.retrieve',
				'audioSeparate.update',
				'audioSeparate.delete',
				'videoMixed.list',
				'videoMixed.retrieve',
				'videoMixed.update',
				'videoMixed.delete',
				'videoSeparate.list',
				'videoSeparate.retrieve',
				'videoSeparate.update',
				'videoSeparate.delete',
				'calendar.authenticate',
				'calendar.listMeetings',
				'calendar.retrieveMeeting',
				'calendar.updateMeeting',
				'calendar.refreshMeetings',
				'calendar.retrieveUser',
				'calendar.updateUser',
				'calendar.deleteUser',
				'calendar.disconnectPlatform',
				'calendar.listUsers',
				'calendar.listEvents',
				'calendar.retrieveEvent',
				'calendar.scheduleBot',
				'calendar.unscheduleBot',
				'calendars.list',
				'calendars.create',
				'calendars.retrieve',
				'calendars.update',
				'calendars.delete',
				'calendars.createAccessToken',
				'googleLoginGroups.list',
				'googleLoginGroups.create',
				'googleLoginGroups.retrieve',
				'googleLoginGroups.update',
				'googleLoginGroups.partialUpdate',
				'googleLoginGroups.delete',
				'googleLogins.list',
				'googleLogins.create',
				'googleLogins.retrieve',
				'googleLogins.update',
				'googleLogins.partialUpdate',
				'googleLogins.delete',
				'billing.retrieveUsage',
				'meetingDirectConnects.list',
				'meetingDirectConnects.create',
				'meetingDirectConnects.retrieve',
				'zoomMeetingsToCredentials.list',
				'zoomOAuthAppLogs.list',
				'zoomOAuthApps.list',
				'zoomOAuthApps.create',
				'zoomOAuthApps.retrieve',
				'zoomOAuthApps.update',
				'zoomOAuthApps.delete',
				'zoomOAuthCredentialLogs.list',
				'zoomOAuthCredentials.list',
				'zoomOAuthCredentials.create',
				'zoomOAuthCredentials.retrieve',
				'zoomOAuthCredentials.delete',
				'zoomOAuthCredentials.retrieveAccessToken',
				'zoomOAuthCredentials.syncMeetings',
				'zoomOAuthCredentials.validate',
				'sdkUploads.create',
				'sdkUploads.retrieve',
				'meetingMetadata.update',
				'meetingMetadata.delete',
				'participantEvents.delete',
				'transcripts.update',
				'transcripts.delete',
			]),
		);
		for (const contract of Object.values(recallaiEndpointSchemas)) {
			expect(typeof contract.input.safeParse).toBe('function');
			expect(typeof contract.output.safeParse).toBe('function');
		}
	});

	it('validates required identifiers at the public endpoint boundary', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ count: 0, results: [] });
		const artifactId = '550e8400-e29b-41d4-a716-446655440000';
		const plugin = recallai({ key: 'recall-key' });
		const ctx = recallaiTestContext;
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.bots.retrieve(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.meetingMetadata.retrieve(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.participantEvents.retrieve(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.participantEvents.update(ctx, { id: 'x', metadata: {} }),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.meetingMetadata.update(ctx, { id: artifactId } as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.transcripts.update(ctx, { id: artifactId } as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.transcripts.retrieve(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
		await expect(plugin.endpoints.bots.list(ctx, {})).resolves.toEqual({
			count: 0,
			results: [],
		});
	});

	it('accepts ID-only inputs for every stop-output operation', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		request.mockResolvedValue(undefined);
		const plugin = recallai({ key: 'recall-key' });
		const ctx = recallaiTestContext;
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.botActions.stopOutputAudio(ctx, {
				id: '550e8400-e29b-41d4-a716-446655440000',
			}),
		).resolves.toBeUndefined();
		await expect(
			plugin.endpoints.botActions.stopScreenshare(ctx, {
				id: '550e8400-e29b-41d4-a716-446655440000',
			}),
		).resolves.toBeUndefined();
		await expect(
			plugin.endpoints.botActions.stopOutputVideo(ctx, {
				id: '550e8400-e29b-41d4-a716-446655440000',
			}),
		).resolves.toBeUndefined();

		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/bot/550e8400-e29b-41d4-a716-446655440000/output_audio/',
			'recall-key',
			{ method: 'DELETE' },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/api/v1/bot/550e8400-e29b-41d4-a716-446655440000/output_screenshare/',
			'recall-key',
			{ method: 'DELETE' },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			'/api/v1/bot/550e8400-e29b-41d4-a716-446655440000/output_video/',
			'recall-key',
			{ method: 'DELETE' },
		);
	});

	it('validates calendar and media inputs before calling Recall', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockReset();
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;

		await expect(
			plugin.endpoints.calendar.listEvents(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.calendar.retrieveMeeting(ctx, {
				id: '../bad',
				calendar_auth_token: 'scoped-calendar-token',
			}),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.calendar.scheduleBot(ctx, {
				id: '550e8400-e29b-41d4-a716-446655440000',
				deduplication_key: '',
				bot_config: {},
			}),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.audioMixed.retrieve(ctx, { id: '../bad' } as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.audioSeparate.update(ctx, {
				id: '550e8400-e29b-41d4-a716-446655440000',
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('keeps response enums open to values Recall adds later', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;
		const uuid = '550e8400-e29b-41d4-a716-446655440000';
		const stamp = '2026-01-01T00:00:00Z';

		request.mockResolvedValueOnce({
			id: uuid,
			name: 'Group',
			login_mode: 'round_robin',
			created_at: stamp,
			updated_at: stamp,
			logins: [],
		});
		await expect(
			plugin.endpoints.googleLoginGroups.retrieve(ctx, { id: uuid }),
		).resolves.toMatchObject({ login_mode: 'round_robin' });

		request.mockResolvedValueOnce({
			id: uuid,
			oauth_app: uuid,
			status: 'revoked',
			user_id: null,
			account_id: null,
			access_token_callback_url: null,
			created_at: stamp,
			meeting_sync_status: 'queued',
		});
		await expect(
			plugin.endpoints.zoomOAuthCredentials.retrieve(ctx, { id: uuid }),
		).resolves.toMatchObject({
			status: 'revoked',
			meeting_sync_status: 'queued',
		});

		request.mockResolvedValueOnce({
			id: uuid,
			oauth_client_id: 'client',
			oauth_refresh_token: 'refresh',
			platform: 'zoho_calendar',
			platform_email: null,
			status: 'paused',
			status_changes: [{ status: 'paused', created_at: stamp, reason: 'x' }],
			created_at: stamp,
			updated_at: stamp,
		});
		await expect(
			plugin.endpoints.calendars.retrieve(ctx, { id: uuid }),
		).resolves.toMatchObject({ platform: 'zoho_calendar' });
	});
});
