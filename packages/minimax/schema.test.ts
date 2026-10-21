import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './endpoints/types';
import { MinimaxSchema } from './schema';
import { minimaxEntities } from './schema/database';

describe('Minimax schema', () => {
	it('declares a semver version', () => {
		expect(MinimaxSchema.version).toBeDefined();
		expect(MinimaxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(MinimaxSchema.entities).toBe(minimaxEntities);
		expect(MinimaxSchema.entities).toEqual({});
	});
});

// Fixture payloads stay untyped so a single table can drive every schema's
// accept and reject paths uniformly.
type Case = { valid: unknown; invalid: unknown };

// Fixtures mirror the published OpenAPI specs under
// https://platform.minimax.io/docs/api-reference (one spec per resource
// family). Every input and output schema gets one accepted and one rejected
// payload.
const inputCases: Record<string, Case> = {
	chatCompletion: {
		valid: { model: 'MiniMax-M2', messages: [{ role: 'user', content: 'hi' }] },
		invalid: { messages: [] },
	},
	chatCreateResponse: {
		valid: { model: 'MiniMax-M2', input: 'hello' },
		invalid: { input: 42 },
	},
	chatEstimateInputTokens: {
		valid: { model: 'MiniMax-M2', input: 'hello' },
		invalid: {},
	},
	speechT2a: {
		valid: { model: 'speech-2.6-hd', text: 'hello' },
		invalid: { model: 'speech-2.6-hd', text: '' },
	},
	speechCreateAsyncTask: {
		valid: {
			model: 'speech-2.6-hd',
			text: 'hello',
			voice_setting: { voice_id: 'v1' },
		},
		invalid: { model: 'speech-2.6-hd', voice_setting: { voice_id: 'v1' } },
	},
	speechQueryAsyncTask: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	voiceList: {
		valid: { voice_type: 'system' },
		invalid: { voice_type: 'anything' },
	},
	voiceClone: {
		valid: { file_id: 1, voice_id: 'v1' },
		invalid: { voice_id: 'v1' },
	},
	voiceDesign: {
		valid: { prompt: 'a warm narrator', preview_text: 'hello' },
		invalid: { prompt: 'a warm narrator' },
	},
	voiceDelete: {
		valid: { voice_type: 'voice_cloning', voice_id: 'v1' },
		invalid: { voice_type: 'system', voice_id: 'v1' },
	},
	musicGenerate: {
		valid: { model: 'music-3.0', prompt: 'upbeat pop' },
		invalid: { model: 'music-9.9' },
	},
	musicCoverPreprocess: {
		valid: { model: 'music-cover', audio_url: 'https://cdn.test/a.mp3' },
		invalid: { model: 'music-3.0' },
	},
	musicGenerateLyrics: {
		valid: { mode: 'write_full_song', prompt: 'a song about rain' },
		invalid: { mode: 'nope' },
	},
	imageGenerate: {
		valid: { model: 'image-01', prompt: 'a red fox' },
		invalid: { model: 'image-01', prompt: '' },
	},
	videoGenerate: {
		valid: { model: 'T2V-01', prompt: 'a red fox' },
		invalid: { model: 'Not-A-Model' },
	},
	videoQuery: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoGenerateV2: {
		valid: {
			model: 'MiniMax-H3',
			content: [{ type: 'text', text: 'a red fox' }],
			resolution: '768P',
			duration: 6,
		},
		invalid: {
			model: 'MiniMax-H3',
			content: [],
			resolution: '768P',
			duration: 6,
		},
	},
	videoQueryV2: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoListV2: {
		valid: { pageNum: 1, status: 'queued' },
		invalid: { status: 'nope' },
	},
	videoCancelOrDeleteV2: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoContextIr: {
		valid: {
			model: 'MiniMax-H3',
			content: [{ type: 'text', text: 'a red fox' }],
			duration: 6,
		},
		invalid: {
			model: 'MiniMax-H3',
			content: [],
			duration: 6,
		},
	},
	videoRegenerate: {
		valid: { model: 'MiniMax-H3', resolution: '2K', source_task_id: 'task-1' },
		invalid: { model: 'MiniMax-H3', resolution: '2K' },
	},
	videoTemplateGenerate: {
		valid: { template_id: 'tpl-1' },
		invalid: {},
	},
	videoTemplateQuery: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	filesList: {
		valid: { purpose: 'voice_clone' },
		invalid: { purpose: 'nope' },
	},
	filesRetrieve: {
		valid: { file_id: 1 },
		invalid: { file_id: 'one' },
	},
	filesDelete: {
		valid: { file_id: 1, purpose: 'voice_clone' },
		invalid: { file_id: 1, purpose: 'nope' },
	},
	modelsList: {
		valid: {},
		invalid: null,
	},
	modelsRetrieve: {
		valid: { model_id: 'MiniMax-M2' },
		invalid: {},
	},
	modelsListAnthropic: {
		valid: { limit: 10 },
		invalid: { limit: 0 },
	},
	modelsRetrieveAnthropic: {
		valid: { model_id: 'MiniMax-M2' },
		invalid: {},
	},
};

const outputCases: Record<string, Case> = {
	chatCompletion: {
		valid: {
			id: 'chat-1',
			choices: [{ message: { role: 'assistant', content: 'hi' } }],
			base_resp: { status_code: 0 },
		},
		invalid: { choices: 'not-an-array' },
	},
	chatCreateResponse: {
		valid: { id: 'resp-1', status: 'completed', output_text: 'hi' },
		invalid: { status: 'nope' },
	},
	chatEstimateInputTokens: {
		valid: { object: 'response.input_tokens', input_tokens: 5 },
		invalid: { input_tokens: 5 },
	},
	speechT2a: {
		valid: { data: { audio: 'aGVsbG8=' }, base_resp: { status_code: 0 } },
		invalid: { data: 'not-an-object' },
	},
	speechCreateAsyncTask: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	speechQueryAsyncTask: {
		valid: { status: 'success' },
		invalid: { status: 'nope' },
	},
	voiceList: {
		valid: { system_voice: [{ voice_id: 'v1' }] },
		invalid: { system_voice: 'not-an-array' },
	},
	voiceClone: {
		valid: { demo_audio: 'aGVsbG8=' },
		invalid: { input_sensitive: 'not-an-object' },
	},
	voiceDesign: {
		valid: { voice_id: 'v1' },
		invalid: {},
	},
	voiceDelete: {
		valid: { voice_id: 'v1' },
		invalid: { voice_id: 5 },
	},
	musicGenerate: {
		valid: { data: { status: 2, audio: 'aGVsbG8=' } },
		invalid: { data: 'not-an-object' },
	},
	musicCoverPreprocess: {
		valid: { cover_feature_id: 'cover-1' },
		invalid: { audio_duration: 'not-a-number' },
	},
	musicGenerateLyrics: {
		valid: { song_title: 'Rain', lyrics: 'la la' },
		invalid: { lyrics: 5 },
	},
	imageGenerate: {
		valid: { data: { image_urls: ['https://cdn.test/a.png'] } },
		invalid: { data: 'not-an-object' },
	},
	videoGenerate: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoQuery: {
		valid: { task_id: 'task-1', status: 'Success' },
		invalid: { status: 'nope' },
	},
	videoGenerateV2: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoQueryV2: {
		valid: { task: { id: 'task-1', status: 'queued' } },
		invalid: {},
	},
	videoListV2: {
		valid: { items: [], total: 0 },
		invalid: { total: 0 },
	},
	videoCancelOrDeleteV2: {
		valid: { action: 'cancelled' },
		invalid: { action: 'nope' },
	},
	videoContextIr: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoRegenerate: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoTemplateGenerate: {
		valid: { task_id: 'task-1' },
		invalid: {},
	},
	videoTemplateQuery: {
		valid: { task_id: 'task-1', status: 'Success' },
		invalid: { status: 'nope' },
	},
	filesList: {
		valid: { files: [{ file_id: 1 }] },
		invalid: { files: 'not-an-array' },
	},
	filesRetrieve: {
		valid: { file: { file_id: 1 } },
		invalid: {},
	},
	filesDelete: {
		valid: { file_id: 1 },
		invalid: { file_id: 'one' },
	},
	modelsList: {
		valid: { object: 'list', data: [{ id: 'MiniMax-M2' }] },
		invalid: { data: [{}] },
	},
	modelsRetrieve: {
		valid: { id: 'MiniMax-M2' },
		invalid: {},
	},
	modelsListAnthropic: {
		valid: { data: [{ id: 'MiniMax-M2' }] },
		invalid: { data: [{}] },
	},
	modelsRetrieveAnthropic: {
		valid: { id: 'MiniMax-M2' },
		invalid: {},
	},
};

// `value: unknown` mirrors zod's `safeParse(value: unknown)`; the helper only
// reads `.success` so it works for every input and output schema.
function assertCases(
	label: string,
	schemas: Record<
		string,
		{ safeParse: (value: unknown) => { success: boolean } }
	>,
	cases: Record<string, Case>,
) {
	const names = Object.keys(schemas);
	expect(new Set(Object.keys(cases))).toEqual(new Set(names));

	for (const [name, schema] of Object.entries(schemas)) {
		const fixture = cases[name];
		if (!fixture) throw new Error(`missing ${label} fixture for ${name}`);
		expect(schema.safeParse(fixture.valid).success).toBe(true);
		expect(schema.safeParse(fixture.invalid).success).toBe(false);
	}
}

describe('Minimax endpoint schemas', () => {
	it('covers every input schema with a valid and an invalid payload', () => {
		assertCases('input', MinimaxEndpointInputSchemas, inputCases);
	});

	it('covers every output schema with a valid and an invalid payload', () => {
		assertCases('output', MinimaxEndpointOutputSchemas, outputCases);
	});
});
