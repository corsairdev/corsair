import { logEventFromContext } from 'corsair/core';
import { textItEndpointsNested } from './endpoints';
import { textItEndpointSchemas, textit } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

type Endpoint = (ctx: never, input: never) => Promise<unknown>;
const ctx = { key: 'test-token' } as never;
const page = { next: null, previous: null, results: [] };
const file = new Blob(['image bytes'], { type: 'image/png' });

type Case = {
	operation: string;
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	input: unknown;
	query?: Record<string, string>;
	body?: unknown;
	response?: unknown;
	status?: number;
};

const cases: Case[] = [
	{
		operation: 'archives.list',
		method: 'GET',
		path: 'archives',
		input: { type: 'message' },
		query: { type: 'message' },
		response: page,
	},
	{
		operation: 'broadcasts.list',
		method: 'GET',
		path: 'broadcasts',
		input: {},
		response: page,
	},
	{
		operation: 'broadcasts.send',
		method: 'POST',
		path: 'broadcasts',
		input: { contacts: ['contact'], text: { eng: 'Hello' } },
		body: { contacts: ['contact'], text: { eng: 'Hello' } },
		response: { uuid: 'broadcast', text: { eng: 'Hello' } },
	},
	{
		operation: 'campaigns.list',
		method: 'GET',
		path: 'campaigns',
		input: {},
		response: page,
	},
	{
		operation: 'campaigns.create',
		method: 'POST',
		path: 'campaigns',
		input: { name: 'Reminders', group: 'group' },
		body: { name: 'Reminders', group: 'group' },
		response: { uuid: 'campaign', name: 'Reminders' },
	},
	{
		operation: 'campaigns.update',
		method: 'POST',
		path: 'campaigns',
		input: { uuid: 'campaign', name: 'New' },
		query: { uuid: 'campaign' },
		body: { name: 'New' },
		response: { uuid: 'campaign', name: 'New' },
	},
	{
		operation: 'campaignEvents.list',
		method: 'GET',
		path: 'campaign_events',
		input: {},
		response: page,
	},
	{
		operation: 'campaignEvents.create',
		method: 'POST',
		path: 'campaign_events',
		input: {
			campaign: 'campaign',
			relative_to: 'date',
			offset: 7,
			unit: 'days',
			delivery_hour: 9,
			message: 'Hello',
		},
		body: {
			campaign: 'campaign',
			relative_to: 'date',
			offset: 7,
			unit: 'days',
			delivery_hour: 9,
			message: 'Hello',
		},
		response: { uuid: 'event', flow: null, message: { eng: 'Hello' } },
	},
	{
		operation: 'campaignEvents.update',
		method: 'POST',
		path: 'campaign_events',
		input: {
			uuid: 'event',
			body: {
				relative_to: 'date',
				offset: 7,
				unit: 'days',
				delivery_hour: -1,
				flow: 'flow',
			},
		},
		query: { uuid: 'event' },
		body: {
			relative_to: 'date',
			offset: 7,
			unit: 'days',
			delivery_hour: -1,
			flow: 'flow',
		},
		response: { uuid: 'event', message: null },
	},
	{
		operation: 'campaignEvents.delete',
		method: 'DELETE',
		path: 'campaign_events',
		input: { uuid: 'event' },
		query: { uuid: 'event' },
		status: 204,
	},
	{
		operation: 'channels.list',
		method: 'GET',
		path: 'channels',
		input: {},
		response: page,
	},
	{
		operation: 'contacts.list',
		method: 'GET',
		path: 'contacts',
		input: {},
		response: page,
	},
	{
		operation: 'contacts.create',
		method: 'POST',
		path: 'contacts',
		input: { name: 'Ben', urns: ['tel:+12065551212'] },
		body: { name: 'Ben', urns: ['tel:+12065551212'] },
		response: { uuid: 'contact', name: 'Ben', language: null, flow: null },
	},
	{
		operation: 'contacts.update',
		method: 'POST',
		path: 'contacts',
		input: {
			query: { urn: 'tel:+12065551212' },
			body: { fields: { nickname: 'Ben' } },
		},
		query: { urn: 'tel:+12065551212' },
		body: { fields: { nickname: 'Ben' } },
		response: { uuid: 'contact', fields: { nickname: 'Ben' } },
		status: 201,
	},
	{
		operation: 'contacts.delete',
		method: 'DELETE',
		path: 'contacts',
		input: { uuid: 'contact' },
		query: { uuid: 'contact' },
		status: 204,
	},
	{
		operation: 'contactActions.apply',
		method: 'POST',
		path: 'contact_actions',
		input: { contacts: ['contact'], action: 'add', group: 'group' },
		body: { contacts: ['contact'], action: 'add', group: 'group' },
		status: 204,
	},
	{
		operation: 'fields.list',
		method: 'GET',
		path: 'fields',
		input: {},
		response: page,
	},
	{
		operation: 'fields.create',
		method: 'POST',
		path: 'fields',
		input: { name: 'Nickname', type: 'text' },
		body: { name: 'Nickname', type: 'text' },
		response: { key: 'nickname', name: 'Nickname', type: 'text' },
	},
	{
		operation: 'fields.update',
		method: 'POST',
		path: 'fields',
		input: { key: 'nickname', name: 'New' },
		query: { key: 'nickname' },
		body: { name: 'New' },
		response: { key: 'nickname', name: 'New' },
	},
	{
		operation: 'flowStarts.list',
		method: 'GET',
		path: 'flow_starts',
		input: {},
		response: page,
	},
	{
		operation: 'flowStarts.create',
		method: 'POST',
		path: 'flow_starts',
		input: { flow: 'flow', contacts: ['contact'] },
		body: { flow: 'flow', contacts: ['contact'] },
		response: { uuid: 'start', status: 'pending' },
	},
	{
		operation: 'flows.list',
		method: 'GET',
		path: 'flows',
		input: {},
		response: page,
	},
	{
		operation: 'globals.list',
		method: 'GET',
		path: 'globals',
		input: {},
		response: page,
	},
	{
		operation: 'globals.create',
		method: 'POST',
		path: 'globals',
		input: { name: 'Name', value: 'Value' },
		body: { name: 'Name', value: 'Value' },
		response: { key: 'name', name: 'Name', value: 'Value' },
	},
	{
		operation: 'globals.update',
		method: 'POST',
		path: 'globals',
		input: { key: 'name', value: 'New' },
		query: { key: 'name' },
		body: { value: 'New' },
		response: { key: 'name', value: 'New' },
	},
	{
		operation: 'groups.list',
		method: 'GET',
		path: 'groups',
		input: {},
		response: page,
	},
	{
		operation: 'groups.create',
		method: 'POST',
		path: 'groups',
		input: { name: 'Group' },
		body: { name: 'Group' },
		response: { uuid: 'group', name: 'Group', query: null },
	},
	{
		operation: 'groups.update',
		method: 'POST',
		path: 'groups',
		input: { uuid: 'group', name: 'New' },
		query: { uuid: 'group' },
		body: { name: 'New' },
		response: { uuid: 'group', name: 'New' },
	},
	{
		operation: 'groups.delete',
		method: 'DELETE',
		path: 'groups',
		input: { uuid: 'group' },
		query: { uuid: 'group' },
		status: 204,
	},
	{
		operation: 'labels.list',
		method: 'GET',
		path: 'labels',
		input: {},
		response: page,
	},
	{
		operation: 'labels.create',
		method: 'POST',
		path: 'labels',
		input: { name: 'Label' },
		body: { name: 'Label' },
		response: { uuid: 'label', name: 'Label' },
	},
	{
		operation: 'labels.update',
		method: 'POST',
		path: 'labels',
		input: { uuid: 'label', name: 'New' },
		query: { uuid: 'label' },
		body: { name: 'New' },
		response: { uuid: 'label', name: 'New' },
	},
	{
		operation: 'labels.delete',
		method: 'DELETE',
		path: 'labels',
		input: { uuid: 'label' },
		query: { uuid: 'label' },
		status: 204,
	},
	{
		operation: 'media.upload',
		method: 'POST',
		path: 'media',
		input: { file },
		response: {
			uuid: 'media',
			content_type: 'image/png',
			url: 'https://example.com/image.png',
			filename: 'image.png',
			size: 11,
		},
	},
	{
		operation: 'messages.list',
		method: 'GET',
		path: 'messages',
		input: {},
		response: page,
	},
	{
		operation: 'messages.send',
		method: 'POST',
		path: 'messages',
		input: { contact: 'contact', text: 'Hello' },
		body: { contact: 'contact', text: 'Hello' },
		response: { uuid: 'message', text: 'Hello', sent_on: null },
	},
	{
		operation: 'messageActions.apply',
		method: 'POST',
		path: 'message_actions',
		input: { messages: [123, 456], action: 'delete' },
		body: { messages: [123, 456], action: 'delete' },
		response: { failures: [456] },
	},
	{
		operation: 'runs.list',
		method: 'GET',
		path: 'runs',
		input: {},
		response: page,
	},
	{
		operation: 'resthooks.list',
		method: 'GET',
		path: 'resthooks',
		input: {},
		response: page,
	},
	{
		operation: 'resthookEvents.list',
		method: 'GET',
		path: 'resthook_events',
		input: {},
		response: page,
	},
	{
		operation: 'resthookSubscribers.list',
		method: 'GET',
		path: 'resthook_subscribers',
		input: {},
		response: page,
	},
	{
		operation: 'resthookSubscribers.create',
		method: 'POST',
		path: 'resthook_subscribers',
		input: { resthook: 'new-report', target_url: 'https://example.com/hook' },
		body: { resthook: 'new-report', target_url: 'https://example.com/hook' },
		response: {
			id: '10404016',
			resthook: 'new-report',
			target_url: 'https://example.com/hook',
		},
	},
	{
		operation: 'resthookSubscribers.delete',
		method: 'DELETE',
		path: 'resthook_subscribers',
		input: { id: 10404016 },
		query: { id: '10404016' },
		status: 204,
	},
	{
		operation: 'tickets.list',
		method: 'GET',
		path: 'tickets',
		input: {},
		response: page,
	},
	{
		operation: 'ticketActions.apply',
		method: 'POST',
		path: 'ticket_actions',
		input: {
			tickets: ['ticket'],
			action: 'assign',
			assignee: 'jim@example.com',
		},
		body: {
			tickets: ['ticket'],
			action: 'assign',
			assignee: 'jim@example.com',
		},
		status: 204,
	},
	{
		operation: 'topics.list',
		method: 'GET',
		path: 'topics',
		input: {},
		response: page,
	},
	{
		operation: 'topics.create',
		method: 'POST',
		path: 'topics',
		input: { name: 'Support' },
		body: { name: 'Support' },
		response: { uuid: 'topic', name: 'Support' },
	},
	{
		operation: 'users.list',
		method: 'GET',
		path: 'users',
		input: {},
		response: page,
	},
	{
		operation: 'workspace.get',
		method: 'GET',
		path: 'workspace',
		input: {},
		response: { uuid: 'workspace', name: 'TextIt', languages: ['eng'] },
	},
];

