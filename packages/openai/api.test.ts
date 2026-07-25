import 'dotenv/config';
import {
	makeOpenaiRequest,
	parseOpenaiMultipartBody,
	parseRetryAfterMs,
} from './client';
import { flattenMetadataQuery } from './endpoints/fine-tuning';
import {
	OpenaiEndpointInputSchemas,
	OpenaiEndpointOutputSchemas,
} from './endpoints/types';
import type { ChatCreateCompletionResponse } from './schema/chat';
import { ContainerFilesCreateInputSchema } from './schema/containers';
import type { EmbeddingsCreateResponse } from './schema/embeddings';
import { ImagesCreateEditInputSchema } from './schema/images';
import type { ModelsListResponse } from './schema/models';

const TEST_API_KEY = process.env.OPENAI_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('OpenAI API Type Tests', () => {
	describe('models', () => {
		it('list returns correct type', async () => {
			const response = await makeOpenaiRequest<ModelsListResponse>(
				'models',
				TEST_API_KEY!,
				{ method: 'GET' },
			);

			OpenaiEndpointOutputSchemas.modelsList.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});

	describe('chat', () => {
		it('createCompletion returns correct type', async () => {
			const response = await makeOpenaiRequest<ChatCreateCompletionResponse>(
				'chat/completions',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						model: 'gpt-4o-mini',
						messages: [{ role: 'user', content: 'Say "hi" and nothing else.' }],
						max_completion_tokens: 16,
						stream: false,
					},
				},
			);

			OpenaiEndpointOutputSchemas.chatCreateCompletion.parse(response);
			expect(response.choices.length).toBeGreaterThan(0);
		});
	});

	describe('embeddings', () => {
		it('create returns correct type', async () => {
			const response = await makeOpenaiRequest<EmbeddingsCreateResponse>(
				'embeddings',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						model: 'text-embedding-3-small',
						input: 'corsair openai plugin test',
					},
				},
			);

			OpenaiEndpointOutputSchemas.embeddingsCreate.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});
});

