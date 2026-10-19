import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Chat,
	Files,
	Image,
	Models,
	Music,
	Speech,
	Video,
	Voice,
} from './endpoints';
import type { MinimaxEndpointInputs } from './endpoints/types';
import type { MinimaxContext } from './index';
import { minimax, minimaxEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMinimaxRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMinimaxRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Chat.completion>[0];

function buildCtx(): Ctx {
	const ctx: MinimaxContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

// CorsairEndpoint parameters are bivariant, so a context-bound endpoint can be
// reached through this looser (also bivariant) signature to feed deliberately
// invalid payloads without a type assertion.
type LooseEndpoint = {
	bivarianceHack(ctx: Ctx, input: unknown): Promise<unknown>;
}['bivarianceHack'];

function invokeWith(endpoint: LooseEndpoint, input: unknown): Promise<unknown> {
	return endpoint(ctx, input);
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the published OpenAPI specs under
// https://platform.minimax.io/docs/api-reference.

describe('chat.completion', () => {
	it('sends the validated body and returns the parsed completion', async () => {
		const input: MinimaxEndpointInputs['chatCompletion'] = {
			model: 'MiniMax-M2',
			messages: [{ role: 'user', content: 'hi' }],
		};
		const response = {
			id: 'chat-1',
			choices: [{ message: { role: 'assistant', content: 'hello' } }],
			base_resp: { status_code: 0 },
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Chat.completion(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/text/chatcompletion_v2',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.chat.completion',
			{ model: 'MiniMax-M2', messageCount: 1 },
			'completed',
		);
	});

	it('rejects empty messages before calling the API', async () => {
		await expect(
			invokeWith(Chat.completion, { model: 'MiniMax-M2', messages: [] }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('rejects stream: true before calling the API', async () => {
		await expect(
			invokeWith(Chat.completion, {
				model: 'MiniMax-M2',
				messages: [{ role: 'user', content: 'hi' }],
				stream: true,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts stream: false and an omitted stream', async () => {
		mockedRequest.mockResolvedValue({ id: 'chat-1' });

		await Chat.completion(ctx, {
			model: 'MiniMax-M2',
			messages: [{ role: 'user', content: 'hi' }],
			stream: false,
		});
		await Chat.completion(ctx, {
			model: 'MiniMax-M2',
			messages: [{ role: 'user', content: 'hi' }],
		});

		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});
});

describe('chat.createResponse', () => {
	it('sends the input and returns the parsed response', async () => {
		const input: MinimaxEndpointInputs['chatCreateResponse'] = {
			model: 'MiniMax-M2',
			input: 'hello',
		};
		const response = { id: 'resp-1', status: 'completed', output_text: 'hi' };
		mockedRequest.mockResolvedValue(response);

		const result = await Chat.createResponse(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/responses',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.chat.createResponse',
			{ model: 'MiniMax-M2', status: 'completed' },
			'completed',
		);
	});

	it('rejects an empty model before calling the API', async () => {
		await expect(
			invokeWith(Chat.createResponse, { model: '', input: 'hi' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects stream: true before calling the API', async () => {
		await expect(
			invokeWith(Chat.createResponse, {
				model: 'MiniMax-M2',
				input: 'hi',
				stream: true,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts stream: false and an omitted stream', async () => {
		mockedRequest.mockResolvedValue({ id: 'resp-1', status: 'completed' });

		await Chat.createResponse(ctx, {
			model: 'MiniMax-M2',
			input: 'hi',
			stream: false,
		});
		await Chat.createResponse(ctx, { model: 'MiniMax-M2', input: 'hi' });

		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});
});

describe('chat.estimateInputTokens', () => {
	it('sends the input and returns the token estimate', async () => {
		const input: MinimaxEndpointInputs['chatEstimateInputTokens'] = {
			model: 'MiniMax-M2',
			input: 'hello',
		};
		const response = { object: 'response.input_tokens', input_tokens: 5 };
		mockedRequest.mockResolvedValue(response);

		const result = await Chat.estimateInputTokens(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/responses/input_tokens',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.chat.estimateInputTokens',
			{ model: 'MiniMax-M2', inputTokens: 5 },
			'completed',
		);
	});

	it('rejects an empty model before calling the API', async () => {
		await expect(
			invokeWith(Chat.estimateInputTokens, { model: '', input: 'hi' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects stream: true before calling the API', async () => {
		await expect(
			invokeWith(Chat.estimateInputTokens, {
				model: 'MiniMax-M2',
				input: 'hi',
				stream: true,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts stream: false and an omitted stream', async () => {
		mockedRequest.mockResolvedValue({
			object: 'response.input_tokens',
			input_tokens: 5,
		});

		await Chat.estimateInputTokens(ctx, {
			model: 'MiniMax-M2',
			input: 'hi',
			stream: false,
		});
		await Chat.estimateInputTokens(ctx, { model: 'MiniMax-M2', input: 'hi' });

		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});
});

describe('speech.t2a', () => {
	it('sends the text and returns the synthesized audio payload', async () => {
		const input: MinimaxEndpointInputs['speechT2a'] = {
			model: 'speech-2.6-hd',
			text: 'hello',
		};
		const response = { data: { audio: 'aGVsbG8=' } };
		mockedRequest.mockResolvedValue(response);

		const result = await Speech.t2a(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/t2a_v2', 'test-api-key', {
			method: 'POST',
			body: input,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.speech.t2a',
			{ model: 'speech-2.6-hd', characters: 5 },
			'completed',
		);
	});

	it('rejects empty text before calling the API', async () => {
		await expect(
			invokeWith(Speech.t2a, { model: 'speech-2.6-hd', text: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('speech.createAsyncTask', () => {
	it('sends the task input and returns the task id', async () => {
		const input: MinimaxEndpointInputs['speechCreateAsyncTask'] = {
			model: 'speech-2.6-hd',
			text: 'a long passage',
			voice_setting: { voice_id: 'v1' },
		};
		const response = { task_id: 'task-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Speech.createAsyncTask(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/t2a_async_v2',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.speech.createAsyncTask',
			{ model: 'speech-2.6-hd', characters: 14, hasFileInput: false },
			'completed',
		);
	});

	it('rejects input without text or text_file_id', async () => {
		await expect(
			invokeWith(Speech.createAsyncTask, {
				model: 'speech-2.6-hd',
				voice_setting: { voice_id: 'v1' },
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects input with both text and text_file_id', async () => {
		await expect(
			invokeWith(Speech.createAsyncTask, {
				model: 'speech-2.6-hd',
				text: 'a long passage',
				text_file_id: 1,
				voice_setting: { voice_id: 'v1' },
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts the text_file_id input mode', async () => {
		const input: MinimaxEndpointInputs['speechCreateAsyncTask'] = {
			model: 'speech-2.6-hd',
			text_file_id: 1,
			voice_setting: { voice_id: 'v1' },
		};
		mockedRequest.mockResolvedValue({ task_id: 'task-2' });

		const result = await Speech.createAsyncTask(ctx, input);

		expect(result).toEqual({ task_id: 'task-2' });
	});
});

describe('speech.queryAsyncTask', () => {
	it('queries the task status', async () => {
		const input: MinimaxEndpointInputs['speechQueryAsyncTask'] = {
			task_id: 'task-1',
		};
		const response = { task_id: 'task-1', status: 'success' };
		mockedRequest.mockResolvedValue(response);

		const result = await Speech.queryAsyncTask(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/query/t2a_async_query_v2',
			'test-api-key',
			{ method: 'GET', query: { task_id: 'task-1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.speech.queryAsyncTask',
			{ status: 'success' },
			'completed',
		);
	});

	it('rejects an empty task id before calling the API', async () => {
		await expect(
			invokeWith(Speech.queryAsyncTask, { task_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts the capitalised status documented by MiniMax', async () => {
		const input: MinimaxEndpointInputs['speechQueryAsyncTask'] = {
			task_id: 'task-1',
		};
		const response = { task_id: 'task-1', status: 'Processing' };
		mockedRequest.mockResolvedValue(response);

		const result = await Speech.queryAsyncTask(ctx, input);

		expect(result).toEqual(response);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.speech.queryAsyncTask',
			{ status: 'Processing' },
			'completed',
		);
	});
});

describe('voice.list', () => {
	it('lists voices for the requested type', async () => {
		const input: MinimaxEndpointInputs['voiceList'] = { voice_type: 'system' };
		const response = { system_voice: [{ voice_id: 'v1' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Voice.list(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/get_voice',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.voice.list',
			{ voiceType: 'system', count: 1 },
			'completed',
		);
	});

	it('rejects an unknown voice type', async () => {
		await expect(
			invokeWith(Voice.list, { voice_type: 'not-a-type' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('voice.clone', () => {
	it('clones a voice from an uploaded file', async () => {
		const input: MinimaxEndpointInputs['voiceClone'] = {
			file_id: 1,
			voice_id: 'v1',
		};
		const response = { demo_audio: 'aGVsbG8=' };
		mockedRequest.mockResolvedValue(response);

		const result = await Voice.clone(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/voice_clone',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.voice.clone',
			{ voiceId: 'v1' },
			'completed',
		);
	});

	it('rejects a non-integer file id before calling the API', async () => {
		await expect(
			invokeWith(Voice.clone, { file_id: 1.5, voice_id: 'v1' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('voice.design', () => {
	it('designs a voice and returns its id', async () => {
		const input: MinimaxEndpointInputs['voiceDesign'] = {
			prompt: 'a warm narrator',
			preview_text: 'hello',
		};
		const response = { voice_id: 'v2' };
		mockedRequest.mockResolvedValue(response);

		const result = await Voice.design(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/voice_design',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.voice.design',
			{ voiceId: 'v2' },
			'completed',
		);
	});

	it('rejects an empty prompt before calling the API', async () => {
		await expect(
			invokeWith(Voice.design, { prompt: '', preview_text: 'hi' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('voice.delete', () => {
	it('deletes a generated voice', async () => {
		const input: MinimaxEndpointInputs['voiceDelete'] = {
			voice_type: 'voice_cloning',
			voice_id: 'v1',
		};
		const response = { voice_id: 'v1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Voice.delete(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/delete_voice',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.voice.delete',
			{ voiceType: 'voice_cloning', voiceId: 'v1' },
			'completed',
		);
	});

	it('rejects an empty voice id before calling the API', async () => {
		await expect(
			invokeWith(Voice.delete, { voice_type: 'voice_cloning', voice_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('music.generate', () => {
	it('generates a song and returns the audio payload', async () => {
		const input: MinimaxEndpointInputs['musicGenerate'] = {
			model: 'music-3.0',
			prompt: 'upbeat pop',
		};
		const response = { data: { status: 2, audio: 'aGVsbG8=' } };
		mockedRequest.mockResolvedValue(response);

		const result = await Music.generate(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/music_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.music.generate',
			{ model: 'music-3.0', hasLyrics: false, instrumental: false },
			'completed',
		);
	});

	it('rejects a non-integer audio sample rate', async () => {
		await expect(
			invokeWith(Music.generate, {
				model: 'music-3.0',
				audio_setting: { sample_rate: 1.5 },
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('music.coverPreprocess', () => {
	it('preprocesses reference audio and returns the cover feature id', async () => {
		const input: MinimaxEndpointInputs['musicCoverPreprocess'] = {
			model: 'music-cover',
			audio_url: 'https://cdn.test/a.mp3',
		};
		const response = { cover_feature_id: 'cover-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Music.coverPreprocess(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/music_cover_preprocess',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.music.coverPreprocess',
			{ model: 'music-cover' },
			'completed',
		);
	});

	it('rejects an unsupported model', async () => {
		await expect(
			invokeWith(Music.coverPreprocess, { model: 'music-3.0' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('music.generateLyrics', () => {
	it('generates lyrics and returns the song metadata', async () => {
		const input: MinimaxEndpointInputs['musicGenerateLyrics'] = {
			mode: 'write_full_song',
			prompt: 'a song about rain',
		};
		const response = { song_title: 'Rain', lyrics: 'la la' };
		mockedRequest.mockResolvedValue(response);

		const result = await Music.generateLyrics(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/lyrics_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.music.generateLyrics',
			{ mode: 'write_full_song' },
			'completed',
		);
	});

	it('rejects an unknown mode', async () => {
		await expect(
			invokeWith(Music.generateLyrics, { mode: 'not-a-mode' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('image.generate', () => {
	it('generates images and returns their urls', async () => {
		const input: MinimaxEndpointInputs['imageGenerate'] = {
			model: 'image-01',
			prompt: 'a red fox',
		};
		const response = { data: { image_urls: ['https://cdn.test/a.png'] } };
		mockedRequest.mockResolvedValue(response);

		const result = await Image.generate(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/image_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.image.generate',
			{ model: 'image-01', count: 1 },
			'completed',
		);
	});

	it('rejects an empty prompt before calling the API', async () => {
		await expect(
			invokeWith(Image.generate, { model: 'image-01', prompt: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.generate', () => {
	it('creates a video task and returns its id', async () => {
		const input: MinimaxEndpointInputs['videoGenerate'] = {
			model: 'T2V-01',
			prompt: 'a red fox',
		};
		const response = { task_id: 'task-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.generate(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.generate',
			{ model: 'T2V-01', taskId: 'task-1' },
			'completed',
		);
	});

	it('rejects a non-integer duration before calling the API', async () => {
		await expect(
			invokeWith(Video.generate, { model: 'T2V-01', duration: 1.5 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.query', () => {
	it('queries a video task', async () => {
		const input: MinimaxEndpointInputs['videoQuery'] = { task_id: 'task-1' };
		const response = { task_id: 'task-1', status: 'Success' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.query(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/query/video_generation',
			'test-api-key',
			{ method: 'GET', query: { task_id: 'task-1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.query',
			{ taskId: 'task-1', status: 'Success' },
			'completed',
		);
	});

	it('rejects an empty task id before calling the API', async () => {
		await expect(invokeWith(Video.query, { task_id: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.generateV2', () => {
	it('creates an H3 task and returns its id', async () => {
		const input: MinimaxEndpointInputs['videoGenerateV2'] = {
			model: 'MiniMax-H3',
			content: [{ type: 'text', text: 'a red fox' }],
			resolution: '768P',
			duration: 6,
		};
		const response = { task_id: 'task-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.generateV2(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/video_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.generateV2',
			{ model: 'MiniMax-H3', resolution: '768P', taskId: 'task-1' },
			'completed',
		);
	});

	it('rejects empty content before calling the API', async () => {
		await expect(
			invokeWith(Video.generateV2, {
				model: 'MiniMax-H3',
				content: [],
				resolution: '768P',
				duration: 6,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.queryV2', () => {
	it('queries a V2 task by id', async () => {
		const input: MinimaxEndpointInputs['videoQueryV2'] = { task_id: 'task-1' };
		const response = { task: { id: 'task-1', status: 'queued' } };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.queryV2(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/query/video_generation/task-1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.queryV2',
			{ taskId: 'task-1', status: 'queued' },
			'completed',
		);
	});

	it('rejects an empty task id before calling the API', async () => {
		await expect(invokeWith(Video.queryV2, { task_id: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.listV2', () => {
	it('lists V2 tasks with filter query keys', async () => {
		const input: MinimaxEndpointInputs['videoListV2'] = {
			pageNum: 1,
			status: 'queued',
		};
		const response = { items: [{ id: 'task-1' }], total: 1 };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.listV2(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/query/video_generation',
			'test-api-key',
			{
				method: 'GET',
				query: {
					page_num: 1,
					page_size: undefined,
					filter: {
						status: 'queued',
						task_ids: undefined,
						model: undefined,
						task_type: undefined,
					},
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.listV2',
			{ count: 1, total: 1 },
			'completed',
		);
	});

	it('rejects an unknown status filter', async () => {
		await expect(
			invokeWith(Video.listV2, { status: 'not-a-status' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.cancelOrDeleteV2', () => {
	it('cancels a V2 task by id', async () => {
		const input: MinimaxEndpointInputs['videoCancelOrDeleteV2'] = {
			task_id: 'task-1',
		};
		const response = { action: 'cancelled' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.cancelOrDeleteV2(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/video_generation/task-1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.cancelOrDeleteV2',
			{ taskId: 'task-1', action: 'cancelled' },
			'completed',
		);
	});

	it('rejects an empty task id before calling the API', async () => {
		await expect(
			invokeWith(Video.cancelOrDeleteV2, { task_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.contextIr', () => {
	it('creates an H3-Context-IR task', async () => {
		const input: MinimaxEndpointInputs['videoContextIr'] = {
			model: 'MiniMax-H3',
			content: [{ type: 'text', text: 'a red fox' }],
			duration: 6,
		};
		const response = { task_id: 'task-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.contextIr(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/h3_context_ir',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.contextIr',
			{ model: 'MiniMax-H3', taskId: 'task-1' },
			'completed',
		);
	});

	it('rejects empty content before calling the API', async () => {
		await expect(
			invokeWith(Video.contextIr, {
				model: 'MiniMax-H3',
				content: [],
				duration: 6,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.regenerate', () => {
	it('creates a regeneration task from a source task id', async () => {
		const input: MinimaxEndpointInputs['videoRegenerate'] = {
			model: 'MiniMax-H3',
			resolution: '2K',
			source_task_id: 'task-1',
		};
		const response = { task_id: 'task-2' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.regenerate(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/video_regeneration',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.regenerate',
			{ model: 'MiniMax-H3', taskId: 'task-2' },
			'completed',
		);
	});

	it('rejects input without source_task_id or content', async () => {
		await expect(
			invokeWith(Video.regenerate, { model: 'MiniMax-H3', resolution: '2K' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects input with both source_task_id and content', async () => {
		await expect(
			invokeWith(Video.regenerate, {
				model: 'MiniMax-H3',
				resolution: '2K',
				source_task_id: 'task-1',
				content: [{ type: 'text', text: 'a red fox' }],
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts the content input mode', async () => {
		const input: MinimaxEndpointInputs['videoRegenerate'] = {
			model: 'MiniMax-H3',
			resolution: '2K',
			content: [{ type: 'text', text: 'a red fox' }],
		};
		mockedRequest.mockResolvedValue({ task_id: 'task-3' });

		const result = await Video.regenerate(ctx, input);

		expect(result).toEqual({ task_id: 'task-3' });
	});
});

describe('video.templateGenerate', () => {
	it('creates a Video Agent task from a template', async () => {
		const input: MinimaxEndpointInputs['videoTemplateGenerate'] = {
			template_id: 'tpl-1',
		};
		const response = { task_id: 'task-1' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.templateGenerate(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video_template_generation',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.templateGenerate',
			{ templateId: 'tpl-1', taskId: 'task-1' },
			'completed',
		);
	});

	it('rejects an empty template id before calling the API', async () => {
		await expect(
			invokeWith(Video.templateGenerate, { template_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('video.templateQuery', () => {
	it('queries a Video Agent template task', async () => {
		const input: MinimaxEndpointInputs['videoTemplateQuery'] = {
			task_id: 'task-1',
		};
		const response = { task_id: 'task-1', status: 'Success' };
		mockedRequest.mockResolvedValue(response);

		const result = await Video.templateQuery(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/query/video_template_generation',
			'test-api-key',
			{ method: 'GET', query: { task_id: 'task-1' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.video.templateQuery',
			{ taskId: 'task-1', status: 'Success' },
			'completed',
		);
	});

	it('rejects an empty task id before calling the API', async () => {
		await expect(
			invokeWith(Video.templateQuery, { task_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('files.list', () => {
	it('lists files for a purpose', async () => {
		const input: MinimaxEndpointInputs['filesList'] = {
			purpose: 'voice_clone',
		};
		const response = { files: [{ file_id: 1 }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Files.list(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/files/list',
			'test-api-key',
			{
				method: 'GET',
				query: { purpose: 'voice_clone' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.files.list',
			{ purpose: 'voice_clone', count: 1 },
			'completed',
		);
	});

	it('rejects an unknown purpose', async () => {
		await expect(
			invokeWith(Files.list, { purpose: 'not-a-purpose' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('files.retrieve', () => {
	it('retrieves file metadata', async () => {
		const input: MinimaxEndpointInputs['filesRetrieve'] = { file_id: 1 };
		const response = { file: { file_id: 1, filename: 'a.mp3' } };
		mockedRequest.mockResolvedValue(response);

		const result = await Files.retrieve(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/files/retrieve',
			'test-api-key',
			{ method: 'GET', query: { file_id: 1 } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.files.retrieve',
			{ fileId: 1 },
			'completed',
		);
	});

	it('rejects a non-integer file id before calling the API', async () => {
		await expect(
			invokeWith(Files.retrieve, { file_id: 1.5 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('files.delete', () => {
	it('deletes a file', async () => {
		const input: MinimaxEndpointInputs['filesDelete'] = {
			file_id: 1,
			purpose: 'voice_clone',
		};
		const response = { file_id: 1 };
		mockedRequest.mockResolvedValue(response);

		const result = await Files.delete(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/files/delete',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.files.delete',
			{ fileId: 1, purpose: 'voice_clone' },
			'completed',
		);
	});

	it('rejects a non-integer file id before calling the API', async () => {
		await expect(
			invokeWith(Files.delete, { file_id: 1.5, purpose: 'voice_clone' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('models.list', () => {
	it('lists available models', async () => {
		const input: MinimaxEndpointInputs['modelsList'] = {};
		const response = { object: 'list', data: [{ id: 'MiniMax-M2' }] };
		mockedRequest.mockResolvedValue(response);

		const result = await Models.list(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/models', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.models.list',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects a non-object payload before calling the API', async () => {
		await expect(invokeWith(Models.list, [])).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('models.retrieve', () => {
	it('retrieves a model', async () => {
		const input: MinimaxEndpointInputs['modelsRetrieve'] = {
			model_id: 'MiniMax-M2',
		};
		const response = { id: 'MiniMax-M2', object: 'model' };
		mockedRequest.mockResolvedValue(response);

		const result = await Models.retrieve(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/models/MiniMax-M2',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.models.retrieve',
			{ modelId: 'MiniMax-M2' },
			'completed',
		);
	});

	it('rejects an empty model id before calling the API', async () => {
		await expect(
			invokeWith(Models.retrieve, { model_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('models.listAnthropic', () => {
	it('lists Anthropic-compatible models with pagination', async () => {
		const input: MinimaxEndpointInputs['modelsListAnthropic'] = { limit: 10 };
		const response = { data: [{ id: 'MiniMax-M2' }], has_more: false };
		mockedRequest.mockResolvedValue(response);

		const result = await Models.listAnthropic(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/anthropic/v1/models',
			'test-api-key',
			{
				method: 'GET',
				query: { limit: 10, after_id: undefined, before_id: undefined },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.models.listAnthropic',
			{ count: 1, hasMore: false },
			'completed',
		);
	});

	it('rejects a non-positive limit before calling the API', async () => {
		await expect(
			invokeWith(Models.listAnthropic, { limit: 0 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('models.retrieveAnthropic', () => {
	it('retrieves an Anthropic-compatible model', async () => {
		const input: MinimaxEndpointInputs['modelsRetrieveAnthropic'] = {
			model_id: 'MiniMax-M2',
		};
		const response = { id: 'MiniMax-M2', display_name: 'MiniMax M2' };
		mockedRequest.mockResolvedValue(response);

		const result = await Models.retrieveAnthropic(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/anthropic/v1/models/MiniMax-M2',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'minimax.models.retrieveAnthropic',
			{ modelId: 'MiniMax-M2' },
			'completed',
		);
	});

	it('rejects an empty model id before calling the API', async () => {
		await expect(
			invokeWith(Models.retrieveAnthropic, { model_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('minimax plugin shape', () => {
	it('exposes every endpoint in its resource group', () => {
		const plugin = minimax({});

		expect(plugin.endpoints?.chat.completion).toBeDefined();
		expect(plugin.endpoints?.chat.createResponse).toBeDefined();
		expect(plugin.endpoints?.chat.estimateInputTokens).toBeDefined();
		expect(plugin.endpoints?.speech.t2a).toBeDefined();
		expect(plugin.endpoints?.speech.createAsyncTask).toBeDefined();
		expect(plugin.endpoints?.speech.queryAsyncTask).toBeDefined();
		expect(plugin.endpoints?.voice.list).toBeDefined();
		expect(plugin.endpoints?.voice.clone).toBeDefined();
		expect(plugin.endpoints?.voice.design).toBeDefined();
		expect(plugin.endpoints?.voice.delete).toBeDefined();
		expect(plugin.endpoints?.music.generate).toBeDefined();
		expect(plugin.endpoints?.music.coverPreprocess).toBeDefined();
		expect(plugin.endpoints?.music.generateLyrics).toBeDefined();
		expect(plugin.endpoints?.image.generate).toBeDefined();
		expect(plugin.endpoints?.video.generate).toBeDefined();
		expect(plugin.endpoints?.video.query).toBeDefined();
		expect(plugin.endpoints?.video.generateV2).toBeDefined();
		expect(plugin.endpoints?.video.queryV2).toBeDefined();
		expect(plugin.endpoints?.video.listV2).toBeDefined();
		expect(plugin.endpoints?.video.cancelOrDeleteV2).toBeDefined();
		expect(plugin.endpoints?.video.contextIr).toBeDefined();
		expect(plugin.endpoints?.video.regenerate).toBeDefined();
		expect(plugin.endpoints?.video.templateGenerate).toBeDefined();
		expect(plugin.endpoints?.video.templateQuery).toBeDefined();
		expect(plugin.endpoints?.files.list).toBeDefined();
		expect(plugin.endpoints?.files.retrieve).toBeDefined();
		expect(plugin.endpoints?.files.delete).toBeDefined();
		expect(plugin.endpoints?.models.list).toBeDefined();
		expect(plugin.endpoints?.models.retrieve).toBeDefined();
		expect(plugin.endpoints?.models.listAnthropic).toBeDefined();
		expect(plugin.endpoints?.models.retrieveAnthropic).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = minimax({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		const operationIds = [
			'chat.completion',
			'chat.createResponse',
			'chat.estimateInputTokens',
			'speech.t2a',
			'speech.createAsyncTask',
			'speech.queryAsyncTask',
			'voice.list',
			'voice.clone',
			'voice.design',
			'voice.delete',
			'music.generate',
			'music.coverPreprocess',
			'music.generateLyrics',
			'image.generate',
			'video.generate',
			'video.query',
			'video.generateV2',
			'video.queryV2',
			'video.listV2',
			'video.cancelOrDeleteV2',
			'video.contextIr',
			'video.regenerate',
			'video.templateGenerate',
			'video.templateQuery',
			'files.list',
			'files.retrieve',
			'files.delete',
			'models.list',
			'models.retrieve',
			'models.listAnthropic',
			'models.retrieveAnthropic',
		] as const;

		expect(Object.keys(minimaxEndpointSchemas)).toEqual(operationIds);
		for (const operationId of operationIds) {
			expect(minimaxEndpointSchemas[operationId]).toBeDefined();
		}
	});
});