function endpoint(operation: string): Endpoint {
	const [group, name] = operation.split('.');
	const tree = textItEndpointsNested as unknown as Record<
		string,
		Record<string, Endpoint>
	>;
	const fn = group && name ? tree[group]?.[name] : undefined;
	if (!fn) throw new Error(`Unknown operation ${operation}`);
	return fn;
}

function response(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(status === 204 ? null : JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

describe('TextIt public request seam', () => {
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('covers every registered operation exactly once', () => {
		const operations = Object.entries(textItEndpointsNested).flatMap(
			([group, methods]) =>
				Object.keys(methods).map((name) => `${group}.${name}`),
		);
		expect(cases.map((c) => c.operation).sort()).toEqual(operations.sort());
		expect(Object.keys(textItEndpointSchemas).sort()).toEqual(
			operations.sort(),
		);
		expect(Object.keys(textit().endpointMeta ?? {}).sort()).toEqual(
			operations.sort(),
		);
	});

	it.each(cases)(
		'$operation sends the documented request and parses its response',
		async (c) => {
			fetchMock.mockResolvedValueOnce(response(c.response, c.status));
			const result = await endpoint(c.operation)(ctx, c.input as never);
			expect(result).toEqual(c.response);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
			const parsed = new URL(url);
			expect(parsed.origin + parsed.pathname).toBe(
				`https://textit.com/api/v2/${c.path}.json`,
			);
			expect(Object.fromEntries(parsed.searchParams)).toEqual(c.query ?? {});
			expect(request.method).toBe(c.method);
			expect(new Headers(request.headers).get('Authorization')).toBe(
				'Token test-token',
			);
			if (c.operation === 'media.upload') {
				expect(request.body).toBeInstanceOf(FormData);
				expect((request.body as FormData).get('file')).toBeInstanceOf(Blob);
				expect(new Headers(request.headers).get('Content-Type')).toBeNull();
			} else if (c.body !== undefined) {
				expect(JSON.parse(request.body as string)).toEqual(c.body);
				expect(new Headers(request.headers).get('Content-Type')).toContain(
					'application/json',
				);
			} else {
				expect(request.body).toBeUndefined();
			}
		},
	);

	it('passes a non-first cursor and preserves nullable fields and extra values', async () => {
		const resultPage = {
			next: null,
			previous: 'https://textit.com/api/v2/contacts.json?cursor=previous',
			results: [
				{
					uuid: 'contact',
					language: null,
					flow: null,
					fields: { cleared: null },
					extra: 'preserved',
				},
			],
		};
		fetchMock.mockResolvedValueOnce(response(resultPage));
		await expect(
			textItEndpointsNested.contacts.list(ctx, { cursor: 'next+page/=' }),
		).resolves.toEqual(resultPage);
		const url = new URL(fetchMock.mock.calls[0]?.[0] as string);
		expect(url.searchParams.get('cursor')).toBe('next+page/=');
	});

	it('returns undefined for a successful bulk message action', async () => {
		fetchMock.mockResolvedValueOnce(response(undefined, 204));
		await expect(
			textItEndpointsNested.messageActions.apply(ctx, {
				messages: [123],
				action: 'archive',
			}),
		).resolves.toBeUndefined();
	});

	it('rejects invalid inputs before sending a request', async () => {
		await expect(
			textItEndpointsNested.contacts.update(ctx, {
				query: { urn: 'tel:+123' },
				body: { urns: ['tel:+456'] },
			}),
		).rejects.toThrow();
		await expect(
			textItEndpointsNested.messageActions.apply(ctx, {
				messages: [1],
				action: 'label',
			}),
		).rejects.toThrow();
		await expect(
			textItEndpointsNested.groups.delete(ctx, { uuid: '' }),
		).rejects.toThrow();
		await expect(
			textItEndpointsNested.contacts.delete(ctx, {
				uuid: 'contact',
				urn: 'tel:+123',
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('never logs request or response data', async () => {
		fetchMock.mockResolvedValueOnce(
			response({ uuid: 'contact', name: 'Private' }),
		);
		await textItEndpointsNested.contacts.create(ctx, { name: 'Private' });
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'textit.contacts.create',
			{},
			'completed',
		);
	});
});
