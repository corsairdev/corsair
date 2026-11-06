import { recallai } from './index';

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

const BOT_ID = bot.id;
const botPath = (action: string) => `/api/v1/bot/${BOT_ID}/${action}/`;

describe('Recall.ai bot endpoints', () => {
	it('routes bot media and output actions to the documented paths', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(bot);
		await deleteBotMedia(recallaiTestContext, { id: BOT_ID });
		await outputAudio(recallaiTestContext, {
			id: BOT_ID,
			kind: 'mp3',
			b64_data: 'YQ==',
		});
		request.mockResolvedValueOnce(undefined);
		await stopOutputVideo(recallaiTestContext, { id: BOT_ID });
		expect(request).toHaveBeenNthCalledWith(
			1,
			botPath('delete_media'),
			'recall-key',
			{ method: 'POST' },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			botPath('output_audio'),
			'recall-key',
			{ method: 'POST', body: { kind: 'mp3', b64_data: 'YQ==' } },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			botPath('output_video'),
			'recall-key',
			{ method: 'DELETE' },
		);
	});

	it('sends participant and chat payloads without mixing bot and participant IDs', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(bot);
		await pinParticipant(recallaiTestContext, {
			bot_id: BOT_ID,
			participant_id: 42,
		});
		await sendChatMessage(recallaiTestContext, {
			id: BOT_ID,
			message: 'hello',
			pin: true,
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			botPath('pin_participant'),
			'recall-key',
			{ method: 'POST', body: { id: 42 } },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			botPath('send_chat_message'),
			'recall-key',
			{ method: 'POST', body: { message: 'hello', pin: true } },
		);
	});

	it('returns the updated bot from every action POST and nothing from the stop calls', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		// Recall answers every action POST with the bot and every stop DELETE
		// with 204 (no body).
		request.mockImplementation(async (_path, _key, options) =>
			options?.method === 'DELETE' ? undefined : bot,
		);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const actions = plugin.endpoints.botActions;
		const ctx = recallaiTestContext;

		const responses = [
			await actions.deleteBotMedia(ctx, { id: BOT_ID }),
			await actions.leaveBotCall(ctx, { id: BOT_ID }),
			await actions.outputAudio(ctx, {
				id: BOT_ID,
				kind: 'mp3',
				b64_data: 'YQ==',
			}),
			await actions.stopOutputAudio(ctx, { id: BOT_ID }),
			await actions.outputMedia(ctx, {
				id: BOT_ID,
				camera: { kind: 'webpage', config: { url: 'https://example.com' } },
			}),
			await actions.stopOutputMedia(ctx, {
				id: BOT_ID,
				camera: true,
				screenshare: false,
			}),
			await actions.startScreenshare(ctx, {
				id: BOT_ID,
				kind: 'jpeg',
				b64_data: 'YQ==',
			}),
			await actions.stopScreenshare(ctx, { id: BOT_ID }),
			await actions.outputVideo(ctx, {
				id: BOT_ID,
				kind: 'jpeg',
				b64_data: 'YQ==',
			}),
			await actions.stopOutputVideo(ctx, { id: BOT_ID }),
			await actions.pauseRecording(ctx, { id: BOT_ID }),
			await actions.pinParticipant(ctx, { bot_id: BOT_ID, participant_id: 42 }),
			await actions.resumeRecording(ctx, { id: BOT_ID }),
			await actions.sendChatMessage(ctx, { id: BOT_ID, message: 'hello' }),
			await actions.startRecording(ctx, {
				id: BOT_ID,
				recording_config: {
					transcript: { provider: { recallai_streaming: {} } },
				},
			}),
			await actions.stopRecording(ctx, { id: BOT_ID }),
		];
		const stopIndexes = new Set([3, 5, 7, 9]);
		responses.forEach((response, index) => {
			if (stopIndexes.has(index)) expect(response).toBeUndefined();
			else expect(response).toEqual(bot);
		});

		const expectedRoutes = [
			[botPath('delete_media'), { method: 'POST' }],
			[botPath('leave_call'), { method: 'POST' }],
			[
				botPath('output_audio'),
				{ method: 'POST', body: { kind: 'mp3', b64_data: 'YQ==' } },
			],
			[botPath('output_audio'), { method: 'DELETE' }],
			[
				botPath('output_media'),
				{
					method: 'POST',
					body: {
						camera: { kind: 'webpage', config: { url: 'https://example.com' } },
					},
				},
			],
			[
				botPath('output_media'),
				{ method: 'DELETE', body: { camera: true, screenshare: false } },
			],
			[
				botPath('output_screenshare'),
				{ method: 'POST', body: { kind: 'jpeg', b64_data: 'YQ==' } },
			],
			[botPath('output_screenshare'), { method: 'DELETE' }],
			[
				botPath('output_video'),
				{ method: 'POST', body: { kind: 'jpeg', b64_data: 'YQ==' } },
			],
			[botPath('output_video'), { method: 'DELETE' }],
			[botPath('pause_recording'), { method: 'POST' }],
			[botPath('pin_participant'), { method: 'POST', body: { id: 42 } }],
			[botPath('resume_recording'), { method: 'POST' }],
			[
				botPath('send_chat_message'),
				{ method: 'POST', body: { message: 'hello' } },
			],
			[
				botPath('start_recording'),
				{
					method: 'POST',
					body: { transcript: { provider: { recallai_streaming: {} } } },
				},
			],
			[botPath('stop_recording'), { method: 'POST' }],
		] as const;

		for (const [index, [path, options]] of expectedRoutes.entries()) {
			expect(request).toHaveBeenNthCalledWith(
				index + 1,
				path,
				'recall-key',
				options,
			);
		}
	});

	it('requires the outputs to stop and the media kind Recall accepts', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const actions = plugin.endpoints.botActions;
		await expect(
			actions.stopOutputMedia(recallaiTestContext, { id: BOT_ID } as never),
		).rejects.toThrow();
		await expect(
			actions.outputVideo(recallaiTestContext, {
				id: BOT_ID,
				kind: 'mp4',
				b64_data: 'YQ==',
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe action identifiers before transport', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		for (const id of ['../secret', '..', '.', 'bot-1']) {
			await expect(
				deleteBotMedia(recallaiTestContext, { id }),
			).rejects.toThrow();
		}
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

	it('reads meeting metadata with validated inputs and response assertions', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const response = {
			next: null,
			previous: null,
			results: [artifact],
		};
		request.mockResolvedValueOnce(response).mockResolvedValueOnce(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.meetingMetadata.list(ctx, {
				recording_id: artifact.recording.id,
				status_code: 'done',
			}),
		).resolves.toEqual(response);
		await expect(
			plugin.endpoints.meetingMetadata.retrieve(ctx, { id: artifact.id }),
		).resolves.toEqual(artifact);
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/meeting_metadata/',
			'recall-key',
			{
				method: 'GET',
				query: {
					recording_id: artifact.recording.id,
					status_code: 'done',
				},
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/meeting_metadata/${artifact.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
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

describe('Recall.ai calendar user paging', () => {
	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());

	it('fetches a later page of calendar users', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const page = {
			count: 120,
			next: 'https://us-west-2.recall.ai/api/v1/calendar/users/?page=3&paginate=true',
			previous:
				'https://us-west-2.recall.ai/api/v1/calendar/users/?paginate=true',
			results: [{ id: '550e8400-e29b-41d4-a716-446655440020' }],
		};
		request.mockResolvedValue(page);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.calendar.listUsers(recallaiTestContext, {
				paginate: true,
				page: 2,
			}),
		).resolves.toEqual(page);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/calendar/users/',
			'recall-key',
			{ method: 'GET', query: { paginate: true, page: 2 } },
		);
	});

	it('rejects a page number without paginate, which Recall would ignore', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await expect(
			plugin.endpoints.calendar.listUsers(recallaiTestContext, { page: 2 }),
		).rejects.toThrow('page only applies with paginate: true');
		expect(request).not.toHaveBeenCalled();
	});
});
