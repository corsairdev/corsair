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
		$getAccountId: () => 'test-account-id',
		// unknown: fixture omits unrelated runtime context fields.
	} as unknown as Ctx;
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
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.name).toBe('Support Bot');
	});
});

describe('Cody conversations endpoints', () => {
	it('lists conversations', async () => {
		const response = {
			data: [{ id: 'conv-1', name: 'Thread 1', bot_id: 'bot-1' }],
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsList(ctx(), { bot_id: 'bot-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations',
			'test-cody-token',
			{
				method: 'GET',
				query: { search: undefined, bot_id: 'bot-1', includes: undefined },
			},
		);
		expect(result.data).toHaveLength(1);
	});

	it('creates a conversation', async () => {
		const response = {
			data: { id: 'conv-1', name: 'New Thread', bot_id: 'bot-1' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsCreate(ctx(), {
			name: 'New Thread',
			bot_id: 'bot-1',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations',
			'test-cody-token',
			{
				method: 'POST',
				body: { name: 'New Thread', bot_id: 'bot-1', document_ids: undefined },
			},
		);
		expect(result.data.name).toBe('New Thread');
	});

	it('gets a conversation by id', async () => {
		const response = {
			data: { id: 'conv-1', name: 'Thread', bot_id: 'bot-1' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsGet(ctx(), { id: 'conv-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{ method: 'GET', query: { includes: undefined } },
		);
		expect(result.data.id).toBe('conv-1');
	});

	it('updates a conversation', async () => {
		const response = {
			data: { id: 'conv-1', name: 'Updated', bot_id: 'bot-1' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await conversationsUpdate(ctx(), {
			id: 'conv-1',
			name: 'Updated',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{
				method: 'POST',
				body: { name: 'Updated', bot_id: undefined, document_ids: undefined },
			},
		);
		expect(result.data.name).toBe('Updated');
	});

	it('deletes a conversation', async () => {
		mockedMakeCodyRequest.mockResolvedValue({ data: true });

		const result = await conversationsDelete(ctx(), { id: 'conv-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/conversations/conv-1',
			'test-cody-token',
			{ method: 'DELETE' },
		);
		expect(result.data).toBe(true);
	});
});

describe('Cody documents endpoints', () => {
	it('lists documents', async () => {
		const response = {
			data: [{ id: 'doc-1', name: 'Doc 1', status: 'synced' }],
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsList(ctx(), {});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents',
			'test-cody-token',
			{
				method: 'GET',
				query: {
					search: undefined,
					folder_id: undefined,
					conversation_id: undefined,
				},
			},
		);
		expect(result.data).toHaveLength(1);
	});

	it('creates a document from text content', async () => {
		const response = {
			data: { id: 'doc-1', name: 'Guide', status: 'syncing' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreate(ctx(), {
			name: 'Guide',
			content: 'Some plain text content',
			content_type: 'text/plain',
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
					folder_id: undefined,
				},
			},
		);
		expect(result.data.name).toBe('Guide');
	});

	it('creates a document from uploaded file key', async () => {
		const response = {
			data: { id: 'doc-1', name: 'Uploaded File', status: 'syncing' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreateFromFile(ctx(), {
			key: 'tmp/file.pdf',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/file',
			'test-cody-token',
			{
				method: 'POST',
				body: { key: 'tmp/file.pdf', folder_id: undefined },
			},
		);
		expect(result.data.id).toBe('doc-1');
	});

	it('creates a document from webpage url', async () => {
		const response = {
			data: { id: 'doc-1', name: 'Webpage', status: 'syncing' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsCreateFromWebpage(ctx(), {
			url: 'https://example.com/docs',
		});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/webpage',
			'test-cody-token',
			{
				method: 'POST',
				body: { url: 'https://example.com/docs', folder_id: undefined },
			},
		);
		expect(result.data.id).toBe('doc-1');
	});

	it('gets a document by id', async () => {
		const response = {
			data: { id: 'doc-1', name: 'Guide', status: 'synced' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await documentsGet(ctx(), { id: 'doc-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/doc-1',
			'test-cody-token',
			{ method: 'GET' },
		);
		expect(result.data.id).toBe('doc-1');
	});

	it('deletes a document by id', async () => {
		mockedMakeCodyRequest.mockResolvedValue({ data: true });

		const result = await documentsDelete(ctx(), { id: 'doc-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/documents/doc-1',
			'test-cody-token',
			{ method: 'DELETE' },
		);
		expect(result.data).toBe(true);
	});
});

describe('Cody folders endpoints', () => {
	it('lists folders', async () => {
		const response = {
			data: [{ id: 'f-1', name: 'Docs' }],
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersList(ctx(), {});
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders',
			'test-cody-token',
			{ method: 'GET', query: { search: undefined } },
		);
		expect(result.data).toHaveLength(1);
	});

	it('creates a folder', async () => {
		const response = {
			data: { id: 'f-1', name: 'New Folder' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersCreate(ctx(), { name: 'New Folder' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders',
			'test-cody-token',
			{ method: 'POST', body: { name: 'New Folder' } },
		);
		expect(result.data.name).toBe('New Folder');
	});

	it('gets a folder by id', async () => {
		const response = {
			data: { id: 'f-1', name: 'New Folder' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await foldersGet(ctx(), { id: 'f-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/folders/f-1',
			'test-cody-token',
			{ method: 'GET' },
		);
		expect(result.data.id).toBe('f-1');
	});

	it('updates a folder by id', async () => {
		const response = {
			data: { id: 'f-1', name: 'Updated Name' },
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
		expect(result.data.name).toBe('Updated Name');
	});
});

describe('Cody messages endpoints', () => {
	it('lists messages for a conversation', async () => {
		const response = {
			data: [{ id: 'm-1', content: 'Hi', conversation_id: 'conv-1' }],
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesList(ctx(), { conversation_id: 'conv-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages',
			'test-cody-token',
			{
				method: 'GET',
				query: { conversation_id: 'conv-1', includes: undefined },
			},
		);
		expect(result.data).toHaveLength(1);
	});

	it('sends a message in a conversation', async () => {
		const response = {
			data: {
				id: 'm-1',
				content: 'Hello response',
				conversation_id: 'conv-1',
				machine: true,
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
		expect(result.data.content).toBe('Hello response');
	});

	it('gets a message by id', async () => {
		const response = {
			data: { id: 'm-1', content: 'Hello', conversation_id: 'conv-1' },
		};
		mockedMakeCodyRequest.mockResolvedValue(response);

		const result = await messagesGet(ctx(), { id: 'm-1' });
		expect(mockedMakeCodyRequest).toHaveBeenCalledWith(
			'/messages/m-1',
			'test-cody-token',
			{ method: 'GET', query: { includes: undefined } },
		);
		expect(result.data.id).toBe('m-1');
	});

	it('sends a message for SSE stream URL', async () => {
		const response = {
			data: { stream_url: 'https://stream.aimcaiface.com/token123' },
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
		expect(result.data.stream_url).toContain('https://stream.aimcaiface.com');
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
		expect(result.data.key).toBe('tmp/file.txt');
	});
});