describe('OpenAI offline schema smoke', () => {
	// Minimal valid inputs for every registered endpoint (offline coverage for all ops).
	// output shape varies across fixtures and is checked via safeParse.success at runtime
	const inputFixtures: Record<string, unknown> = {
		modelsList: {},
		modelsRetrieve: { model: 'gpt-4o-mini' },
		enginesList: {},
		enginesRetrieve: { engineId: 'davinci' },

		chatCreateCompletion: {
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'hi' }],
		},

		embeddingsCreate: { model: 'text-embedding-3-small', input: 'test' },

		filesUpload: {
			file: 'hello',
			fileName: 'hello.txt',
			purpose: 'assistants',
		},
		filesList: {},
		filesRetrieve: { fileId: 'file_123' },
		filesDelete: { fileId: 'file_123' },
		filesDownloadContent: { fileId: 'file_123' },

		assistantsCreate: { model: 'gpt-4o-mini' },
		assistantsList: {},
		assistantsRetrieve: { assistantId: 'asst_123' },
		assistantsModify: { assistantId: 'asst_123' },
		assistantsDelete: { assistantId: 'asst_123' },

		threadsCreate: {},
		threadsRetrieve: { threadId: 'thread_123' },
		threadsModify: { threadId: 'thread_123' },
		threadsDelete: { threadId: 'thread_123' },
		threadsCreateAndRun: { assistantId: 'asst_123' },

		messagesCreate: {
			threadId: 'thread_123',
			role: 'user',
			content: 'hello',
		},
		messagesList: { threadId: 'thread_123' },
		messagesRetrieve: { threadId: 'thread_123', messageId: 'msg_123' },
		messagesModify: { threadId: 'thread_123', messageId: 'msg_123' },
		messagesDelete: { threadId: 'thread_123', messageId: 'msg_123' },

		runsCreate: { threadId: 'thread_123', assistantId: 'asst_123' },
		runsList: { threadId: 'thread_123' },
		runsRetrieve: { threadId: 'thread_123', runId: 'run_123' },
		runsModify: { threadId: 'thread_123', runId: 'run_123' },
		runsCancel: { threadId: 'thread_123', runId: 'run_123' },
		runsSubmitToolOutputs: {
			threadId: 'thread_123',
			runId: 'run_123',
			toolOutputs: [{ toolCallId: 'call_1', output: 'ok' }],
		},

		runStepsList: { threadId: 'thread_123', runId: 'run_123' },
		runStepsRetrieve: {
			threadId: 'thread_123',
			runId: 'run_123',
			stepId: 'step_123',
		},

		vectorStoresCreate: {},
		vectorStoresList: {},
		vectorStoresRetrieve: { vectorStoreId: 'vs_123' },
		vectorStoresModify: { vectorStoreId: 'vs_123' },
		vectorStoresDelete: { vectorStoreId: 'vs_123' },
		vectorStoresSearch: { vectorStoreId: 'vs_123', query: 'hello' },

		vectorStoreFilesCreate: { vectorStoreId: 'vs_123', fileId: 'file_123' },
		vectorStoreFilesList: { vectorStoreId: 'vs_123' },
		vectorStoreFilesRetrieve: {
			vectorStoreId: 'vs_123',
			fileId: 'file_123',
		},
		vectorStoreFilesDelete: { vectorStoreId: 'vs_123', fileId: 'file_123' },
		vectorStoreFilesUpdateAttributes: {
			vectorStoreId: 'vs_123',
			fileId: 'file_123',
			attributes: { key: 'value' },
		},
		vectorStoreFilesRetrieveContent: {
			vectorStoreId: 'vs_123',
			fileId: 'file_123',
		},

		vectorStoreFileBatchesCreate: {
			vectorStoreId: 'vs_123',
			fileIds: ['file_123'],
		},
		vectorStoreFileBatchesRetrieve: {
			vectorStoreId: 'vs_123',
			batchId: 'batch_123',
		},
		vectorStoreFileBatchesListFiles: {
			vectorStoreId: 'vs_123',
			batchId: 'batch_123',
		},

		moderationCreate: { input: 'hello' },

		audioCreateSpeech: {
			model: 'tts-1',
			input: 'hello',
			voice: 'alloy',
		},
		audioCreateTranscription: {
			file: 'audio-bytes',
			fileName: 'a.mp3',
			model: 'whisper-1',
		},
		audioCreateTranslation: {
			file: 'audio-bytes',
			fileName: 'a.mp3',
			model: 'whisper-1',
		},

		imagesCreate: { prompt: 'a cat' },
		imagesCreateEdit: {
			image: 'img',
			imageFileName: 'img.png',
			prompt: 'make it blue',
		},
		imagesCreateVariation: { image: 'img', imageFileName: 'img.png' },

		videosCreate: { prompt: 'a cat walking' },
		videosList: {},
		videosRetrieve: { videoId: 'video_123' },
		videosDelete: { videoId: 'video_123' },
		videosCreateRemix: { videoId: 'video_123', prompt: 'make it night' },
		videosDownload: { videoId: 'video_123' },

		realtimeCreateCall: { session: { type: 'realtime' } },
		realtimeCreateClientSecret: {},
		realtimeCreateSession: {},
		realtimeCreateTranscriptionSession: {},

		chatkitListThreads: {},
		chatkitGetThread: { threadId: 'thread_123' },
		chatkitListThreadItems: { threadId: 'thread_123' },

		skillsCreate: { file: 'skill', fileName: 'SKILL.md' },
		skillsList: {},
		skillsDelete: { skillId: 'skill_123' },

		containersCreate: {},
		containersList: {},
		containersRetrieve: { containerId: 'ctr_123' },
		containersDelete: { containerId: 'ctr_123' },
		containerFilesCreate: { containerId: 'ctr_123', fileId: 'file_123' },
		containerFilesList: { containerId: 'ctr_123' },
		containerFilesRetrieve: { containerId: 'ctr_123', fileId: 'file_123' },
		containerFilesRetrieveContent: {
			containerId: 'ctr_123',
			fileId: 'file_123',
		},
		containerFilesDelete: { containerId: 'ctr_123', fileId: 'file_123' },

		conversationsCreate: {},
		conversationsUpdate: {
			conversationId: 'conv_123',
			metadata: { k: 'v' },
		},
		conversationsDelete: { conversationId: 'conv_123' },
		conversationsCreateItems: {
			conversationId: 'conv_123',
			items: [{ type: 'message', role: 'user', content: 'hi' }],
		},
		conversationsListItems: { conversationId: 'conv_123' },
		conversationsGetItem: {
			conversationId: 'conv_123',
			itemId: 'item_123',
		},
		conversationsDeleteItem: {
			conversationId: 'conv_123',
			itemId: 'item_123',
		},

		fineTuningCreateJob: {
			model: 'gpt-4o-mini-2024-07-18',
			trainingFile: 'file_123',
		},
		fineTuningListJobs: {},
		fineTuningRetrieveJob: { jobId: 'ftjob_123' },
		fineTuningListCheckpoints: { jobId: 'ftjob_123' },
		fineTuningListEvents: { jobId: 'ftjob_123' },
		fineTuningCancelJob: { jobId: 'ftjob_123' },

		completionsCreate: { model: 'gpt-3.5-turbo-instruct', prompt: 'hi' },
		responsesCreate: { model: 'gpt-4o-mini', input: 'hi' },
		responsesRetrieve: { responseId: 'resp_123' },
		responsesDelete: { responseId: 'resp_123' },
		responsesCancel: { responseId: 'resp_123' },
		responsesCompact: {
			model: 'gpt-4o-mini',
			input: [{ type: 'message', role: 'user', content: 'hi' }],
		},
		responsesListInputItems: { responseId: 'resp_123' },
		chatCompletionsList: {},
		chatCompletionsRetrieve: { completionId: 'chatcmpl_123' },
		chatCompletionsUpdate: {
			completionId: 'chatcmpl_123',
			metadata: { k: 'v' },
		},
		chatCompletionsDelete: { completionId: 'chatcmpl_123' },
		chatCompletionsListMessages: { completionId: 'chatcmpl_123' },
		tokensCountInput: { model: 'gpt-4o-mini', input: 'hi' },

		evalsCreate: {
			dataSourceConfig: { type: 'custom' },
			testingCriteria: [{ type: 'string_check' }],
		},
		evalsList: {},
		evalsGet: { evalId: 'eval_123' },
		evalsUpdate: { evalId: 'eval_123' },
		evalsDelete: { evalId: 'eval_123' },
		evalRunsCreate: {
			evalId: 'eval_123',
			dataSource: { type: 'completions' },
		},
		evalRunsGet: { evalId: 'eval_123', runId: 'run_123' },
		evalRunsList: { evalId: 'eval_123' },
		evalRunsCancel: { evalId: 'eval_123', runId: 'run_123' },
		evalRunsDelete: { evalId: 'eval_123', runId: 'run_123' },
		evalRunsGetOutputItem: {
			evalId: 'eval_123',
			runId: 'run_123',
			outputItemId: 'out_123',
		},
		evalRunsListOutputItems: { evalId: 'eval_123', runId: 'run_123' },
		gradersRun: {
			grader: { type: 'string_check' },
			modelSample: 'hello',
		},
		gradersValidate: { grader: { type: 'string_check' } },

		batchesCreate: {
			inputFileId: 'file_123',
			endpoint: '/v1/chat/completions',
			completionWindow: '24h',
		},
		batchesRetrieve: { batchId: 'batch_123' },
		batchesCancel: { batchId: 'batch_123' },
		batchesList: {},

		uploadsCreate: {
			filename: 'big.bin',
			purpose: 'assistants',
			bytes: 1024,
			mimeType: 'application/octet-stream',
		},
		uploadsAddPart: {
			uploadId: 'upload_123',
			data: 'chunk',
			fileName: 'part.bin',
		},
		uploadsComplete: { uploadId: 'upload_123', partIds: ['part_1'] },
		uploadsCancel: { uploadId: 'upload_123' },
	};

	it('covers every registered input schema key with a fixture', () => {
		const schemaKeys = Object.keys(OpenaiEndpointInputSchemas).sort();
		const fixtureKeys = Object.keys(inputFixtures).sort();
		expect(fixtureKeys).toEqual(schemaKeys);
		expect(schemaKeys.length).toBe(
			Object.keys(OpenaiEndpointOutputSchemas).length,
		);
	});

	it.each(Object.keys(OpenaiEndpointInputSchemas))(
		'input schema accepts minimal payload for %s',
		(key) => {
			const schema =
				OpenaiEndpointInputSchemas[
					key as keyof typeof OpenaiEndpointInputSchemas
				];
			const result = schema.safeParse(inputFixtures[key]);
			expect(result.success).toBe(true);
		},
	);

	it('rejects invalid chat input', () => {
		const result = OpenaiEndpointInputSchemas.chatCreateCompletion.safeParse(
			{},
		);
		expect(result.success).toBe(false);
	});

	it('rejects invalid embeddings input', () => {
		const result = OpenaiEndpointInputSchemas.embeddingsCreate.safeParse({});
		expect(result.success).toBe(false);
	});

	it('videosCreate rejects inputReference without fileName (paired fields)', () => {
		const result = OpenaiEndpointInputSchemas.videosCreate.safeParse({
			prompt: 'a cat',
			inputReference: 'bytes',
		});
		expect(result.success).toBe(false);
	});

	it('videosCreate rejects fileName without inputReference (paired fields)', () => {
		const result = OpenaiEndpointInputSchemas.videosCreate.safeParse({
			prompt: 'a cat',
			inputReferenceFileName: 'ref.png',
		});
		expect(result.success).toBe(false);
	});

	it('videosCreate accepts both inputReference fields together', () => {
		const result = OpenaiEndpointInputSchemas.videosCreate.safeParse({
			prompt: 'a cat',
			inputReference: 'bytes',
			inputReferenceFileName: 'ref.png',
		});
		expect(result.success).toBe(true);
	});

	it('conversationsListItems accepts multi-value include array (repeated query keys)', () => {
		// OpenAI list-items expects include as repeated query keys, not a
		// comma-joined string — the endpoint passes string[] through so
		// corsair/http can emit include=a&include=b.
		const result = OpenaiEndpointInputSchemas.conversationsListItems.safeParse({
			conversationId: 'conv_123',
			include: ['message.input_image.image_url', 'file'],
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(Array.isArray(result.data.include)).toBe(true);
			expect(result.data.include?.length).toBe(2);
		}
	});

	it('messagesList accepts runId filter (mapped to run_id on the wire)', () => {
		// listMessages must strip camelCase runId from the query spread and
		// emit only snake_case run_id (Greptile: no dual runId/run_id leak).
		const result = OpenaiEndpointInputSchemas.messagesList.safeParse({
			threadId: 'thread_123',
			runId: 'run_456',
			limit: 10,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.runId).toBe('run_456');
			expect(result.data.threadId).toBe('thread_123');
		}
	});
});

