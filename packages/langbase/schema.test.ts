import {
	AppendThreadMessagesInputSchema,
	AppendThreadMessagesOutputSchema,
	CreateMemoryInputSchema,
	CreateMemoryOutputSchema,
	CreatePipeInputSchema,
	CreatePipeOutputSchema,
	CreateThreadInputSchema,
	CreateThreadOutputSchema,
	DeleteDocumentInputSchema,
	DeleteDocumentOutputSchema,
	DeleteMemoryInputSchema,
	DeleteMemoryOutputSchema,
	DeleteThreadInputSchema,
	DeleteThreadOutputSchema,
	GetPipeInputSchema,
	GetPipeOutputSchema,
	GetThreadInputSchema,
	GetThreadOutputSchema,
	LangbaseEndpointInputSchemas,
	LangbaseEndpointOutputSchemas,
	ListDocumentsInputSchema,
	ListDocumentsOutputSchema,
	ListMemoryInputSchema,
	ListMemoryOutputSchema,
	ListPipesInputSchema,
	ListPipesOutputSchema,
	ListThreadMessagesInputSchema,
	ListThreadMessagesOutputSchema,
	RetrieveMemoryInputSchema,
	RetrieveMemoryOutputSchema,
	RetryDocumentEmbeddingsInputSchema,
	RetryDocumentEmbeddingsOutputSchema,
	RunPipeInputSchema,
	RunPipeOutputSchema,
	UpdatePipeInputSchema,
	UpdatePipeOutputSchema,
	UpdateThreadInputSchema,
	UpdateThreadOutputSchema,
	UploadDocumentInputSchema,
	UploadDocumentOutputSchema,
} from './endpoints/types';
import { langbaseEndpointSchemas } from './index';
import { LangbaseSchema } from './schema';
import { langbaseEntities } from './schema/database';

const pipeResource = {
	name: 'support-agent',
	description: 'Support agent',
	status: 'private',
	owner_login: 'owner-login',
	url: 'https://langbase.com/owner-login/support-agent',
	type: 'run',
	api_key: 'pipe-test-key',
};

const threadResource = {
	id: 'thread-123',
	object: 'thread',
	created_at: 1_714_322_048,
	metadata: { topic: 'support' },
};

