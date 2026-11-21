import type { z } from 'zod';
import type { DefinedMailcoachOperation } from './endpoints/operation';
import { MailcoachOperations } from './endpoints/operations';
import type {
	MailcoachEndpointInputs,
	MailcoachJsonValue,
} from './endpoints/types';
import { MailcoachEndpointInputSchemas } from './endpoints/types';
import type { MailcoachContext } from './index';

type Context = Parameters<
	(typeof MailcoachOperations)['user.get']['endpoint']
>[0];
type OperationName = keyof typeof MailcoachOperations;
type OperationCase = {
	name: OperationName;
	path: string;
	method: string;
	expectedBody: Record<string, MailcoachJsonValue | undefined> | undefined;
	// `unknown` because each route has a different validated output schema.
	input: (context: Context) => Promise<unknown>;
};

const TEAM_API_URL = 'https://team.mailcoach.app/api';
const API_KEY = 'mailcoach-test-token';
const EMAIL_LIST_UUID = '00000000-0000-4000-8000-000000000001';
const RESOURCE_UUID = '00000000-0000-4000-8000-000000000002';

function buildContext(apiUrl = TEAM_API_URL): Context {
	const context: MailcoachContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: API_KEY,
		options: { apiUrl: TEAM_API_URL },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(API_KEY),
			set_api_key: () => Promise.resolve(),
			get_api_url: () => Promise.resolve(apiUrl),
			set_api_url: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

function operationCase<I extends z.ZodType, O extends z.ZodType>(
	name: OperationName,
	operation: DefinedMailcoachOperation<I, O>,
	input: z.input<I>,
	path: string,
): OperationCase {
	const parsedInput = operation.inputSchema.parse(input);
	return {
		name,
		path,
		method: operation.method,
		expectedBody: operation.body?.(parsedInput),
		input: async (context) => operation.endpoint(context, input),
	};
}

const U = RESOURCE_UUID;
const L = EMAIL_LIST_UUID;
const cases: OperationCase[] = [
	operationCase('user.get', MailcoachOperations['user.get'], {}, '/api/user'),
	operationCase(
		'emailLists.list',
		MailcoachOperations['emailLists.list'],
		{ query: { filter: { search: 'newsletter' }, sort: '-created_at' } },
		'/api/email-lists',
	),
	operationCase(
		'emailLists.get',
		MailcoachOperations['emailLists.get'],
		{ emailListUuid: L },
		`/api/email-lists/${L}`,
	),
	operationCase(
		'emailLists.create',
		MailcoachOperations['emailLists.create'],
		{
			name: 'Newsletter',
			default_from_email: 'sender@example.invalid',
			default_from_name: 'Team',
		},
		'/api/email-lists',
	),
	operationCase(
		'emailLists.update',
		MailcoachOperations['emailLists.update'],
		{
			emailListUuid: L,
			body: { name: 'Updated', default_from_email: 'sender@example.invalid' },
		},
		`/api/email-lists/${L}`,
	),
	operationCase(
		'emailLists.delete',
		MailcoachOperations['emailLists.delete'],
		{ emailListUuid: L },
		`/api/email-lists/${L}`,
	),
	operationCase(
		'subscribers.list',
		MailcoachOperations['subscribers.list'],
		{
			emailListUuid: L,
			query: { filter: { status: 'subscribed' }, sort: 'email' },
		},
		`/api/email-lists/${L}/subscribers`,
	),
	operationCase(
		'subscribers.get',
		MailcoachOperations['subscribers.get'],
		{ subscriberUuid: U },
		`/api/subscribers/${U}`,
	),
	operationCase(
		'subscribers.subscribe',
		MailcoachOperations['subscribers.subscribe'],
		{
			emailListUuid: L,
			body: {
				email: 'person@example.invalid',
				first_name: 'Sample',
				skip_confirmation: false,
			},
		},
		`/api/email-lists/${L}/subscribers`,
	),
	operationCase(
		'subscribers.update',
		MailcoachOperations['subscribers.update'],
		{ subscriberUuid: U, body: { first_name: 'Updated', append_tags: true } },
		`/api/subscribers/${U}`,
	),
	operationCase(
		'subscribers.delete',
		MailcoachOperations['subscribers.delete'],
		{ subscriberUuid: U },
		`/api/subscribers/${U}`,
	),
	operationCase(
		'subscribers.confirm',
		MailcoachOperations['subscribers.confirm'],
		{ subscriberUuid: U },
		`/api/subscribers/${U}/confirm`,
	),
	operationCase(
		'subscribers.confirmByEmail',
		MailcoachOperations['subscribers.confirmByEmail'],
		{ emailListUuid: L, email: 'person@example.invalid' },
		`/api/email-lists/${L}/confirm`,
	),
	operationCase(
		'subscribers.unsubscribe',
		MailcoachOperations['subscribers.unsubscribe'],
		{ subscriberUuid: U },
		`/api/subscribers/${U}/unsubscribe`,
	),
	operationCase(
		'subscribers.unsubscribeByEmail',
		MailcoachOperations['subscribers.unsubscribeByEmail'],
		{ emailListUuid: L, email: 'person@example.invalid' },
		`/api/email-lists/${L}/unsubscribe`,
	),
	operationCase(
		'subscribers.resendConfirmation',
		MailcoachOperations['subscribers.resendConfirmation'],
		{ subscriberUuid: U },
		`/api/subscribers/${U}/resend-confirmation`,
	),
	operationCase(
		'subscribers.resendConfirmationByEmail',
		MailcoachOperations['subscribers.resendConfirmationByEmail'],
		{ emailListUuid: L, email: 'person@example.invalid' },
		`/api/email-lists/${L}/resend-confirmation`,
	),
	operationCase(
		'subscribers.addTags',
		MailcoachOperations['subscribers.addTags'],
		{ subscriberUuid: U, body: { tags: ['reader'] } },
		`/api/subscribers/${U}/tags`,
	),
	operationCase(
		'subscribers.removeTags',
		MailcoachOperations['subscribers.removeTags'],
		{ subscriberUuid: U, body: { tags: ['reader'] } },
		`/api/subscribers/${U}/tags`,
	),
	operationCase(
		'subscriberImports.list',
		MailcoachOperations['subscriberImports.list'],
		{ next: `${TEAM_API_URL}/subscriber-imports?page=2` },
		'/api/subscriber-imports',
	),
	operationCase(
		'subscriberImports.get',
		MailcoachOperations['subscriberImports.get'],
		{ importUuid: U },
		`/api/subscriber-imports/${U}`,
	),
	operationCase(
		'subscriberImports.create',
		MailcoachOperations['subscriberImports.create'],
		{
			subscribers_csv: 'email\nperson@example.invalid',
			email_list_uuid: L,
			replace_tags: false,
		},
		'/api/subscriber-imports',
	),
	operationCase(
		'subscriberImports.update',
		MailcoachOperations['subscriberImports.update'],
		{
			importUuid: U,
			body: {
				subscribers_csv: 'email\nperson@example.invalid',
				email_list_uuid: L,
			},
		},
		`/api/subscriber-imports/${U}`,
	),
	operationCase(
		'subscriberImports.delete',
		MailcoachOperations['subscriberImports.delete'],
		{ importUuid: U },
		`/api/subscriber-imports/${U}`,
	),
	operationCase(
		'subscriberImports.append',
		MailcoachOperations['subscriberImports.append'],
		{ importUuid: U, subscribers_csv: 'person@example.invalid' },
		`/api/subscriber-imports/${U}/append`,
	),
	operationCase(
		'subscriberImports.start',
		MailcoachOperations['subscriberImports.start'],
		{ importUuid: U },
		`/api/subscriber-imports/${U}/start`,
	),
	operationCase(
		'tags.list',
		MailcoachOperations['tags.list'],
		{ emailListUuid: L },
		`/api/email-lists/${L}/tags`,
	),
	operationCase(
		'tags.get',
		MailcoachOperations['tags.get'],
		{ emailListUuid: L, tagUuid: U },
		`/api/email-lists/${L}/tags/${U}`,
	),
	operationCase(
		'tags.create',
		MailcoachOperations['tags.create'],
		{
			emailListUuid: L,
			body: { name: 'reader', visible_in_preferences: true },
		},
		`/api/email-lists/${L}/tags`,
	),
	operationCase(
		'tags.update',
		MailcoachOperations['tags.update'],
		{
			emailListUuid: L,
			tagUuid: U,
			body: { name: 'updated', visible_in_preferences: false },
		},
		`/api/email-lists/${L}/tags/${U}`,
	),
	operationCase(
		'tags.delete',
		MailcoachOperations['tags.delete'],
		{ emailListUuid: L, tagUuid: U },
		`/api/email-lists/${L}/tags/${U}`,
	),
	operationCase(
		'segments.list',
		MailcoachOperations['segments.list'],
		{ emailListUuid: L },
		`/api/email-lists/${L}/segments`,
	),
	operationCase(
		'segments.get',
		MailcoachOperations['segments.get'],
		{ emailListUuid: L, segmentUuid: U },
		`/api/email-lists/${L}/segments/${U}`,
	),
	operationCase(
		'segments.create',
		MailcoachOperations['segments.create'],
		{
			emailListUuid: L,
			body: {
				name: 'Readers',
				positive_tags: ['reader'],
				negative_tags: [],
				all_positive_tags_required: true,
				all_negative_tags_required: false,
			},
		},
		`/api/email-lists/${L}/segments`,
	),
	operationCase(
		'segments.update',
		MailcoachOperations['segments.update'],
		{
			emailListUuid: L,
			segmentUuid: U,
			body: {
				name: 'Readers',
				positive_tags: ['reader'],
				negative_tags: [],
				all_positive_tags_required: true,
				all_negative_tags_required: false,
			},
		},
		`/api/email-lists/${L}/segments/${U}`,
	),
	operationCase(
		'segments.delete',
		MailcoachOperations['segments.delete'],
		{ emailListUuid: L, segmentUuid: U },
		`/api/email-lists/${L}/segments/${U}`,
	),
	operationCase(
		'templates.list',
		MailcoachOperations['templates.list'],
		{ query: { filter: { search: 'newsletter' }, sort: '-updated_at' } },
		'/api/templates',
	),
	operationCase(
		'templates.get',
		MailcoachOperations['templates.get'],
		{ templateUuid: U },
		`/api/templates/${U}`,
	),
	operationCase(
		'templates.create',
		MailcoachOperations['templates.create'],
		{ name: 'Newsletter', html: '<p>Hello</p>' },
		'/api/templates',
	),
	operationCase(
		'templates.update',
		MailcoachOperations['templates.update'],
		{ templateUuid: U, body: { name: 'Newsletter', html: '<p>Updated</p>' } },
		`/api/templates/${U}`,
	),
	operationCase(
		'templates.delete',
		MailcoachOperations['templates.delete'],
		{ templateUuid: U },
		`/api/templates/${U}`,
	),
	operationCase(
		'campaigns.list',
		MailcoachOperations['campaigns.list'],
		{ query: { filter: { status: 'draft' }, sort: '-name' } },
		'/api/campaigns',
	),
	operationCase(
		'campaigns.get',
		MailcoachOperations['campaigns.get'],
		{ campaignUuid: U },
		`/api/campaigns/${U}`,
	),
	operationCase(
		'campaigns.create',
		MailcoachOperations['campaigns.create'],
		{
			name: 'November notes',
			email_list_uuid: L,
			subject: 'News',
			html: '<p>Hello</p>',
		},
		'/api/campaigns',
	),
	operationCase(
		'campaigns.update',
		MailcoachOperations['campaigns.update'],
		{
			campaignUuid: U,
			body: {
				name: 'November notes',
				email_list_uuid: L,
				html: '<p>Updated</p>',
			},
		},
		`/api/campaigns/${U}`,
	),
	operationCase(
		'campaigns.delete',
		MailcoachOperations['campaigns.delete'],
		{ campaignUuid: U },
		`/api/campaigns/${U}`,
	),
	operationCase(
		'campaigns.sendTest',
		MailcoachOperations['campaigns.sendTest'],
		{ campaignUuid: U, email: 'test@example.invalid' },
		`/api/campaigns/${U}/send-test`,
	),
	operationCase(
		'campaigns.send',
		MailcoachOperations['campaigns.send'],
		{ campaignUuid: U },
		`/api/campaigns/${U}/send`,
	),
	operationCase(
		'campaigns.opens',
		MailcoachOperations['campaigns.opens'],
		{ campaignUuid: U },
		`/api/campaigns/${U}/opens`,
	),
	operationCase(
		'campaigns.clicks',
		MailcoachOperations['campaigns.clicks'],
		{ campaignUuid: U },
		`/api/campaigns/${U}/clicks`,
	),
	operationCase(
		'campaigns.unsubscribes',
		MailcoachOperations['campaigns.unsubscribes'],
		{ campaignUuid: U },
		`/api/campaigns/${U}/unsubscribes`,
	),
	operationCase(
		'campaigns.bounces',
		MailcoachOperations['campaigns.bounces'],
		{ campaignUuid: U },
		`/api/campaigns/${U}/bounces`,
	),
	operationCase(
		'transactionalMails.send',
		MailcoachOperations['transactionalMails.send'],
		{
			from: 'Team <sender@example.invalid>',
			to: 'recipient@example.invalid',
			subject: 'Welcome',
			html: '<p>Hello</p>',
			fake: true,
		},
		'/api/transactional-mails/send',
	),
	operationCase(
		'transactionalMails.listTemplates',
		MailcoachOperations['transactionalMails.listTemplates'],
		{ query: { filter: { name: 'welcome' }, sort: '-created_at' } },
		'/api/transactional-mails/templates',
	),
	operationCase(
		'transactionalMails.getTemplate',
		MailcoachOperations['transactionalMails.getTemplate'],
		{ templateUuid: U },
		`/api/transactional-mails/templates/${U}`,
	),
	operationCase(
		'automationMails.list',
		MailcoachOperations['automationMails.list'],
		{ query: { filter: { name: 'welcome' }, sort: 'name' } },
		'/api/automation-mails',
	),
	operationCase(
		'automationMails.get',
		MailcoachOperations['automationMails.get'],
		{ automationMailUuid: U },
		`/api/automation-mails/${U}`,
	),
	operationCase(
		'automationMails.create',
		MailcoachOperations['automationMails.create'],
		{ name: 'Welcome', html: '<p>Welcome</p>' },
		'/api/automation-mails',
	),
	operationCase(
		'automationMails.update',
		MailcoachOperations['automationMails.update'],
		{
			automationMailUuid: U,
			body: { name: 'Welcome', html: '<p>Updated</p>' },
		},
		`/api/automation-mails/${U}`,
	),
	operationCase(
		'automationMails.delete',
		MailcoachOperations['automationMails.delete'],
		{ automationMailUuid: U },
		`/api/automation-mails/${U}`,
	),
	operationCase(
		'sends.list',
		MailcoachOperations['sends.list'],
		{ query: { filter: { subscriber_uuid: U }, sort: '-sent_at' } },
		'/api/sends',
	),
	operationCase(
		'sends.get',
		MailcoachOperations['sends.get'],
		{ sendUuid: U },
		`/api/sends/${U}`,
	),
	operationCase(
		'sends.delete',
		MailcoachOperations['sends.delete'],
		{ sendUuid: U },
		`/api/sends/${U}`,
	),
	operationCase(
		'links.get',
		MailcoachOperations['links.get'],
		{ linkUuid: U },
		`/api/links/${U}`,
	),
	operationCase(
		'suppressions.list',
		MailcoachOperations['suppressions.list'],
		{ query: { filter: { reason: 'manual' }, sort: '-created_at' } },
		'/api/suppressions',
	),
	operationCase(
		'suppressions.get',
		MailcoachOperations['suppressions.get'],
		{ identifier: 'person@example.invalid' },
		'/api/suppressions/person%40example.invalid',
	),
	operationCase(
		'suppressions.create',
		MailcoachOperations['suppressions.create'],
		{ email: 'blocked@example.invalid' },
		'/api/suppressions',
	),
	operationCase(
		'suppressions.delete',
		MailcoachOperations['suppressions.delete'],
		{ identifier: 'person@example.invalid' },
		'/api/suppressions/person%40example.invalid',
	),
	operationCase(
		'uploads.create',
		MailcoachOperations['uploads.create'],
		{
			images: [
				{
					name: 'pixel.png',
					base64:
						'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/mk0AAAAASUVORK5CYII=',
				},
			],
		},
		'/api/uploads',
	),
];

function mockResponse(name: OperationName): MailcoachJsonValue | undefined {
	if (name === 'user.get')
		return { data: { id: 1, email: 'owner@example.invalid' } };
	if (name === 'transactionalMails.send') return { uuid: RESOURCE_UUID };
	if (name === 'uploads.create') return { data: [] };
	if (name === 'links.get') {
		return {
			data: {
				uuid: RESOURCE_UUID,
				url: 'https://www.example.invalid/campaign',
				unique_click_count: 2,
				click_count: 3,
				clicks: [],
			},
		};
	}
	if (
		name.endsWith('.list') ||
		name === 'transactionalMails.listTemplates' ||
		name.startsWith('campaigns.')
	) {
		if (
			name.endsWith('.list') ||
			name === 'transactionalMails.listTemplates' ||
			name === 'campaigns.opens' ||
			name === 'campaigns.clicks' ||
			name === 'campaigns.unsubscribes' ||
			name === 'campaigns.bounces'
		) {
			return { data: [], links: { next: null }, meta: { total: 0 } };
		}
	}
	const operation = MailcoachOperations[name];
	if (operation.outputSchema.safeParse(undefined).success) return undefined;
	return { data: { uuid: RESOURCE_UUID } };
}

describe('Mailcoach endpoints', () => {
	const context = buildContext();
	let fetchSpy: jest.SpyInstance;
	let responseBody: MailcoachJsonValue | undefined;

	beforeEach(() => {
		fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
			if (responseBody === undefined)
				return new Response(null, { status: 204 });
			return new Response(JSON.stringify(responseBody), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		});
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('registers a tested case for every documented operation', async () => {
		expect(cases.map(({ name }) => name).sort()).toEqual(
			Object.keys(MailcoachOperations).sort(),
		);

		for (const testCase of cases) {
			fetchSpy.mockClear();
			responseBody = mockResponse(testCase.name);
			const result = await testCase.input(context);
			expect(result).toEqual(responseBody);
			expect(fetchSpy).toHaveBeenCalledTimes(1);

			const [requestUrl, requestInit] = fetchSpy.mock.calls[0] ?? [];
			const url = new URL(String(requestUrl));
			expect(url.origin).toBe('https://team.mailcoach.app');
			expect(url.pathname).toBe(testCase.path);
			expect(requestInit?.method).toBe(testCase.method);
			const headers = new Headers(requestInit?.headers);
			expect(headers.get('Authorization')).toBe(`Bearer ${API_KEY}`);
			expect(headers.get('Accept')).toBe('application/json');
			if (testCase.expectedBody !== undefined) {
				expect(JSON.parse(String(requestInit?.body))).toEqual(
					testCase.expectedBody,
				);
			} else {
				expect(requestInit?.body).toBeUndefined();
			}
		}
	});

	it('rejects undocumented input fields before network I/O', async () => {
		const invalidInput: MailcoachEndpointInputs['emailLists.get'] = {
			emailListUuid: EMAIL_LIST_UUID,
		};
		Reflect.set(
			invalidInput,
			'undocumented_callback',
			'https://attacker.invalid',
		);

		await expect(
			MailcoachOperations['emailLists.get'].endpoint(context, invalidInput),
		).rejects.toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('forwards pagination links only through the configured team endpoint', async () => {
		const testCase = cases.find(
			({ name }) => name === 'subscriberImports.list',
		);
		expect(testCase).toBeDefined();
		responseBody = mockResponse('subscriberImports.list');
		await testCase?.input(context);
		const [requestUrl] = fetchSpy.mock.calls[0] ?? [];
		const url = new URL(String(requestUrl));
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('sort')).toBeNull();
	});

	it('uses each account API URL instead of the plugin-wide fallback', async () => {
		responseBody = mockResponse('user.get');
		await MailcoachOperations['user.get'].endpoint(
			buildContext('https://other-team.mailcoach.app/api'),
			{},
		);
		const [requestUrl] = fetchSpy.mock.calls[0] ?? [];
		expect(new URL(String(requestUrl)).origin).toBe(
			'https://other-team.mailcoach.app',
		);
	});

	it('uses the explicit API URL when an inline-key context has no key manager', async () => {
		const explicitKeyContext = buildContext();
		Reflect.deleteProperty(explicitKeyContext, 'keys');
		responseBody = mockResponse('user.get');

		await MailcoachOperations['user.get'].endpoint(explicitKeyContext, {});

		const [requestUrl, requestInit] = fetchSpy.mock.calls[0] ?? [];
		expect(String(requestUrl)).toBe(`${TEAM_API_URL}/user`);
		expect(new Headers(requestInit?.headers).get('Authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
	});

	it('keeps strict inputs and endpoint schemas aligned', () => {
		expect(Object.keys(MailcoachEndpointInputSchemas).sort()).toEqual(
			Object.keys(MailcoachOperations).sort(),
		);
		expect(Object.keys(MailcoachEndpointInputSchemas).length).toBe(69);
	});
});