describe('OpenAI container files schema', () => {
	it('accepts a fileId-only payload', () => {
		const result = ContainerFilesCreateInputSchema.safeParse({
			containerId: 'ctr_1',
			fileId: 'file_1',
		});
		expect(result.success).toBe(true);
	});

	it('accepts a file + fileName upload payload', () => {
		const result = ContainerFilesCreateInputSchema.safeParse({
			containerId: 'ctr_1',
			file: 'blob-data',
			fileName: 'doc.txt',
		});
		expect(result.success).toBe(true);
	});

	it('rejects an empty payload with no file information', () => {
		const result = ContainerFilesCreateInputSchema.safeParse({
			containerId: 'ctr_1',
		});
		expect(result.success).toBe(false);
	});

	it('rejects a half-filled upload (file without fileName)', () => {
		const result = ContainerFilesCreateInputSchema.safeParse({
			containerId: 'ctr_1',
			file: 'blob-data',
		});
		expect(result.success).toBe(false);
	});
});

describe('OpenAI images edit schema', () => {
	it('accepts a payload with no mask', () => {
		const result = ImagesCreateEditInputSchema.safeParse({
			image: 'img',
			imageFileName: 'img.png',
			prompt: 'make it blue',
		});
		expect(result.success).toBe(true);
	});

	it('accepts a payload with mask and maskFileName together', () => {
		const result = ImagesCreateEditInputSchema.safeParse({
			image: 'img',
			imageFileName: 'img.png',
			mask: 'mask-blob',
			maskFileName: 'mask.png',
			prompt: 'make it blue',
		});
		expect(result.success).toBe(true);
	});

	it('rejects mask without maskFileName', () => {
		const result = ImagesCreateEditInputSchema.safeParse({
			image: 'img',
			imageFileName: 'img.png',
			mask: 'mask-blob',
			prompt: 'make it blue',
		});
		expect(result.success).toBe(false);
	});

	it('rejects maskFileName without mask', () => {
		const result = ImagesCreateEditInputSchema.safeParse({
			image: 'img',
			imageFileName: 'img.png',
			maskFileName: 'mask.png',
			prompt: 'make it blue',
		});
		expect(result.success).toBe(false);
	});
});

