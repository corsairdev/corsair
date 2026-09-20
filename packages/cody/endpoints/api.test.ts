import { makeCodyRequest } from '../client';
import { list as botsList } from './bots';
import {
	create as conversationsCreate,
	del as conversationsDelete,
	get as conversationsGet,
	list as conversationsList,
	update as conversationsUpdate,
} from './conversations';
import {
	create as documentsCreate,
	createFromFile as documentsCreateFromFile,
	createFromWebpage as documentsCreateFromWebpage,
	del as documentsDelete,
	get as documentsGet,
	list as documentsList,
} from './documents';
import {
	create as foldersCreate,
	get as foldersGet,
	list as foldersList,
	update as foldersUpdate,
} from './folders';
import {
	get as messagesGet,
	list as messagesList,
	send as messagesSend,
	sendForStream as messagesSendForStream,
} from './messages';
import { getSignedUrl as uploadsGetSignedUrl } from './uploads';

jest.mock('../client', () => ({
	CODY_API_BASE: 'https://getcody.ai/api/v1',
	CodyAPIError: class CodyAPIError extends Error {
		constructor(
			message: string,
			public readonly code?: string,
		) {
			super(message);
			this.name = 'CodyAPIError';
		}
	},
	makeCodyRequest: jest.fn(),
}));

const mockedMakeCodyRequest = jest.mocked(makeCodyRequest);
type Ctx = Parameters<typeof botsList>[0];

function ctx(): Ctx {
	return {
		key: 'test-cody-token',
		$getAccountId: async () => 'test-account-id',
		tenantId: 'default',
		options: { authType: 'api_key' },
	} as Ctx;
}

beforeEach(() => {
	mockedMakeCodyRequest.mockReset();
});

