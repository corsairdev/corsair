/**
 * Response fixtures shaped after the examples in the Parsera API docs
 * (parsera.org/docs/api).
 */

export const invalidKey = { detail: 'Invalid API key' };

export const extractionResult = {
	title: 'Show HN: A new approach to web scraping',
	points: '142',
};

export const createdScraper = { template_id: 'abc123' };

export const extractorScraper = {
	template_id: 'abc123',
	type: 'extractor',
	name: 'hackernews',
	url: 'https://news.ycombinator.com/',
};

export const agentTaskPending = {
	task_id: 'agent-extract-abc123',
	status: 'pending',
};

export const agentTaskCompleted = {
	task_id: 'agent-extract-abc123',
	status: 'completed',
	data: [
		{
			title: 'Show HN: A new approach to web scraping',
			score: '142',
			comments: '58',
		},
	],
};

export const agentTaskStopped = {
	task_id: 'agent-extract-abc123',
	status: 'stopped',
};

export const agentScraperReady = {
	template_id: 'abc123',
	type: 'agentic',
	status: 'ready',
	name: 'hackernews',
	url: 'https://news.ycombinator.com/',
	sample_data: [
		{ title: 'Show HN: A new approach to web scraping', score: '142' },
	],
	parameters_schema: [
		{ name: 'url', type: 'url', description: 'Listing URL to scrape' },
	],
	credits_charged: 50,
};

export const deleteMessage = { message: 'Scraper deleted successfully.' };

export const asyncRunQueued = { run_id: 'run-abc123', status: 'queued' };

export const asyncRunCompleted = {
	run_id: 'run-abc123',
	status: 'completed',
	completed: 5,
	total: 5,
	credits_charged: 25,
	data: {
		'https://example.com/page1': [{ title: 'Example', price: '$10' }],
		'https://example.com/page2': [{ title: 'Another', price: '$20' }],
	},
};

export const syncRunResult = {
	status: 'completed',
	credits_charged: 5,
	data: {
		'https://example.com/page1': [{ title: 'Example', price: '$10' }],
	},
};

export const deferredRun = { run_id: 'run-abc123', status: 'running' };
