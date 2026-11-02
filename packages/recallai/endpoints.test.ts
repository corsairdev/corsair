import { recallai } from './index';

jest.mock('./client', () => ({
	makeRecallaiRequest: jest.fn(),
}));

import { makeRecallaiRequest } from './client';
import {
	deleteBotMedia,
	outputAudio,
	pinParticipant,
	sendChatMessage,
	stopOutputVideo,
} from './endpoints/bots';
import { recallaiTestContext } from './test-context';

const bot = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	meeting_url: 'https://meet.google.com/example',
	bot_name: 'Meeting Notetaker',
};

const artifact = {
	id: '550e8400-e29b-41d4-a716-446655440010',
	recording: { id: '550e8400-e29b-41d4-a716-446655440011' },
	created_at: '2026-01-01T00:00:00.000Z',
	status: {
		code: 'done',
		sub_code: null,
		updated_at: '2026-01-01T00:00:00.000Z',
	},
	metadata: {},
	data: { download_url: 'https://downloads.example.test/artifact.json' },
};

describe('Recall.ai bot endpoints', () => {
	it('routes bot media and output actions to the documented paths', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(undefined);
		await deleteBotMedia(recallaiTestContext, { id: 'bot-1' });
		await outputAudio(recallaiTestContext, {
			id: 'bot-1',
			kind: 'mp3',
			b64_data: 'YQ==',
		});
		await stopOutputVideo(recallaiTestContext, { id: 'bot-1' });
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/bot/bot-1/delete_media/',
			'recall-key',
			{ method: 'POST' },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/api/v1/bot/bot-1/output_audio/',
			'recall-key',
			{ method: 'POST', body: { kind: 'mp3', b64_data: 'YQ==' } },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			'/api/v1/bot/bot-1/output_video/',
			'recall-key',
			{ method: 'DELETE' },
		);
	});

	it('sends participant and chat payloads without mixing bot and participant IDs', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(undefined);
		await pinParticipant(recallaiTestContext, {
			bot_id: 'bot-1',
			participant_id: 42,
		});
		await sendChatMessage(recallaiTestContext, {
			id: 'bot-1',
			message: 'hello',
			pin: true,
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/bot/bot-1/pin_participant/',
			'recall-key',
			{ method: 'POST', body: { id: 42 } },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/api/v1/bot/bot-1/send_chat_message/',
			'recall-key',
			{ method: 'POST', body: { to: undefined, message: 'hello', pin: true } },
		);
	});

	it('rejects unsafe action identifiers before transport', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		await expect(
			deleteBotMedia(recallaiTestContext, { id: '../secret' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());
	it('lists bots with filters and the Recall authorization header', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ count: 1, results: [bot] });

		const plugin = recallai({ key: 'recall-key' });
		const ctx = recallaiTestContext;
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await expect(
			plugin.endpoints.bots.list(ctx, { page: 2, status: ['done'] }),
		).resolves.toEqual({
			count: 1,
			results: [bot],
		});
		expect(request).toHaveBeenCalledWith('/api/v1/bot/', 'recall-key', {
			method: 'GET',
			query: { page: 2, status: ['done'] },
		});
	});

	it('creates a bot with the documented request body', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(bot);
		const input = {
			meeting_url: 'https://meet.google.com/example',
			bot_name: 'Notes',
		};

		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await expect(
			plugin.endpoints.bots.create(recallaiTestContext, input),
		).resolves.toEqual(bot);
		expect(request).toHaveBeenCalledWith('/api/v1/bot/', 'recall-key', {
			method: 'POST',
			body: input,
		});
	});

	it('encodes bot identifiers and preserves mutation methods', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(bot);
		const plugin = recallai({ key: 'recall-key' });
		const ctx = recallaiTestContext;
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await plugin.endpoints.bots.retrieve(ctx, {
			id: '550e8400-e29b-41d4-a716-446655440000',
		});
		await plugin.endpoints.bots.update(ctx, {
			id: bot.id,
			bot_name: 'Updated',
		});
		await plugin.endpoints.bots.delete(ctx, { id: bot.id });

		expect(request).toHaveBeenNthCalledWith(
			1,
			`/api/v1/bot/${bot.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/bot/${bot.id}/`,
			'recall-key',
			{
				method: 'PATCH',
				body: { bot_name: 'Updated' },
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			`/api/v1/bot/${bot.id}/`,
			'recall-key',
			{ method: 'DELETE' },
		);
	});

	it('rejects unsafe identifiers before making a request', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await expect(
			plugin.endpoints.bots.retrieve({ key: 'recall-key' } as never, {
				id: '../secret',
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});

describe('Recall.ai artifact endpoints', () => {
	const ctx = recallaiTestContext;
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());

	it('lists transcripts with exact filters and path', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const response = { next: null, previous: null, results: [artifact] };
		request.mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.transcripts.list(ctx, {
				recording_id: artifact.recording.id,
				status_code: 'done',
				cursor: 'cursor-1',
			}),
		).resolves.toEqual(response);
		expect(request).toHaveBeenCalledWith('/api/v1/transcript/', 'recall-key', {
			method: 'GET',
			query: {
				recording_id: artifact.recording.id,
				status_code: 'done',
				cursor: 'cursor-1',
			},
		});
	});

	it('retrieves transcripts with an encoded artifact id', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.transcripts.retrieve(ctx, { id: artifact.id }),
		).resolves.toEqual(artifact);
		expect(request).toHaveBeenCalledWith(
			`/api/v1/transcript/${artifact.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
	});

	it('lists participant events with exact filters and path', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const response = { next: null, previous: null, results: [artifact] };
		request.mockResolvedValue(response);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.participantEvents.list(ctx, {
				created_at_after: '2026-01-01T00:00:00.000Z',
				status_code: 'processing',
			}),
		).resolves.toEqual(response);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/participant_events/',
			'recall-key',
			{
				method: 'GET',
				query: {
					created_at_after: '2026-01-01T00:00:00.000Z',
					status_code: 'processing',
				},
			},
		);
	});

	it('retrieves and updates participant events with exact methods and paths', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await plugin.endpoints.participantEvents.retrieve(ctx, { id: artifact.id });
		await plugin.endpoints.participantEvents.update(ctx, {
			id: artifact.id,
			metadata: { source: 'test' },
		});

		expect(request).toHaveBeenNthCalledWith(
			1,
			`/api/v1/participant_events/${artifact.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/participant_events/${artifact.id}/`,
			'recall-key',
			{
				method: 'PATCH',
				body: { metadata: { source: 'test' } },
			},
		);
	});

	it('rejects unsafe artifact ids before making a request', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockReset();
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.transcripts.retrieve(ctx, { id: '../secret' }),
		).rejects.toThrow();
		await expect(
			plugin.endpoints.participantEvents.update(ctx, {
				id: 'a/b',
				metadata: {},
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});

describe('Recall.ai media artifacts', () => {
	const ctx = recallaiTestContext;
	const id = '550e8400-e29b-41d4-a716-446655440000';
	const media = { id, metadata: { source: 'test' } };
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());

	it.each([
		['audioMixed', 'audio_mixed'],
		['audioSeparate', 'audio_separate'],
		['videoMixed', 'video_mixed'],
		['videoSeparate', 'video_separate'],
	] as const)('routes all %s artifact operations', async (group, resource) => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValueOnce({ count: 1, results: [media] });
		request.mockResolvedValueOnce(media);
		request.mockResolvedValueOnce(media);
		request.mockResolvedValueOnce(undefined);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const endpoints = plugin.endpoints[group];
		await expect(endpoints.list(ctx, { recording_id: id })).resolves.toEqual({
			count: 1,
			results: [media],
		});
		await expect(endpoints.retrieve(ctx, { id })).resolves.toEqual(media);
		await expect(
			endpoints.update(ctx, { id, metadata: { source: 'test' } }),
		).resolves.toEqual(media);
		await expect(endpoints.delete(ctx, { id })).resolves.toBeUndefined();
		expect(request).toHaveBeenNthCalledWith(
			1,
			`/api/v1/${resource}/`,
			'recall-key',
			{
				method: 'GET',
				query: {
					cursor: undefined,
					created_at_after: undefined,
					created_at_before: undefined,
					recording_id: id,
					status_code: undefined,
				},
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/${resource}/${id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			`/api/v1/${resource}/${id}/`,
			'recall-key',
			{ method: 'PATCH', body: { metadata: { source: 'test' } } },
		);
		expect(request).toHaveBeenNthCalledWith(
			4,
			`/api/v1/${resource}/${id}/`,
			'recall-key',
			{ method: 'DELETE' },
		);
	});
});

describe('Recall.ai calendar operations', () => {
	const ctx = recallaiTestContext;
	const id = '550e8400-e29b-41d4-a716-446655440000';
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());

	it('routes calendar v1 and v2 operations with their documented verbs', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request
			.mockResolvedValueOnce({ token: 'calendar-token' })
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce(undefined)
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({ next: null, results: [] })
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce({ id })
			.mockResolvedValueOnce({ id });
		const calendarAuth = 'scoped-calendar-token';
		const calendarHeaders = {
			headers: { 'x-recallcalendarauthtoken': calendarAuth },
		};
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const endpoints = plugin.endpoints.calendar;
		await endpoints.authenticate(ctx, { user_id: 'external-user' });
		await endpoints.listMeetings(ctx, {
			calendar_auth_token: calendarAuth,
			ical_uid: 'meeting-1',
		});
		await endpoints.retrieveMeeting(ctx, {
			id,
			calendar_auth_token: calendarAuth,
		});
		await endpoints.updateMeeting(ctx, {
			id,
			calendar_auth_token: calendarAuth,
			override_should_record: true,
		});
		await endpoints.refreshMeetings(ctx, { calendar_auth_token: calendarAuth });
		await endpoints.retrieveUser(ctx, { calendar_auth_token: calendarAuth });
		await endpoints.updateUser(ctx, {
			calendar_auth_token: calendarAuth,
			external_id: 'external-user',
		});
		await endpoints.deleteUser(ctx, { calendar_auth_token: calendarAuth });
		await endpoints.disconnectPlatform(ctx, {
			calendar_auth_token: calendarAuth,
			platform: 'google',
		});
		await endpoints.listUsers(ctx, { email: 'user@example.com' });
		await endpoints.listEvents(ctx, { calendar_id: id, is_deleted: false });
		await endpoints.retrieveEvent(ctx, { id });
		await endpoints.scheduleBot(ctx, {
			id,
			deduplication_key: 'event-bot-1',
			bot_config: { meeting_url: 'https://meet.google.com/example' },
		});
		await endpoints.unscheduleBot(ctx, { id });

		expect(
			request.mock.calls.map(([path, , options]) => [path, options]),
		).toEqual([
			[
				'/api/v1/calendar/authenticate/',
				{ method: 'POST', body: { user_id: 'external-user' } },
			],
			[
				'/api/v1/calendar/meetings/',
				{ method: 'GET', query: { ical_uid: 'meeting-1' }, ...calendarHeaders },
			],
			[`/api/v1/calendar/meetings/${id}/`, calendarHeaders],
			[
				`/api/v1/calendar/meetings/${id}/`,
				{
					method: 'PUT',
					body: { override_should_record: true },
					...calendarHeaders,
				},
			],
			[
				'/api/v1/calendar/meetings/refresh/',
				{ method: 'POST', ...calendarHeaders },
			],
			['/api/v1/calendar/user/', calendarHeaders],
			[
				'/api/v1/calendar/user/',
				{
					method: 'PUT',
					body: { external_id: 'external-user' },
					...calendarHeaders,
				},
			],
			['/api/v1/calendar/user/', { method: 'DELETE', ...calendarHeaders }],
			[
				'/api/v1/calendar/user/disconnect/',
				{ method: 'POST', body: { platform: 'google' }, ...calendarHeaders },
			],
			[
				'/api/v1/calendar/users/',
				{ method: 'GET', query: { email: 'user@example.com' } },
			],
			[
				'/api/v2/calendar-events/',
				{ method: 'GET', query: { calendar_id: id, is_deleted: false } },
			],
			[`/api/v2/calendar-events/${id}/`, {}],
			[
				`/api/v2/calendar-events/${id}/bot/`,
				{
					method: 'POST',
					body: {
						deduplication_key: 'event-bot-1',
						bot_config: { meeting_url: 'https://meet.google.com/example' },
					},
				},
			],
			[`/api/v2/calendar-events/${id}/bot/`, { method: 'DELETE' }],
		]);
	});
});

describe('Recall.ai remaining artifact operations', () => {
	const ctx = recallaiTestContext;
	const id = '550e8400-e29b-41d4-a716-446655440000';
	const artifact = { id, metadata: { source: 'test' } };
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());

	it('routes SDK upload create and retrieve', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await plugin.endpoints.sdkUploads.create(ctx, {
			_1080p: true,
			metadata: { source: 'test' },
		});
		await plugin.endpoints.sdkUploads.retrieve(ctx, { id });
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/sdk_upload/',
			'recall-key',
			{
				method: 'POST',
				body: { _1080p: true, metadata: { source: 'test' } },
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/sdk_upload/${id}/`,
			'recall-key',
			{ method: 'GET' },
		);
	});

	it('routes update and delete methods for metadata, participant events, and transcripts', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await plugin.endpoints.meetingMetadata.update(ctx, {
			id,
			metadata: { source: 'test' },
		});
		await plugin.endpoints.meetingMetadata.delete(ctx, { id });
		await plugin.endpoints.participantEvents.delete(ctx, { id });
		await plugin.endpoints.transcripts.update(ctx, {
			id,
			metadata: { source: 'test' },
		});
		await plugin.endpoints.transcripts.delete(ctx, { id });
		expect(
			request.mock.calls.map(([path, , options]) => [path, options]),
		).toEqual([
			[
				`/api/v1/meeting_metadata/${id}/`,
				{ method: 'PATCH', body: { metadata: { source: 'test' } } },
			],
			[`/api/v1/meeting_metadata/${id}/`, { method: 'DELETE' }],
			[`/api/v1/participant_events/${id}/`, { method: 'DELETE' }],
			[
				`/api/v1/transcript/${id}/`,
				{ method: 'PATCH', body: { metadata: { source: 'test' } } },
			],
			[`/api/v1/transcript/${id}/`, { method: 'DELETE' }],
		]);
	});
});
