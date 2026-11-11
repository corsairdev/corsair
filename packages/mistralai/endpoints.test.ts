import { mistralAiEndpointMeta } from './index';
import {
	AGENT_ID,
	API_KEY,
	AUDIO_AGENT_ID,
	agent,
	alias,
	audioAgent,
	BASE,
	batchJob,
	classification,
	completion,
	createClient,
	FILE_ID,
	FT_MODEL_ID,
	file,
	fineTunedModel,
	JOB_ID,
	jsonResponse,
	mockFetch,
	model,
	moderation,
	VOICE_ID,
	voice,
} from './test-fixtures';

type Client = Awaited<ReturnType<typeof createClient>>;
type Api = Client['corsair']['mistralai']['api'];

type Case = {
	/** The operation, as endpointMeta names it. */
	op: string;
	call: (api: Api) => Promise<unknown>;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Array<[string, string]>;
	/** Expected JSON body. */
	json?: Record<string, unknown>;
	/** Expected multipart fields, file parts as `{ name, text }`. */
	form?: Record<string, string | string[] | { name: string; text: string }>;
	// unknown: Mistral's JSON answer; omitted for 204 No Content.
	reply?: unknown;
	// unknown: what the operation returns; defaults to `reply`.
	expected?: unknown;
};

const messages = [{ role: 'user' as const, content: 'Capital of France?' }];
const hello = Buffer.from('hello, world\n').toString('base64');