describe('Cody bots endpoints', () => {
	it('lists bots with search query', async () => {
		const response = {
			data: [
				{
					id: 'bot-1',
					name: 'Support Bot',
					model: 'gpt-4',
					created_at: 1700000000,
				},
			],
			meta: { pagination: { total: 1 } },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await botsList(ctx(), { search: 'Support' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/bots',
			'test-cody-token',
			{
				method: 'GET',
				query: { search: 'Support' },
			},
		);
		expect(result).toEqual(response);
	});
});

describe('Cody conversations endpoints', () => {
	it('lists conversations', async () => {
		const response = {
			data: [
				{
					id: 'conv-1',
					name: 'Thread 1',
					bot_id: 'bot-1',
					created_at: 1700000000,
					document_ids: ['doc-1'],
				},
			],
			meta: { pagination: { total: 1 } },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsList(ctx(), {
			bot_id: 'bot-1',
			search: 'Thread',
			includes: 'document_ids',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations',
			'test-cody-token',
			{
				method: 'GET',
				query: { search: 'Thread', bot_id: 'bot-1', includes: 'document_ids' },
			},
		);
		expect(result).toEqual(response);
	});

	it('creates a conversation', async () => {
		const response = {
			data: {
				id: 'conv-1',
				name: 'New Thread',
				bot_id: 'bot-1',
				created_at: 1700000000,
				document_ids: ['doc-1'],
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsCreate(ctx(), {
			name: 'New Thread',
			bot_id: 'bot-1',
			document_ids: ['doc-1'],
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations',
			'test-cody-token',
			{
				method: 'POST',
				body: { name: 'New Thread', bot_id: 'bot-1', document_ids: ['doc-1'] },
			},
		);
		expect(result).toEqual(response);
	});

	it('gets a conversation by id', async () => {
		const response = {
			data: {
				id: 'conv-1',
				name: 'Thread',
				bot_id: 'bot-1',
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsGet(ctx(), {
			id: 'conv-1',
			includes: 'document_ids',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{ method: 'GET', query: { includes: 'document_ids' } },
		);
		expect(result).toEqual(response);
	});

	it('updates a conversation', async () => {
		const response = {
			data: {
				id: 'conv-1',
				name: 'Updated',
				bot_id: 'bot-2',
				created_at: 1700000000,
				document_ids: ['doc-2'],
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsUpdate(ctx(), {
			id: 'conv-1',
			name: 'Updated',
			bot_id: 'bot-2',
			document_ids: ['doc-2'],
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{
				method: 'POST',
				body: { name: 'Updated', bot_id: 'bot-2', document_ids: ['doc-2'] },
			},
		);
		expect(result).toEqual(response);
	});

	it('deletes a conversation', async () => {
		mockedMakeCodyRequest.mockResolvedValue({ data: true });

		const result = await conversationsDelete(ctx(), { id: 'conv-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{ method: 'DELETE' },
		);
		expect(result).toEqual({ data: true });
	});
});

describe('Cody documents endpoints', () => {
	it('lists documents', async () => {
		const response = {
			data: [
				{
					id: 'doc-1',
					name: 'Doc 1',
					status: 'synced',
					content_url: 'https://getcody.ai/doc/1',
					folder_id: 'f-1',
					created_at: 1700000000,
				},
			],
			meta: { pagination: { total: 1 } },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsList(ctx(), {
			folder_id: 'f-1',
			conversation_id: 'conv-1',
			search: 'Doc',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents',
			'test-cody-token',
			{
				method: 'GET',
				query: {
					search: 'Doc',
					folder_id: 'f-1',
					conversation_id: 'conv-1',
				},
			},
		);
		expect(result).toEqual(response);
	});

	it('creates a document from text content', async () => {
		const response = {
			data: {
				id: 'doc-1',
				name: 'Guide',
				status: 'syncing',
				content_url: 'https://getcody.ai/doc/1',
				folder_id: 'f-1',
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreate(ctx(), {
			name: 'Guide',
			content: 'Some plain text content',
			content_type: 'text/plain',
			folder_id: 'f-1',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents',
			'test-cody-token',
			{
				method: 'POST',
				body: {
					name: 'Guide',
					content: 'Some plain text content',
					content_type: 'text/plain',
					folder_id: 'f-1',
				},
			},
		);
		expect(result).toEqual(response);
	});

	it('creates a document from uploaded file key', async () => {
		const response = {
			data: {
				id: 'doc-1',
				name: 'Uploaded File',
				status: 'syncing',
				content_url: 'https://getcody.ai/doc/1',
				folder_id: 'f-1',
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreateFromFile(ctx(), {
			key: 'tmp/file.pdf',
			folder_id: 'f-1',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/file',
			'test-cody-token',
			{
				method: 'POST',
				body: { key: 'tmp/file.pdf', folder_id: 'f-1' },
			},
		);
		expect(result).toEqual(response);
	});

	it('creates a document from webpage url', async () => {
		const response = {
			data: {
				id: 'doc-1',
				name: 'Webpage',
				status: 'syncing',
				content_url: 'https://getcody.ai/doc/1',
				folder_id: 'f-1',
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreateFromWebpage(ctx(), {
			url: 'https://example.com/docs',
			folder_id: 'f-1',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/webpage',
			'test-cody-token',
			{
				method: 'POST',
				body: { url: 'https://example.com/docs', folder_id: 'f-1' },
			},
		);
		expect(result).toEqual(response);
	});

	it('gets a document by id', async () => {
		const response = {
			data: {
				id: 'doc-1',
				name: 'Guide',
				status: 'synced',
				content_url: 'https://getcody.ai/doc/1',
				folder_id: 'f-1',
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsGet(ctx(), { id: 'doc-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/doc-1',
			'test-cody-token',
			{ method: 'GET' },
		);
		expect(result).toEqual(response);
	});

	it('deletes a document by id', async () => {
		mockedMakeCodyRequest.mockResolvedValue({ data: true });

		const result = await documentsDelete(ctx(), { id: 'doc-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/doc-1',
			'test-cody-token',
			{ method: 'DELETE' },
		);
		expect(result).toEqual({ data: true });
	});
});

describe('Cody folders endpoints', () => {
	it('lists folders', async () => {
		const response = {
			data: [{ id: 'f-1', name: 'Docs', created_at: 1700000000 }],
			meta: { pagination: { total: 1 } },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersList(ctx(), { search: 'Docs' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders',
			'test-cody-token',
			{ method: 'GET', query: { search: 'Docs' } },
		);
		expect(result).toEqual(response);
	});

	it('creates a folder', async () => {
		const response = {
			data: { id: 'f-1', name: 'New Folder', created_at: 1700000000 },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersCreate(ctx(), { name: 'New Folder' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders',
			'test-cody-token',
			{ method: 'POST', body: { name: 'New Folder' } },
		);
		expect(result).toEqual(response);
	});

	it('gets a folder by id', async () => {
		const response = {
			data: { id: 'f-1', name: 'New Folder', created_at: 1700000000 },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersGet(ctx(), { id: 'f-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders/f-1',
			'test-cody-token',
			{ method: 'GET' },
		);
		expect(result).toEqual(response);
	});

	it('updates a folder by id', async () => {
		const response = {
			data: { id: 'f-1', name: 'Updated Name', created_at: 1700000000 },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersUpdate(ctx(), {
			id: 'f-1',
			name: 'Updated Name',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders/f-1',
			'test-cody-token',
			{ method: 'POST', body: { name: 'Updated Name' } },
		);
		expect(result).toEqual(response);
	});
});

describe('Cody messages endpoints', () => {
	it('lists messages for a conversation', async () => {
		const response = {
			data: [
				{
					id: 'm-1',
					content: 'Hi',
					conversation_id: 'conv-1',
					machine: false,
					failed_responding: false,
					flagged: false,
					created_at: 1700000000,
					sources: {
						data: [
							{
								type: 'written',
								document_id: 'doc-1',
								document_name: 'Guide',
							},
						],
					},
					usage: { tokens: 8000, credits: 0.5 },
				},
			],
			meta: { pagination: { total: 1 } },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesList(ctx(), {
			conversation_id: 'conv-1',
			includes: 'sources,usage',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages',
			'test-cody-token',
			{
				method: 'GET',
				query: { conversation_id: 'conv-1', includes: 'sources,usage' },
			},
		);
		expect(result).toEqual(response);
	});

	it('sends a message in a conversation', async () => {
		const response = {
			data: {
				id: 'm-1',
				content: 'Hello response',
				conversation_id: 'conv-1',
				machine: true,
				failed_responding: false,
				flagged: false,
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesSend(ctx(), {
			conversation_id: 'conv-1',
			content: 'Hello',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages',
			'test-cody-token',
			{
				method: 'POST',
				body: { conversation_id: 'conv-1', content: 'Hello' },
			},
		);
		expect(result).toEqual(response);
	});

	it('gets a message by id', async () => {
		const response = {
			data: {
				id: 'm-1',
				content: 'Hello',
				conversation_id: 'conv-1',
				machine: true,
				failed_responding: false,
				flagged: false,
				created_at: 1700000000,
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesGet(ctx(), {
			id: 'm-1',
			includes: 'sources',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages/m-1',
			'test-cody-token',
			{ method: 'GET', query: { includes: 'sources' } },
		);
		expect(result).toEqual(response);
	});

	it('sends a message for SSE stream URL with explicit redirect=false', async () => {
		const response = {
			data: {
				stream_url:
					'https://stream.aimcaiface.com/eyJpdiI6ImFyellpVWxScDBJdCtySGo0TzJtV3c9PSIsInZhbHVlIjoibW1VM1BDZkVZTGZ6T0ZrSG50dXhrQT09In0=',
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesSendForStream(ctx(), {
			conversation_id: 'conv-1',
			content: 'Tell a story',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages/stream',
			'test-cody-token',
			{
				method: 'POST',
				body: {
					conversation_id: 'conv-1',
					content: 'Tell a story',
					redirect: false,
				},
			},
		);
		expect(result).toEqual(response);
	});

	it('validates input requirements for streaming message', async () => {
		await expect(
			messagesSendForStream(ctx(), {
				conversation_id: '',
				content: 'Hello',
			}),
		).rejects.toThrow();

		await expect(
			messagesSendForStream(ctx(), {
				conversation_id: 'conv-1',
				content: '',
			}),
		).rejects.toThrow();
	});
});

describe('Cody uploads endpoints', () => {
	it('gets S3 signed upload URL', async () => {
		const response = {
			data: {
				url: 'https://s3.amazonaws.com/cody/tmp/file.txt',
				key: 'tmp/file.txt',
			},
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await uploadsGetSignedUrl(ctx(), {
			file_name: 'file.txt',
			content_type: 'text/plain',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/uploads/signed-url',
			'test-cody-token',
			{
				method: 'POST',
				body: { file_name: 'file.txt', content_type: 'text/plain' },
			},
		);
		expect(result).toEqual(response);
	});
});
