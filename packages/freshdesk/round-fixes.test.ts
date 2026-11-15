import { ApiError, request } from 'corsair/http';
import { makeFreshdeskRequest } from './client';
import { Routes } from './endpoints';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import { createFreshdeskRouteInputSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { FreshdeskContext } from './index';
import { freshdeskEndpointMeta } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function buildContext(): FreshdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: { domain: 'acme.freshdesk.com' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			get_domain: () => Promise.resolve(null),
			set_domain: () => Promise.resolve(),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const attachment = {
	filename: 'a.txt',
	contentType: 'text/plain',
	base64: 'SGk=',
};

const structuredBody = {
	body_contents: [{ type: 'text', data: { content: 'Hi tom, Still Angry' } }],
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockResolvedValue({ id: 1 });
});

describe('Freshdesk bot round fixes', () => {
	// The reference's multipart samples send structured_body as one JSON part:
	// -F 'structured_body={"body_contents":[...]}'
	it.each([
		['addNoteToATicketPostNotes', { ticketId: '20' }],
		['replyTicketPostReply', { id: '27' }],
	] as const)(
		'sends structured_body on %s as one JSON multipart part',
		async (name, pathParams) => {
			await makeFreshdeskRequest(
				buildContext(),
				'test-api-key',
				FRESHDESK_OPERATIONS[name],
				{
					pathParams,
					body: { structured_body: structuredBody },
					attachments: [attachment],
				},
			);
			const body = mockedRequest.mock.calls.at(-1)?.[1].body;
			if (!(body instanceof FormData))
				throw new Error('Expected multipart body');
			expect(body.get('structured_body')).toBe(JSON.stringify(structuredBody));
			expect(body.get('structured_body[body_contents]')).toBeNull();
		},
	);

	it('rethrows provider failures as a core ApiError without customer data', async () => {
		mockedRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'GET',
					url: '/api/v2/search/tickets',
					query: { query: '"email:\'private-user@freshdesk.invalid\'"' },
					body: { email: 'private-user@freshdesk.invalid' },
				},
				{
					url: "https://acme.freshdesk.com/api/v2/search/tickets?query=email:'private-user@freshdesk.invalid'",
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: {
						description: 'Validation failed',
						errors: [
							{
								field: 'email',
								message: 'private-user@freshdesk.invalid is invalid',
								code: 'invalid_value',
							},
						],
					},
				},
				'Validation failed for private-user@freshdesk.invalid',
				{ retryAfter: 4000 },
			),
		);
		const caught = await makeFreshdeskRequest(
			buildContext(),
			'test-api-key',
			FRESHDESK_OPERATIONS.filterTicketsGetTickets,
			{ query: { query: '"email:\'private-user@freshdesk.invalid\'"' } },
			// unknown because Promise rejections do not have a guaranteed static type.
		).catch((error: unknown) => error);
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
		expect(caught.status).toBe(400);
		expect(caught.retryAfter).toBe(4000);
		expect(caught.message).toContain('email: invalid_value');
		expect(JSON.stringify(caught)).not.toContain('private-user');
		expect(caught.message).not.toContain('private-user');
		expect(caught.url).not.toContain('private-user');
		expect(caught.request.query).toBeUndefined();
		expect(caught.request.body).toBeUndefined();
		expect(caught.body).toBeUndefined();
	});

	it('retries a rate-limited GET ApiError twice and never replays a write', async () => {
		const limited = (method: 'GET' | 'POST') =>
			new ApiError(
				{ method, url: '/api/v2/tickets' },
				{
					url: 'https://acme.freshdesk.com/api/v2/tickets',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: undefined,
				},
				'Freshdesk API request failed with status 429',
				{ retryAfter: 4000 },
			);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(limited('GET'))).toBe(true);
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(limited('GET')),
		).toEqual({ maxRetries: 2, headersRetryAfterMs: 4000 });
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(limited('POST')),
		).toEqual({ maxRetries: 0, headersRetryAfterMs: 4000 });
	});

	// R8: an operation that can send a message or notification is destructive.
	it.each([
		'bulkUpdateTicketsPostBulkUpdate',
		'addNoteToATicketPostNotes',
	] as const)('marks %s destructive', (name) => {
		expect(freshdeskEndpointMeta[`routes.${name}.run`].riskLevel).toBe(
			'destructive',
		);
	});

	it('requires the mandatory outbound email fields', () => {
		const schema = createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createOutboundEmailPostOutboundEmail,
		);
		expect(schema.safeParse({}).success).toBe(false);
		expect(
			schema.safeParse({ body: { subject: 'Hi', email_config_id: 1 } }).success,
		).toBe(false);
		expect(
			schema.safeParse({
				body: {
					subject: 'Support Needed...',
					email: 'tom@outerspace.com',
					email_config_id: 1,
					description: 'Details about the issue...',
				},
			}).success,
		).toBe(true);
	});

	it('forwards the canned_responses envelope through the bulk route', async () => {
		const body = {
			canned_responses: [
				{ title: 'Greeting', content_html: '<p>Hello</p>', folder_id: 2 },
			],
		};
		await Routes.bulkCreateCannedResponsesPostBulk.run(buildContext(), {
			body,
		});
		expect(mockedRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'POST',
			body,
		});
	});
});