const cases: Case[] = [
	// ── completions ─────────────────────────────────────────────────────────
	{
		op: 'chat.complete',
		call: (api) =>
			api.chat.complete({
				model: 'mistral-small-latest',
				messages,
				temperature: 0.2,
				response_format: { type: 'text' },
			}),
		method: 'POST',
		path: '/v1/chat/completions',
		json: {
			model: 'mistral-small-latest',
			messages,
			temperature: 0.2,
			response_format: { type: 'text' },
			stream: false,
		},
		reply: completion,
	},
	{
		op: 'fim.complete',
		call: (api) =>
			api.fim.complete({
				model: 'codestral-latest',
				prompt: 'def add(a, b):',
				suffix: 'print(add(1, 2))',
			}),
		method: 'POST',
		path: '/v1/fim/completions',
		json: {
			model: 'codestral-latest',
			prompt: 'def add(a, b):',
			suffix: 'print(add(1, 2))',
			stream: false,
		},
		reply: { ...completion, model: 'codestral-latest' },
	},
	{
		op: 'agents.complete',
		call: (api) => api.agents.complete({ agent_id: AGENT_ID, messages }),
		method: 'POST',
		path: '/v1/agents/completions',
		json: { agent_id: AGENT_ID, messages, stream: false },
		reply: completion,
	},
	{
		op: 'embeddings.create',
		call: (api) =>
			api.embeddings.create({
				model: 'mistral-embed',
				input: ['first', 'second'],
			}),
		method: 'POST',
		path: '/v1/embeddings',
		json: { model: 'mistral-embed', input: ['first', 'second'] },
		reply: {
			id: 'emb-1',
			object: 'list',
			model: 'mistral-embed',
			usage: { prompt_tokens: 4, completion_tokens: 0, total_tokens: 4 },
			data: [
				{ object: 'embedding', embedding: [0.1, -0.2], index: 0 },
				{ object: 'embedding', embedding: [0.3, 0.4], index: 1 },
			],
		},
	},
	// ── classifiers ─────────────────────────────────────────────────────────
	{
		op: 'classifiers.moderate',
		call: (api) =>
			api.classifiers.moderate({
				model: 'mistral-moderation-latest',
				input: 'some text',
			}),
		method: 'POST',
		path: '/v1/moderations',
		json: { model: 'mistral-moderation-latest', input: 'some text' },
		reply: moderation,
	},
	{
		op: 'classifiers.moderateChat',
		call: (api) =>
			api.classifiers.moderateChat({
				model: 'mistral-moderation-latest',
				input: messages,
			}),
		method: 'POST',
		path: '/v1/chat/moderations',
		json: { model: 'mistral-moderation-latest', input: messages },
		reply: moderation,
	},
	{
		op: 'classifiers.classify',
		call: (api) =>
			api.classifiers.classify({
				model: 'ft:classifier:intent:1',
				input: ['I want my money back'],
			}),
		method: 'POST',
		path: '/v1/classifications',
		json: { model: 'ft:classifier:intent:1', input: ['I want my money back'] },
		reply: classification,
	},
	{
		op: 'classifiers.classifyChat',
		call: (api) =>
			api.classifiers.classifyChat({
				model: 'ft:classifier:intent:1',
				input: { messages },
			}),
		method: 'POST',
		path: '/v1/chat/classifications',
		json: { model: 'ft:classifier:intent:1', input: { messages } },
		reply: classification,
	},
	// ── OCR ─────────────────────────────────────────────────────────────────
	{
		op: 'ocr.process',
		call: (api) =>
			api.ocr.process({
				model: 'mistral-ocr-latest',
				document: {
					type: 'document_url',
					document_url: 'https://arxiv.org/pdf/2201.04234',
				},
				pages: [0],
			}),
		method: 'POST',
		path: '/v1/ocr',
		json: {
			model: 'mistral-ocr-latest',
			document: {
				type: 'document_url',
				document_url: 'https://arxiv.org/pdf/2201.04234',
			},
			pages: [0],
		},
		reply: {
			model: 'mistral-ocr-2505',
			pages: [
				{
					index: 0,
					markdown: '# Title',
					images: [],
					dimensions: { dpi: 200, height: 2200, width: 1700 },
				},
			],
			document_annotation: null,
			usage_info: { pages_processed: 1, doc_size_bytes: 3002783 },
		},
	},
	// ── audio ───────────────────────────────────────────────────────────────
	{
		op: 'audio.speech',
		call: (api) =>
			api.audio.speech({
				input: 'Hello there',
				voice_id: VOICE_ID,
				response_format: 'wav',
			}),
		method: 'POST',
		path: '/v1/audio/speech',
		json: {
			input: 'Hello there',
			voice_id: VOICE_ID,
			response_format: 'wav',
			stream: false,
		},
		reply: { audio_data: 'UklGRiQAAABXQVZF' },
	},
	{
		op: 'audio.transcribe',
		call: (api) =>
			api.audio.transcribe({
				model: 'voxtral-mini-latest',
				content_base64: hello,
				filename: 'note.mp3',
				language: 'en',
				timestamp_granularities: ['segment'],
			}),
		method: 'POST',
		path: '/v1/audio/transcriptions',
		form: {
			model: 'voxtral-mini-latest',
			file: { name: 'note.mp3', text: 'hello, world\n' },
			language: 'en',
			timestamp_granularities: 'segment',
			stream: 'false',
		},
		reply: {
			model: 'voxtral-mini-2507',
			text: 'hello, world',
			language: 'en',
			segments: [{ text: 'hello, world', start: 0, end: 1.2 }],
			usage: {
				prompt_tokens: 4,
				completion_tokens: 3,
				total_tokens: 7,
				prompt_audio_seconds: 2,
			},
		},
	},
	// ── voices ──────────────────────────────────────────────────────────────
	{
		op: 'voices.list',
		call: (api) => api.voices.list({ type: 'custom', page_size: 5 }),
		method: 'GET',
		path: '/v2/audio/voices',
		query: [
			['page_size', '5'],
			['type', 'custom'],
		],
		reply: { data: [voice], next_page_token: 'tok-2' },
	},
	{
		op: 'voices.get',
		call: (api) => api.voices.get({ voice_id: VOICE_ID }),
		method: 'GET',
		path: `/v1/audio/voices/${VOICE_ID}`,
		reply: voice,
	},
	{
		op: 'voices.create',
		call: (api) =>
			api.voices.create({
				name: 'Narrator',
				languages: ['en'],
				sample_audio: hello,
				sample_filename: 'sample.wav',
			}),
		method: 'POST',
		path: '/v1/audio/voices',
		json: {
			name: 'Narrator',
			languages: ['en'],
			sample_audio: hello,
			sample_filename: 'sample.wav',
		},
		reply: voice,
	},
	{
		op: 'voices.update',
		call: (api) => api.voices.update({ voice_id: VOICE_ID, tags: ['calm'] }),
		method: 'PATCH',
		path: `/v1/audio/voices/${VOICE_ID}`,
		json: { tags: ['calm'] },
		reply: { ...voice, tags: ['calm'] },
	},
	{
		op: 'voices.delete',
		call: (api) => api.voices.delete({ voice_id: VOICE_ID }),
		method: 'DELETE',
		path: `/v1/audio/voices/${VOICE_ID}`,
		reply: voice,
	},
	// ── audio agents ────────────────────────────────────────────────────────
	{
		op: 'audioAgents.list',
		call: (api) => api.audioAgents.list({ search: 'recep' }),
		method: 'GET',
		path: '/v1/audio/agents',
		query: [['search', 'recep']],
		reply: { data: [audioAgent], next_page_token: null },
	},
	{
		op: 'audioAgents.get',
		call: (api) =>
			api.audioAgents.get({ agent_id: AUDIO_AGENT_ID, version: 1 }),
		method: 'GET',
		path: `/v1/audio/agents/${AUDIO_AGENT_ID}`,
		query: [['version', '1']],
		reply: audioAgent,
	},
	{
		op: 'audioAgents.create',
		call: (api) =>
			api.audioAgents.create({
				name: 'Receptionist',
				configuration: { llm: { model: 'mistral-small-latest' } },
			}),
		method: 'POST',
		path: '/v1/audio/agents',
		json: {
			name: 'Receptionist',
			configuration: { llm: { model: 'mistral-small-latest' } },
		},
		reply: audioAgent,
	},
	{
		op: 'audioAgents.update',
		call: (api) =>
			api.audioAgents.update({
				agent_id: AUDIO_AGENT_ID,
				name: 'Front desk',
				configuration: { welcome_message: 'Hi!' },
			}),
		method: 'PUT',
		path: `/v1/audio/agents/${AUDIO_AGENT_ID}`,
		json: { name: 'Front desk', configuration: { welcome_message: 'Hi!' } },
		reply: { ...audioAgent, name: 'Front desk', version: 2 },
	},
	{
		op: 'audioAgents.delete',
		call: (api) => api.audioAgents.delete({ agent_id: AUDIO_AGENT_ID }),
		method: 'DELETE',
		path: `/v1/audio/agents/${AUDIO_AGENT_ID}`,
		expected: { success: true },
	},
	{
		op: 'audioAgents.listVersions',
		call: (api) =>
			api.audioAgents.listVersions({ agent_id: AUDIO_AGENT_ID, page_size: 2 }),
		method: 'GET',
		path: `/v1/audio/agents/${AUDIO_AGENT_ID}/versions`,
		query: [['page_size', '2']],
		reply: { data: [audioAgent], next_page_token: null },
	},
	{
		op: 'audioAgents.listSessions',
		call: (api) =>
			api.audioAgents.listSessions({
				agent_id: AUDIO_AGENT_ID,
				page_token: 'tok-1',
			}),
		method: 'GET',
		path: `/v1/audio/agents/${AUDIO_AGENT_ID}/sessions`,
		query: [['page_token', 'tok-1']],
		reply: {
			data: [
				{
					id: '6a1f0c3e-0000-4000-8000-00000000abcd',
					agent_id: AUDIO_AGENT_ID,
					started_at: '2026-11-10T09:00:00Z',
					duration: 42,
				},
			],
			next_page_token: null,
		},
	},
	// ── models ──────────────────────────────────────────────────────────────
	{
		op: 'models.list',
		call: (api) => api.models.list({}),
		method: 'GET',
		path: '/v1/models',
		reply: { object: 'list', data: [model] },
	},
	{
		op: 'models.get',
		call: (api) => api.models.get({ model_id: FT_MODEL_ID }),
		method: 'GET',
		// Path values are URI-encoded: a fine-tuned id carries colons.
		path: `/v1/models/${encodeURIComponent(FT_MODEL_ID)}`,
		reply: { ...model, id: FT_MODEL_ID, type: 'fine-tuned' },
	},
	{
		op: 'models.delete',
		call: (api) => api.models.delete({ model_id: FT_MODEL_ID }),
		method: 'DELETE',
		path: `/v1/models/${encodeURIComponent(FT_MODEL_ID)}`,
		reply: { id: FT_MODEL_ID, object: 'model', deleted: true },
	},
	{
		op: 'models.update',
		call: (api) =>
			api.models.update({ model_id: FT_MODEL_ID, name: 'Support tone' }),
		method: 'PATCH',
		path: `/v1/fine_tuning/models/${encodeURIComponent(FT_MODEL_ID)}`,
		json: { name: 'Support tone' },
		reply: fineTunedModel,
	},
	{
		op: 'models.archive',
		call: (api) => api.models.archive({ model_id: FT_MODEL_ID }),
		method: 'POST',
		path: `/v1/fine_tuning/models/${encodeURIComponent(FT_MODEL_ID)}/archive`,
		reply: { id: FT_MODEL_ID, object: 'model', archived: true },
	},
	{
		op: 'models.unarchive',
		call: (api) => api.models.unarchive({ model_id: FT_MODEL_ID }),
		method: 'DELETE',
		path: `/v1/fine_tuning/models/${encodeURIComponent(FT_MODEL_ID)}/archive`,
		reply: { id: FT_MODEL_ID, object: 'model', archived: false },
	},
	// ── files ───────────────────────────────────────────────────────────────
	{
		op: 'files.list',
		call: (api) => api.files.list({ page: 1, page_size: 10, purpose: 'batch' }),
		method: 'GET',
		path: '/v1/files',
		query: [
			['page', '1'],
			['page_size', '10'],
			['purpose', 'batch'],
		],
		reply: { data: [file], object: 'list', total: 11 },
	},
	{
		op: 'files.upload',
		call: (api) =>
			api.files.upload({
				filename: 'requests.jsonl',
				content_base64: hello,
				purpose: 'batch',
			}),
		method: 'POST',
		path: '/v1/files',
		form: {
			file: { name: 'requests.jsonl', text: 'hello, world\n' },
			purpose: 'batch',
		},
		reply: file,
	},
	{
		op: 'files.get',
		call: (api) => api.files.get({ file_id: FILE_ID }),
		method: 'GET',
		path: `/v1/files/${FILE_ID}`,
		reply: { ...file, deleted: false },
	},
	{
		op: 'files.delete',
		call: (api) => api.files.delete({ file_id: FILE_ID }),
		method: 'DELETE',
		path: `/v1/files/${FILE_ID}`,
		reply: { id: FILE_ID, object: 'file', deleted: true },
	},
	{
		op: 'files.getSignedUrl',
		call: (api) => api.files.getSignedUrl({ file_id: FILE_ID, expiry: 1 }),
		method: 'GET',
		path: `/v1/files/${FILE_ID}/url`,
		query: [['expiry', '1']],
		reply: { url: 'https://files.mistral.ai/signed/abc' },
	},
	// ── batch ───────────────────────────────────────────────────────────────
	{
		op: 'batch.list',
		call: (api) => api.batch.list({ status: ['RUNNING', 'QUEUED'] }),
		method: 'GET',
		path: '/v1/batch/jobs',
		query: [
			['status', 'RUNNING'],
			['status', 'QUEUED'],
		],
		reply: { data: [batchJob], object: 'list', total: 1 },
	},
	{
		op: 'batch.create',
		call: (api) =>
			api.batch.create({
				endpoint: '/v1/chat/completions',
				model: 'mistral-small-latest',
				input_files: [FILE_ID],
			}),
		method: 'POST',
		path: '/v1/batch/jobs',
		json: {
			endpoint: '/v1/chat/completions',
			model: 'mistral-small-latest',
			input_files: [FILE_ID],
		},
		reply: batchJob,
	},
	{
		op: 'batch.get',
		call: (api) => api.batch.get({ job_id: JOB_ID }),
		method: 'GET',
		path: `/v1/batch/jobs/${JOB_ID}`,
		reply: { ...batchJob, status: 'SUCCESS', output_file: FILE_ID },
	},
	{
		op: 'batch.delete',
		call: (api) => api.batch.delete({ job_id: JOB_ID }),
		method: 'DELETE',
		path: `/v1/batch/jobs/${JOB_ID}`,
		reply: { id: JOB_ID, object: 'batch', deleted: true },
	},
	{
		op: 'batch.cancel',
		call: (api) => api.batch.cancel({ job_id: JOB_ID }),
		method: 'POST',
		path: `/v1/batch/jobs/${JOB_ID}/cancel`,
		reply: { ...batchJob, status: 'CANCELLATION_REQUESTED' },
	},
	// ── responses ───────────────────────────────────────────────────────────
	{
		op: 'responses.create',
		call: (api) =>
			api.responses.create({
				model: 'mistral-medium-latest',
				input: 'Say hi',
				max_output_tokens: 20,
			}),
		method: 'POST',
		path: '/v1/responses',
		json: {
			model: 'mistral-medium-latest',
			input: 'Say hi',
			max_output_tokens: 20,
			stream: false,
		},
		reply: {
			id: 'resp_1',
			object: 'response',
			created_at: 1762819200,
			model: 'mistral-medium-latest',
			status: 'completed',
			output: [
				{
					id: 'msg_1',
					type: 'message',
					role: 'assistant',
					status: 'completed',
					content: [{ type: 'output_text', text: 'Hi!' }],
				},
			],
			parallel_tool_calls: true,
			tool_choice: 'auto',
			tools: [],
			usage: { input_tokens: 5, output_tokens: 2, total_tokens: 7 },
		},
	},
	{
		op: 'responses.countInputTokens',
		call: (api) =>
			api.responses.countInputTokens({
				model: 'mistral-medium-latest',
				input: 'Say hi',
			}),
		method: 'POST',
		path: '/v1/responses/input_tokens',
		json: { model: 'mistral-medium-latest', input: 'Say hi' },
		reply: { input_tokens: 5, object: 'response.input_tokens' },
	},
	// ── agents (beta) ───────────────────────────────────────────────────────
	{
		op: 'agents.create',
		call: (api) =>
			api.agents.create({
				model: 'mistral-medium-latest',
				name: 'Support triage',
				instructions: 'Answer in one sentence.',
				tools: [{ type: 'web_search' }],
			}),
		method: 'POST',
		path: '/v1/agents',
		json: {
			model: 'mistral-medium-latest',
			name: 'Support triage',
			instructions: 'Answer in one sentence.',
			tools: [{ type: 'web_search' }],
		},
		reply: agent,
	},
	{
		op: 'agents.list',
		call: (api) =>
			api.agents.list({ page_size: 50, metadata: { team: 'support' } }),
		method: 'GET',
		path: '/v1/agents/pages',
		query: [
			['page_size', '50'],
			['metadata', '{"team":"support"}'],
		],
		reply: { object: 'list', data: [agent], next_page_token: null },
	},
	{
		op: 'agents.get',
		call: (api) =>
			api.agents.get({ agent_id: AGENT_ID, agent_version: 'production' }),
		method: 'GET',
		path: `/v1/agents/${AGENT_ID}`,
		query: [['agent_version', 'production']],
		reply: agent,
	},
	{
		op: 'agents.update',
		call: (api) =>
			api.agents.update({ agent_id: AGENT_ID, description: 'Tier 1' }),
		method: 'PATCH',
		path: `/v1/agents/${AGENT_ID}`,
		json: { description: 'Tier 1' },
		reply: { ...agent, description: 'Tier 1', version: 2, versions: [0, 1, 2] },
	},
	{
		op: 'agents.delete',
		call: (api) => api.agents.delete({ agent_id: AGENT_ID }),
		method: 'DELETE',
		path: `/v1/agents/${AGENT_ID}`,
		expected: { success: true },
	},
	{
		op: 'agents.setVersion',
		call: (api) => api.agents.setVersion({ agent_id: AGENT_ID, version: 0 }),
		method: 'PATCH',
		path: `/v1/agents/${AGENT_ID}/version`,
		query: [['version', '0']],
		reply: { ...agent, version: 0 },
	},
	{
		op: 'agents.listVersions',
		call: (api) =>
			api.agents.listVersions({ agent_id: AGENT_ID, page: 0, page_size: 5 }),
		method: 'GET',
		path: `/v1/agents/${AGENT_ID}/versions`,
		query: [
			['page', '0'],
			['page_size', '5'],
		],
		reply: [agent],
	},
	{
		op: 'agents.getVersion',
		call: (api) => api.agents.getVersion({ agent_id: AGENT_ID, version: '1' }),
		method: 'GET',
		path: `/v1/agents/${AGENT_ID}/versions/1`,
		reply: agent,
	},
	{
		op: 'agents.listAliases',
		call: (api) => api.agents.listAliases({ agent_id: AGENT_ID }),
		method: 'GET',
		path: `/v1/agents/${AGENT_ID}/aliases`,
		reply: [alias],
	},
	{
		op: 'agents.upsertAlias',
		call: (api) =>
			api.agents.upsertAlias({
				agent_id: AGENT_ID,
				alias: 'production',
				version: 1,
			}),
		method: 'PUT',
		path: `/v1/agents/${AGENT_ID}/aliases`,
		query: [
			['alias', 'production'],
			['version', '1'],
		],
		reply: alias,
	},
	{
		op: 'agents.deleteAlias',
		call: (api) =>
			api.agents.deleteAlias({ agent_id: AGENT_ID, alias: 'production' }),
		method: 'DELETE',
		path: `/v1/agents/${AGENT_ID}/aliases`,
		query: [['alias', 'production']],
		expected: { success: true },
	},
];