describe('OpenAI client helpers', () => {
	it('parseRetryAfterMs converts Retry-After seconds to milliseconds', () => {
		const response = new Response(null, {
			status: 429,
			headers: { 'Retry-After': '2' },
		});
		expect(parseRetryAfterMs(response)).toBe(2000);
	});

	it('parseRetryAfterMs returns undefined when header is missing', () => {
		const response = new Response(null, { status: 500 });
		expect(parseRetryAfterMs(response)).toBeUndefined();
	});

	it('parseRetryAfterMs returns undefined for non-numeric Retry-After', () => {
		const response = new Response(null, {
			status: 429,
			headers: { 'Retry-After': 'not-a-number' },
		});
		expect(parseRetryAfterMs(response)).toBeUndefined();
	});

	it('parseOpenaiMultipartBody parses application/json bodies', () => {
		const body = parseOpenaiMultipartBody<{ text: string }>(
			'application/json',
			JSON.stringify({ text: 'hello' }),
		);
		expect(body.text).toBe('hello');
	});

	it('parseOpenaiMultipartBody wraps plain text Whisper formats as { text }', () => {
		// response_format=text | srt | vtt return non-JSON bodies
		const plain = parseOpenaiMultipartBody<{ text: string }>(
			'text/plain',
			'hello world',
		);
		expect(plain.text).toBe('hello world');

		const vtt = parseOpenaiMultipartBody<{ text: string }>(
			'text/vtt',
			'WEBVTT\n\n00:00.000 --> 00:01.000\nHi',
		);
		expect(vtt.text.startsWith('WEBVTT')).toBe(true);

		const srt = parseOpenaiMultipartBody<{ text: string }>(
			'application/x-subrip',
			'1\n00:00:00,000 --> 00:00:01,000\nHi\n',
		);
		expect(srt.text.includes('-->')).toBe(true);
	});

	it('parseOpenaiMultipartBody still parses JSON when content-type is missing but body is JSON', () => {
		const body = parseOpenaiMultipartBody<{ text: string }>(
			null,
			JSON.stringify({ text: 'from-json' }),
		);
		expect(body.text).toBe('from-json');
	});
});

describe('OpenAI fine-tuning listJobs metadata filter', () => {
	it('flattens metadata into metadata[key]=value query entries', () => {
		const query = flattenMetadataQuery({ model: 'gpt-4o', env: 'prod' });
		expect(query).toEqual({
			'metadata[model]': 'gpt-4o',
			'metadata[env]': 'prod',
		});
	});

	it('returns an empty object when no metadata is supplied', () => {
		expect(flattenMetadataQuery(undefined)).toEqual({});
		expect(flattenMetadataQuery({})).toEqual({});
	});

	it('handles a single key-value pair', () => {
		expect(flattenMetadataQuery({ team: 'ml' })).toEqual({
			'metadata[team]': 'ml',
		});
	});
});
