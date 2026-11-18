// Response bodies copied from the examples in
// https://docs.mem0.ai/api-reference, with made-up people and identifiers.
// They were not captured from the live API.

export const memory = {
	id: 'ea925981-272f-40dd-b576-be64e4871429',
	memory: 'User moved to San Francisco from New York in January 2026',
	user_id: 'alice',
	agent_id: null,
	app_id: null,
	session_id: null,
	metadata: { category: 'location' },
	categories: ['location'],
	structured_attributes: { year: 2026, month: 1, day_of_week: 'Thursday' },
	replaced_by: null,
	synthesized: false,
	expiration_date: null,
	created_at: '2026-01-15T10:30:00Z',
	updated_at: '2026-01-15T10:30:00Z',
};

export const searchResult = {
	id: 'ea925981-272f-40dd-b576-be64e4871429',
	memory: 'Likes to play cricket and plays cricket on weekends.',
	user_id: 'alice',
	score: 0.82,
	score_breakdown: { semantic: 0.71, bm25: 0.35, entity: 0.4 },
	metadata: { category: 'hobbies' },
	expiration_date: null,
	created_at: '2024-07-26T10:29:36.630547-07:00',
	updated_at: null,
	categories: ['hobbies'],
};

export const searchResults = { results: [searchResult] };

export const memoryPage = {
	count: 2,
	next: 'https://api.mem0.ai/v3/memories/?page=2&page_size=100',
	previous: null,
	results: [memory],
};

export const emptyMemoryPage = {
	count: 0,
	next: null,
	previous: null,
	results: [],
};

export const addedQueued = {
	event_id: '2c4d1f44-4f7b-4b2f-9f6e-7b5b4f5a1234',
	status: 'PENDING',
};

export const addedVerbatim = {
	status: 'SUCCEEDED',
	message: 'Memories added successfully',
	results: [
		{
			id: '8b2f1c9e-0f5a-4e2b-9c1d-1f2e3a4b5c6d',
			data: { memory: 'I moved to Austin last month.' },
			event: 'ADD',
		},
	],
};

export const updatedMemory = {
	...memory,
	memory: 'User moved to Lisbon in March 2026',
	expiration_date: '2030-01-31',
	updated_at: '2026-03-02T09:00:00Z',
};

export const historyEntries = [
	{
		id: '1a2b3c4d-0000-4000-8000-000000000001',
		memory_id: 'ea925981-272f-40dd-b576-be64e4871429',
		input: [{ role: 'user', content: 'I moved to San Francisco.' }],
		old_memory: null,
		new_memory: 'User moved to San Francisco from New York in January 2026',
		user_id: 'alice',
		agent_id: null,
		app_id: null,
		session_id: null,
		categories: ['location'],
		event: 'ADD',
		metadata: null,
		created_at: '2026-01-15T10:30:00Z',
		updated_at: '2026-01-15T10:30:00Z',
	},
	{
		id: '1a2b3c4d-0000-4000-8000-000000000002',
		memory_id: 'ea925981-272f-40dd-b576-be64e4871429',
		input: [{ role: 'user', content: 'Actually I moved again.' }],
		old_memory: 'User moved to San Francisco from New York in January 2026',
		new_memory: 'User moved to Lisbon in March 2026',
		user_id: 'alice',
		event: 'UPDATE',
		created_at: '2026-03-02T09:00:00Z',
		updated_at: '2026-03-02T09:00:00Z',
	},
];

/** 200 on memories.delete. */
export const memoryDeleted = { message: 'Memory deleted successfully!' };

/** 200 on memories.delete with delete_linked. */
export const memoryDeletedWithLinks = {
	message: 'Memory deleted successfully!',
	cascade_count: 3,
};

/** 200 on memories.deleteAll; Mem0 queues the deletion. */
export const deletionQueued = {
	message: 'Delete in progress. This may take some time.',
	event_id: '9e8d7c6b-5a49-4382-b1a0-9f8e7d6c5b4a',
};

export const batchUpdated = { message: 'Successfully updated 2 memories' };

export const batchDeleted = { message: 'Successfully deleted 2 memories' };

export const event = {
	id: '2c4d1f44-4f7b-4b2f-9f6e-7b5b4f5a1234',
	event_type: 'ADD',
	status: 'SUCCEEDED',
	payload: {
		messages: [{ role: 'user', content: 'I just moved to San Francisco.' }],
		user_id: 'alice',
	},
	metadata: null,
	results: [{ id: 'ea925981-272f-40dd-b576-be64e4871429', event: 'ADD' }],
	created_at: '2026-01-15T10:29:00Z',
	updated_at: '2026-01-15T10:30:00Z',
	started_at: '2026-01-15T10:29:01Z',
	completed_at: '2026-01-15T10:30:00Z',
	latency: 59_000,
	graph_status: null,
	error: null,
};

export const eventPage = {
	count: 1,
	next: null,
	previous: null,
	results: [event],
};

/** 400 from every v3 memory endpoint. */
export function badRequest(message: string) {
	return {
		error: '400 Bad Request',
		details: { message },
	};
}

/** 401 from every endpoint. */
export const unauthorized = {
	error: '401 Unauthorized',
	details: { message: 'Invalid API key' },
};

/** 404 from memories.get, memories.update and memories.delete. */
export const memoryNotFound = { error: 'Memory not found!' };

/** 429, which Mem0 sends per project. */
export const rateLimited = {
	error: '429 Too Many Requests',
	details: { message: 'Rate limit exceeded. Please try again later.' },
};

/** 500, which Mem0 sends for an unhandled failure. */
export const serverError = {
	error: '500 Internal Server Error',
	details: { message: 'An unexpected error occurred.' },
};

/** 200 on webhooks.list, and 201 on webhooks.create. */
export const webhook = {
	webhook_id: 'wh_123',
	name: 'Memory Logger',
	url: 'https://your-app.example/webhook',
	owner: 'alice',
	event_types: ['memory_add', 'memory_categorize'],
	project: 'default-project',
	is_active: true,
	created_at: '2025-02-18T22:59:56.804993-08:00',
	updated_at: '2025-02-18T23:06:41.479361-08:00',
};

/** 200 on webhooks.update. */
export const webhookUpdated = { message: 'Webhook updated successfully' };

/** 200 on webhooks.delete. */
export const webhookDeleted = { message: 'Webhook deleted successfully' };

/** 403 when the key cannot see the project. */
export const webhookForbidden = {
	error: "You don't have access to this project",
};

/** 400 from webhooks.create, keyed by request field. */
export const webhookInvalid = { name: ['This field is required.'] };
