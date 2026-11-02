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
		await deleteBotMedia({ key: 'recall-key' }, { id: 'bot-1' });
		await outputAudio(
			{ key: 'recall-key' },
			{ id: 'bot-1', kind: 'mp3', b64_data: 'YQ==' },
		);
		await stopOutputVideo({ key: 'recall-key' }, { id: 'bot-1' });
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
		await pinParticipant(
			{ key: 'recall-key' },
			{ bot_id: 'bot-1', participant_id: 42 },
		);
		await sendChatMessage(
			{ key: 'recall-key' },
			{ id: 'bot-1', message: 'hello', pin: true },
		);
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
			deleteBotMedia({ key: 'recall-key' }, { id: '../secret' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	beforeEach(() => jest.mocked(makeRecallaiRequest).mockReset());
	it('lists bots with filters and the Recall authorization header', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ count: 1, results: [bot] });

		const plugin = recallai({ key: 'recall-key' });
		const ctx = { key: 'recall-key' } as never;
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
			plugin.endpoints.bots.create({ key: 'recall-key' } as never, input),
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
		const ctx = { key: 'recall-key' } as never;
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
	const ctx = { key: 'recall-key' } as never;
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
