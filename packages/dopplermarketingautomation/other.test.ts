import type { DopplerMarketingAutomationContext } from './index';
import { dopplermarketingautomation } from './index';

const context = { key: 'test-key' } as DopplerMarketingAutomationContext;
const endpoints = dopplermarketingautomation().endpoints!;
const template = {
	fromName: 'Sender',
	fromEmail: 'a@example.com',
	subject: 'Confirm',
	name: 'Confirm',
	urlLanding: 'https://example.com',
};

describe('Doppler automation and account endpoints', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => fetchMock.mockReset());
	afterAll(() => fetchMock.mockRestore());
	it.each([
		[
			'automations',
			'list',
			{ accountName: 'team', page: 2 },
			'GET',
			'/accounts/team/automations/lists?page=2',
			{ items: [{ name: 'Flow' }] },
		],
		[
			'automations',
			'summary',
			{ accountName: 'team', scheduledTaskId: 7, from: '2024-01-01' },
			'GET',
			'/accounts/team/automations/summary/7?from=2024-01-01',
			{ totalSentCount: 5 },
		],
		[
			'automations',
			'opensAndClicks',
			{ accountName: 'team', scheduledTaskId: 7, page: 2 },
			'GET',
			'/accounts/team/automations/opensandclicks/7?page=2',
			{ items: [{ openings: 1 }] },
		],
		[
			'automations',
			'deliverabilityRate',
			{ accountName: 'team', scheduledTaskId: 7, page: 2 },
			'GET',
			'/accounts/team/automations/deliverabilityrate/7?page=2',
			{ items: [{ status: 'sent' }] },
		],
		[
			'automations',
			'linksTracking',
			{ accountName: 'team', scheduledTaskId: 7, page: 2 },
			'GET',
			'/accounts/team/automations/linkstracking/7?page=2',
			{ items: [{ urlLink: 'https://example.com' }] },
		],
		[
			'automations',
			'unsubscribeActivity',
			{ accountName: 'team', scheduledTaskId: 7, page: 2 },
			'GET',
			'/accounts/team/automations/unsubscribeactivity/7?page=2',
			{ items: [{ reason: 'manual' }] },
		],
		[
			'templates',
			'create',
			{ accountName: 'team', template },
			'POST',
			'/accounts/team/DobleOptinTemplate',
			{ message: 'created' },
		],
		[
			'templates',
			'get',
			{ accountName: 'team', templateId: 7 },
			'GET',
			'/accounts/team/DobleOptinTemplate/7',
			template,
		],
		[
			'templates',
			'updateContent',
			{ accountName: 'team', templateId: 7, Body: '<p>Confirm</p>' },
			'PUT',
			'/accounts/team/DobleOptinTemplate/7/content',
			{ message: 'updated' },
		],
		[
			'fields',
			'list',
			{ accountName: 'team' },
			'GET',
			'/accounts/team/fields',
			{
				items: [
					{
						name: 'EMAIL',
						predefined: true,
						private: false,
						readonly: false,
						type: 'email',
					},
				],
			},
		],
		['home', 'get', {}, 'GET', '/', { message: 'ok' }],
		[
			'home',
			'account',
			{ accountName: 'team' },
			'GET',
			'/accounts/team',
			{ message: 'ok' },
		],
		[
			'tasks',
			'list',
			{ accountName: 'team', page: 2 },
			'GET',
			'/accounts/team/tasks?page=2',
			{ items: [{ taskId: '123' }] },
		],
		[
			'tasks',
			'get',
			{ accountName: 'team', taskId: '123' },
			'GET',
			'/accounts/team/tasks/123',
			{ taskId: '123', finishDate: null },
		],
		[
			'tasks',
			'importErrors',
			{ accountName: 'team', taskId: '123', page: 2 },
			'GET',
			'/accounts/team/tasks/123/import-errors?page=2',
			{ items: [{ errorCode: 'invalid' }] },
		],
		[
			'integrations',
			'get',
			{ accountName: 'team', integrationName: 'shop' },
			'GET',
			'/accounts/team/integrations/shop',
			{ message: 'ok' },
		],
		[
			'integrations',
			'update',
			{
				accountName: 'team',
				integrationName: 'shop',
				thirdPartyAppAccess: { accessToken: 'token', refreshToken: null },
			},
			'PUT',
			'/accounts/team/integrations/shop',
			{ message: 'ok' },
		],
		[
			'integrations',
			'delete',
			{ accountName: 'team', integrationName: 'shop' },
			'DELETE',
			'/accounts/team/integrations/shop',
			{ message: 'ok' },
		],
	] as const)(
		'%s.%s sends the provider request',
		async (family, operation, args, method, path, result) => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(result), {
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			// Family and operation vary together by row; TypeScript cannot retain
			// their correlation, and their endpoint output shapes also differ.
			const familyEndpoints = endpoints[family] as unknown as Record<
				string,
				(
					ctx: DopplerMarketingAutomationContext,
					input: typeof args,
				) => Promise<unknown>
			>;
			expect(await familyEndpoints[operation]!(context, args)).toMatchObject(
				result,
			);
			const [url, init] = fetchMock.mock.calls[0]!;
			expect(String(url)).toBe(`https://restapi.fromdoppler.com${path}`);
			expect(init?.method).toBe(method);
			expect(new Headers(init?.headers).get('Authorization')).toBe(
				'token test-key',
			);
			if ('Body' in args) {
				expect(init?.body).toBe(args.Body);
				expect(new Headers(init?.headers).get('Content-Type')).toBe(
					'text/html',
				);
			} else if ('template' in args)
				expect(JSON.parse(String(init?.body))).toEqual(args.template);
			else if ('thirdPartyAppAccess' in args)
				expect(JSON.parse(String(init?.body))).toEqual(
					args.thirdPartyAppAccess,
				);
			else expect(init?.body).toBeUndefined();
		},
	);
	it('rejects unsafe task and integration identifiers', async () => {
		await expect(
			endpoints.tasks.get(context, { accountName: 'team', taskId: '..' }),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.get(context, {
				accountName: 'team',
				integrationName: 'a/b',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