let client: Client;
let fetchMock: jest.SpyInstance;

beforeAll(async () => {
	client = await createClient();
});

afterAll(() => {
	client.testDb.cleanup();
});

beforeEach(() => {
	fetchMock = mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

const sortPairs = (pairs: Array<[string, string]>) =>
	[...pairs].sort((a, b) => `${a[0]}=${a[1]}`.localeCompare(`${b[0]}=${b[1]}`));

describe('Mistral AI endpoints', () => {
	it('has one case per operation the plugin declares', () => {
		const declared = Object.keys(mistralAiEndpointMeta).sort();
		expect(cases.map((c) => c.op).sort()).toEqual(declared);
		expect(declared).toHaveLength(52);
	});

	it.each(cases.map((c) => [c.op, c] as const))(
		'%s sends the documented request and returns the parsed answer',
		async (_op, c) => {
			fetchMock.mockResolvedValueOnce(
				c.reply === undefined
					? new Response(null, { status: 204 })
					: jsonResponse(c.reply),
			);

			const out = await c.call(client.corsair.mistralai.api);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const sent = new URL(url);
			expect(`${sent.origin}${sent.pathname}`).toBe(`${BASE}${c.path}`);
			expect(sortPairs([...sent.searchParams.entries()])).toEqual(
				sortPairs(c.query ?? []),
			);
			expect(init.method).toBe(c.method);

			const headers = new Headers(init.headers);
			expect(headers.get('Authorization')).toBe(`Bearer ${API_KEY}`);

			if (c.json) {
				expect(headers.get('Content-Type')).toBe('application/json');
				expect(JSON.parse(String(init.body))).toEqual(c.json);
			} else if (c.form) {
				// fetch sets the multipart boundary itself.
				expect(headers.get('Content-Type')).toBeNull();
				expect(init.body).toBeInstanceOf(FormData);
				const form = init.body as FormData;
				expect([...new Set(form.keys())].sort()).toEqual(
					Object.keys(c.form).sort(),
				);
				for (const [key, want] of Object.entries(c.form)) {
					if (typeof want === 'object' && !Array.isArray(want)) {
						const part = form.get(key);
						expect(part).toBeInstanceOf(File);
						expect((part as File).name).toBe(want.name);
						expect(await (part as File).text()).toBe(want.text);
					} else {
						expect(form.getAll(key)).toEqual(
							Array.isArray(want) ? want : [want],
						);
					}
				}
			} else {
				expect(init.body).toBeUndefined();
			}

			expect(out).toEqual(c.expected ?? c.reply);
		},
	);
});

describe('Mistral AI input checks', () => {
	it('refuses a batch with both input_files and requests before calling Mistral', async () => {
		await expect(
			client.corsair.mistralai.api.batch.create({
				endpoint: '/v1/embeddings',
				input_files: [FILE_ID],
				requests: [{ body: { input: 'x' } }],
			}),
		).rejects.toThrow('exactly one of input_files or requests');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a transcription with no audio source', async () => {
		await expect(
			client.corsair.mistralai.api.audio.transcribe({
				model: 'voxtral-mini-latest',
			}),
		).rejects.toThrow('exactly one of content_base64, file_url or file_id');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses content that is not base64 instead of uploading a broken file', async () => {
		await expect(
			client.corsair.mistralai.api.files.upload({
				filename: 'a.jsonl',
				content_base64: 'not base64!',
			}),
		).rejects.toThrow('content_base64 is not valid base64');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends a transcription by URL without a file part', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				model: 'voxtral-mini-2507',
				text: 'hi',
				language: null,
				usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
			}),
		);
		await client.corsair.mistralai.api.audio.transcribe({
			model: 'voxtral-mini-latest',
			file_url: 'https://example.com/a.mp3',
		});
		const form = (fetchMock.mock.calls[0] as [string, RequestInit])[1]
			.body as FormData;
		expect(form.get('file')).toBeNull();
		expect(form.get('file_url')).toBe('https://example.com/a.mp3');
	});

	it('keeps fields Mistral adds later instead of dropping them', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ ...model, brand_new_field: { nested: 1 } }),
		);
		const out = await client.corsair.mistralai.api.models.get({
			model_id: 'mistral-small-latest',
		});
		expect(out).toMatchObject({ brand_new_field: { nested: 1 } });
	});
});
