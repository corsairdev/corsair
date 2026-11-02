import { recallai, recallaiEndpointSchemas } from './index';
import { RecallaiSchema } from './schema';
import { recallaiTestContext } from './test-context';

jest.mock('./client', () => ({
	makeRecallaiRequest: jest.fn(),
}));

import { makeRecallaiRequest } from './client';

describe('Recall.ai schema', () => {
	it('declares a semver version and workspace entity', () => {
		expect(RecallaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(RecallaiSchema.entities.recallaiWorkspace).toBeDefined();
	});

	it('registers every implemented operation with executable contracts', () => {
		expect(Object.keys(recallaiEndpointSchemas)).toHaveLength(74);
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
});
