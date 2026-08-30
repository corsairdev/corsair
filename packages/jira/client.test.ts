import {
	makeJiraAgileRequest,
	makeJiraRequest,
	uploadJiraAttachment,
} from './client';

describe('Jira Client URL Sanitization', () => {
	const originalFetch = globalThis.fetch;
	let fetchSpy: jest.Mock;

	beforeEach(() => {
		fetchSpy = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({}),
			text: async () => '{}',
			arrayBuffer: async () => new ArrayBuffer(0),
			headers: new Headers({ 'content-type': 'application/json' }),
		});
		globalThis.fetch = fetchSpy;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('should not contain double slashes when cloudUrl has a trailing slash in makeJiraRequest', async () => {
		await makeJiraRequest(
			'myself',
			'user@example.com:token',
			'https://test.atlassian.net/',
			{
				method: 'GET',
			},
		);

		const calledUrl = fetchSpy.mock.calls[0][0];
		expect(calledUrl).not.toContain('atlassian.net//');
		expect(calledUrl).toBe('https://test.atlassian.net/rest/api/3/myself');
	});

	it('should not contain double slashes when cloudUrl has a trailing slash in uploadJiraAttachment', async () => {
		await uploadJiraAttachment(
			'PROJ-1',
			'user@example.com:token',
			'https://test.atlassian.net/',
			{
				name: 'test.txt',
				content: 'aGVsbG8=',
			},
		);

		const calledUrl = fetchSpy.mock.calls[0][0];
		expect(calledUrl).not.toContain('atlassian.net//');
		expect(calledUrl).toBe(
			'https://test.atlassian.net/rest/api/3/issue/PROJ-1/attachments',
		);
	});

	it('should not contain double slashes when cloudUrl has a trailing slash in makeJiraAgileRequest', async () => {
		await makeJiraAgileRequest(
			'board',
			'user@example.com:token',
			'https://test.atlassian.net/',
			{
				method: 'GET',
			},
		);

		const calledUrl = fetchSpy.mock.calls[0][0];
		expect(calledUrl).not.toContain('atlassian.net//');
		expect(calledUrl).toBe('https://test.atlassian.net/rest/agile/1.0/board');
	});
});
