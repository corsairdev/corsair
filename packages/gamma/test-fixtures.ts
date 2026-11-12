// Shapes taken from the OpenAPI fragments embedded in Gamma's developer docs
// (https://developers.gamma.app) and its documented error envelope.
// `exportUrl` is a download link that works for anyone holding it.

export const created = {
	generationId: 'gen_abc123',
	warnings: null,
	pageWarnings: null,
};

export const createdWithWarnings = {
	generationId: 'gen_abc124',
	warnings: 'sharingOptions was ignored',
	pageWarnings: [null, 'page 2 had no title'],
};

export const pending = {
	generationId: 'gen_abc123',
	status: 'pending',
};

export const completed = {
	generationId: 'gen_abc123',
	status: 'completed',
	gammaId: 'gam_xyz789',
	gammaUrl: 'https://gamma.app/docs/abc123',
	exportUrl: 'https://gamma.app/exports/secret-token/file.pdf',
	credits: { deducted: 40, remaining: 960 },
	pages: null,
};

export const completedWithPages = {
	...completed,
	pages: [
		{
			status: 'completed',
			gammaId: 'gam_p1',
			gammaUrl: 'https://gamma.app/docs/p1',
		},
		{
			status: 'completed',
			gammaId: 'gam_p2',
			gammaUrl: 'https://gamma.app/docs/p2',
		},
	],
};

export const failed = {
	generationId: 'gen_abc123',
	status: 'failed',
	error: { message: 'The input text was rejected', statusCode: 400 },
};

export const agentStarted = {
	generationId: 'gen_agent1',
	agentId: 'agent_1',
	status: 'pending',
};

export const agentCompleted = {
	generationId: 'gen_agent1',
	status: 'completed',
	gammaId: 'gam_agent1',
	gammaUrl: 'https://gamma.app/docs/agent1',
};

export const gamma = {
	id: 'gam_xyz789',
	title: 'Renewable energy',
	type: 'regular',
	url: 'https://gamma.app/docs/abc123',
	thumbnailUrl: 'https://gamma.app/thumbs/abc123.png?sig=abc',
	description: 'A deck about renewables',
	author: { id: 'usr_1', name: 'Priya Raman', email: 'priya@acme.example' },
	createdTime: '2026-10-01T09:00:00Z',
	updatedTime: '2026-11-01T10:00:00Z',
	archived: false,
	folderId: 'fld_1',
};

export const searchResults = {
	hits: [
		{
			id: 'gam_xyz789',
			title: 'Renewable energy',
			type: 'regular',
			url: 'https://gamma.app/docs/abc123',
			thumbnailUrl: null,
			updatedTime: '2026-11-01T10:00:00Z',
			archived: false,
		},
	],
};

export const exportStarted = { exportId: 'exp_1', status: 'pending' };

export const exportCompleted = {
	exportId: 'exp_1',
	status: 'completed',
	exportUrl: 'https://gamma.app/exports/secret-token/file.pptx',
};

export const exportFailed = {
	exportId: 'exp_1',
	status: 'failed',
	error: { message: 'Export failed', statusCode: 500 },
};

export const themes = {
	data: [
		{ id: 'thm_1', name: 'Bold', type: 'official' },
		{ id: 'thm_2', name: 'Acme brand', type: 'custom' },
	],
	hasMore: false,
	nextCursor: null,
};

export const folders = {
	data: [
		{ id: 'fld_1', name: 'Client work', parentId: null },
		{ id: 'fld_2', name: 'Q4', parentId: 'fld_1' },
	],
	hasMore: false,
	nextCursor: null,
};

/** The documented error envelope. */
export const invalidKey = { message: 'Invalid API key.', statusCode: 401 };

/** A workspace out of credits. */
export const noCredits = {
	message: 'Insufficient credits remaining',
	statusCode: 402,
};

/** A plan or permission short of what the route needs. */
export const analyticsForbidden = {
	message: 'Access denied — Pro plan or higher required',
	statusCode: 403,
	code: 'individual_analytics_required',
};

/** Too many in-flight jobs, which is a 429 with a code. */
export const concurrencyLimited = {
	message: 'Too many generation jobs are pending',
	statusCode: 429,
	code: 'workspace_concurrency_limit_exceeded',
};

/** An edit already running on that Gamma. */
export const editInProgress = {
	message: 'Edit already in progress',
	statusCode: 409,
	code: 'edit_in_progress',
};

/** The service is busy. */
export const serviceBusy = { message: 'Service unavailable', statusCode: 503 };