describe('Langbase schema', () => {
	it('declares a semver version and empty entities map', () => {
		expect(LangbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(LangbaseSchema.entities).toBe(langbaseEntities);
		expect(LangbaseSchema.entities).toEqual({});
	});

	it('keeps endpoint input, output, and plugin schema registries aligned', () => {
		const inputKeys = Object.keys(LangbaseEndpointInputSchemas).sort();
		const outputKeys = Object.keys(LangbaseEndpointOutputSchemas).sort();
		const pluginSchemaKeys = Object.keys(langbaseEndpointSchemas).sort();

		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toEqual(pluginSchemaKeys);
		expect(inputKeys).toHaveLength(19);
	});

	it('validates pipe run text, structured, null, tool-call, and thread inputs', () => {
		expect(
			RunPipeInputSchema.safeParse({
				messages: [{ role: 'user', content: 'Hello' }],
			}).success,
		).toBe(true);
		expect(
			RunPipeInputSchema.safeParse({
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'image_url',
								image_url: { url: 'https://cdn.langbase.test/image.jpg' },
							},
						],
					},
					{ role: 'assistant' },
					{ role: 'tool', content: null, tool_call_id: 'call-123' },
				],
			}),
		).toMatchObject({ success: true });
		expect(
			RunPipeInputSchema.safeParse({
				messages: [{ role: 'user', content: 'Hello' }],
				stream: true,
			}).success,
		).toBe(false);
		expect(
			RunPipeInputSchema.safeParse({ messages: [], stream: false }).success,
		).toBe(false);
		expect(
			RunPipeInputSchema.parse({ messages: [{ role: 'user', content: 'Hi' }] })
				.stream,
		).toBe(false);
		expect(
			RunPipeOutputSchema.safeParse({
				completion: 'Hello',
				raw: { id: 'run-1', choices: [] },
			}).success,
		).toBe(true);
		expect(
			RunPipeOutputSchema.safeParse({ completion: 'missing raw' }).success,
		).toBe(false);
	});

	it('validates pipe list, get, create, and update request/response shapes', () => {
		expect(ListPipesInputSchema.safeParse({}).success).toBe(true);
		expect(ListPipesInputSchema.safeParse({ extra: true }).success).toBe(false);
		expect(ListPipesOutputSchema.safeParse([pipeResource]).success).toBe(true);
		expect(ListPipesOutputSchema.safeParse({ pipes: [] }).success).toBe(false);

		expect(
			GetPipeInputSchema.safeParse({
				ownerLogin: 'owner-login',
				pipeName: 'support-agent',
			}).success,
		).toBe(true);
		expect(
			GetPipeInputSchema.safeParse({
				ownerLogin: '',
				pipeName: 'support-agent',
			}).success,
		).toBe(false);
		expect(GetPipeOutputSchema.safeParse(pipeResource).success).toBe(true);

		expect(
			CreatePipeInputSchema.safeParse({
				name: 'support-agent',
				status: 'private',
				messages: [{ role: 'system', content: 'Help users.' }],
				response_format: { type: 'json_object' },
			}).success,
		).toBe(true);
		expect(CreatePipeInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(CreatePipeOutputSchema.safeParse(pipeResource).success).toBe(true);

		expect(
			UpdatePipeInputSchema.safeParse({
				name: 'support-agent',
				description: 'Updated',
			}).success,
		).toBe(true);
		expect(
			UpdatePipeInputSchema.safeParse({ name: 'pipe', unknown: true }).success,
		).toBe(false);
		expect(
			CreatePipeInputSchema.safeParse({
				name: 'support-agent',
				stop: ['one', 'two', 'three', 'four', 'five'],
			}).success,
		).toBe(false);
		expect(UpdatePipeOutputSchema.safeParse(pipeResource).success).toBe(true);
	});

	it('validates memory list, create, delete, and retrieval shapes', () => {
		expect(ListMemoryInputSchema.safeParse({}).success).toBe(true);
		expect(ListMemoryInputSchema.safeParse({ extra: true }).success).toBe(
			false,
		);
		expect(
			ListMemoryOutputSchema.safeParse([{ name: 'company-faq' }]).success,
		).toBe(true);
		expect(ListMemoryOutputSchema.safeParse({ memories: [] }).success).toBe(
			false,
		);

		expect(
			CreateMemoryInputSchema.safeParse({
				name: 'company-faq',
				embedding_model: 'cohere:embed-v4.0',
				chunk_size: 10_000,
				chunk_overlap: 2_048,
				top_k: 10,
			}).success,
		).toBe(true);
		expect(
			CreateMemoryInputSchema.safeParse({
				name: 'memory',
				chunk_size: 100,
				chunk_overlap: 100,
			}).success,
		).toBe(false);
		expect(
			CreateMemoryInputSchema.safeParse({
				name: 'memory',
				chunk_overlap: 10_001,
			}).success,
		).toBe(false);
		expect(
			CreateMemoryOutputSchema.safeParse({
				name: 'company-faq',
				description: 'FAQ',
				owner_login: 'owner-login',
				url: 'https://langbase.com/memorysets/company-faq',
				chunk_size: 10_000,
				chunk_overlap: 2_048,
				embedding_model: 'openai:text-embedding-3-large',
			}).success,
		).toBe(true);

		expect(
			DeleteMemoryInputSchema.safeParse({ name: 'company-faq' }).success,
		).toBe(true);
		expect(DeleteMemoryOutputSchema.safeParse({ success: true }).success).toBe(
			true,
		);

		expect(
			RetrieveMemoryInputSchema.safeParse({
				query: 'How do I get support?',
				memory: [
					{
						name: 'company-faq',
						filters: ['And', [['category', 'Eq', 'support']]],
					},
				],
				topK: 5,
			}).success,
		).toBe(true);
		expect(
			RetrieveMemoryOutputSchema.safeParse([
				{
					text: 'Support hours',
					similarity: 0.87,
					meta: { source: 'guide.pdf' },
				},
			]).success,
		).toBe(true);
	});

	it('validates document list, upload, delete, and embedding-retry schemas', () => {
		expect(
			ListDocumentsInputSchema.safeParse({ memoryName: 'company-faq' }).success,
		).toBe(true);
		expect(
			ListDocumentsOutputSchema.safeParse([
				{
					name: 'guide.pdf',
					status: 'completed',
					status_message: null,
					metadata: { size: 120, type: 'application/pdf' },
					enabled: true,
					chunk_size: 10_000,
					chunk_overlap: 2_048,
					owner_login: 'owner-login',
				},
			]).success,
		).toBe(true);

		const uploadInput = {
			memoryName: 'company-faq',
			documentName: 'guide.pdf',
			contentBase64: 'SGVsbG8=',
			contentType: 'application/pdf',
			meta: { category: 'support' },
		};
		expect(UploadDocumentInputSchema.safeParse(uploadInput).success).toBe(true);
		expect(
			UploadDocumentInputSchema.safeParse({
				...uploadInput,
				meta: {
					one: '1',
					two: '2',
					three: '3',
					four: '4',
					five: '5',
					six: '6',
					seven: '7',
					eight: '8',
					nine: '9',
					ten: '10',
					eleven: '11',
				},
			}).success,
		).toBe(false);
		expect(
			UploadDocumentOutputSchema.safeParse({
				ok: true,
				status: 200,
				statusText: 'OK',
			}).success,
		).toBe(true);

		expect(
			DeleteDocumentInputSchema.safeParse({
				memoryName: 'company-faq',
				documentName: 'guide.pdf',
			}).success,
		).toBe(true);
		expect(
			DeleteDocumentOutputSchema.safeParse({ success: true }).success,
		).toBe(true);
		expect(
			RetryDocumentEmbeddingsInputSchema.safeParse({
				memoryName: 'company-faq',
				documentName: 'guide.pdf',
			}).success,
		).toBe(true);
		expect(
			RetryDocumentEmbeddingsOutputSchema.safeParse({ success: true }).success,
		).toBe(true);
	});

	it('validates thread/context and message schemas', () => {
		expect(
			CreateThreadInputSchema.safeParse({
				threadId: 'thread-123',
				metadata: { topic: 'support' },
				messages: [
					{ role: 'user', content: 'Hello' },
					{ role: 'tool', content: null, tool_call_id: 'call-123' },
				],
			}).success,
		).toBe(true);
		expect(CreateThreadOutputSchema.safeParse(threadResource).success).toBe(
			true,
		);
		expect(
			GetThreadInputSchema.safeParse({ threadId: 'thread-123' }).success,
		).toBe(true);
		expect(GetThreadOutputSchema.safeParse(threadResource).success).toBe(true);
		expect(
			UpdateThreadInputSchema.safeParse({
				threadId: 'thread-123',
				metadata: { status: 'resolved' },
			}).success,
		).toBe(true);
		expect(UpdateThreadOutputSchema.safeParse(threadResource).success).toBe(
			true,
		);
		expect(
			DeleteThreadInputSchema.safeParse({ threadId: 'thread-123' }).success,
		).toBe(true);
		expect(DeleteThreadOutputSchema.safeParse({ success: true }).success).toBe(
			true,
		);
		expect(
			AppendThreadMessagesInputSchema.safeParse({
				threadId: 'thread-123',
				messages: [{ role: 'tool', content: null, tool_call_id: 'call-123' }],
			}).success,
		).toBe(true);
		expect(
			AppendThreadMessagesOutputSchema.safeParse([
				{
					id: 'message-123',
					thread_id: 'thread-123',
					created_at: 1_714_322_048,
					role: 'tool',
					content: null,
					tool_call_id: 'call-123',
					tool_calls: [],
					name: 'lookup',
					attachments: [],
					metadata: {},
				},
			]).success,
		).toBe(true);
		expect(
			ListThreadMessagesInputSchema.safeParse({ threadId: 'thread-123' })
				.success,
		).toBe(true);
		expect(
			ListThreadMessagesOutputSchema.safeParse([
				{
					id: 'message-123',
					thread_id: 'thread-123',
					created_at: 1_714_322_048,
					role: 'user',
					content: 'Hello',
					tool_call_id: null,
					tool_calls: [],
					name: null,
					attachments: [],
					metadata: {},
				},
			]).success,
		).toBe(true);
	});
});
