import type { DopplerMarketingAutomationContext } from './index';
import { dopplermarketingautomation } from './index';

const context = { key: 'test-key' } as DopplerMarketingAutomationContext;
const campaigns = dopplermarketingautomation().endpoints!.campaigns;
const campaign = {
	name: 'News',
	fromName: 'Sender',
	fromEmail: 'a@example.com',
	subject: 'Hi',
};
const social = {
	share: [],
	likes: [],
	facebookWallPost: false,
	facebookPagesPost: [],
	twitterPost: false,
	linkedInPost: false,
	rssPost: false,
};
const base = '/accounts/team/campaigns/7';

describe('Doppler campaign endpoints', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => fetchMock.mockReset());
	afterAll(() => fetchMock.mockRestore());

	it.each([
		[
			'list',
			{ accountName: 'team', page: 2 },
			'GET',
			'/accounts/team/campaigns?page=2',
			{ items: [campaign] },
		],
		[
			'create',
			{ accountName: 'team', campaign },
			'POST',
			'/accounts/team/campaigns',
			{ message: 'created' },
		],
		[
			'get',
			{ accountName: 'team', campaignId: 7 },
			'GET',
			base,
			{ ...campaign, preheader: null },
		],
		[
			'update',
			{ accountName: 'team', campaignId: 7, campaign },
			'PUT',
			base,
			{ message: 'ok' },
		],
		[
			'delete',
			{ accountName: 'team', campaignId: 7 },
			'DELETE',
			base,
			{ message: 'ok' },
		],
		[
			'approve',
			{ accountName: 'team', campaignId: 7 },
			'POST',
			`${base}/approvals`,
			{ message: 'ok' },
		],
		[
			'deliveries',
			{ accountName: 'team', campaignId: 7, page: 2 },
			'GET',
			`${base}/deliveries?page=2`,
			{ items: [] },
		],
		[
			'resultsSummary',
			{ accountName: 'team', campaignId: 7 },
			'GET',
			`${base}/results-summary`,
			{ totalRecipients: 2 },
		],
		[
			'unsubscribed',
			{ accountName: 'team', campaignId: 7, page: 2 },
			'GET',
			`${base}/unsubscribed?page=2`,
			{ items: [] },
		],
		[
			'updateContent',
			{ accountName: 'team', campaignId: 7, Body: '<p>Hello</p>' },
			'PUT',
			`${base}/content`,
			{ message: 'ok' },
		],
		[
			'getTextAlternative',
			{ accountName: 'team', campaignId: 7 },
			'GET',
			`${base}/content/text-alternative`,
			{ text: 'Hello' },
		],
		[
			'updateTextAlternative',
			{
				accountName: 'team',
				campaignId: 7,
				textAlternativeContent: { text: 'Hello' },
			},
			'PUT',
			`${base}/content/text-alternative`,
			{ message: 'ok' },
		],
		[
			'deleteTextAlternative',
			{ accountName: 'team', campaignId: 7 },
			'DELETE',
			`${base}/content/text-alternative`,
			{ message: 'ok' },
		],
		[
			'getRecipients',
			{ accountName: 'team', campaignId: 7 },
			'GET',
			`${base}/recipients`,
			{ lists: [{ id: 3, name: null }] },
		],
		[
			'updateRecipients',
			{
				accountName: 'team',
				campaignId: 7,
				recipients: { lists: [{ id: 3 }] },
			},
			'PUT',
			`${base}/recipients`,
			{ message: 'ok' },
		],
		[
			'createShipping',
			{ accountName: 'team', campaignId: 7, shipping: { type: 'immediate' } },
			'POST',
			`${base}/shippings`,
			{ message: 'created' },
		],
		[
			'getShipping',
			{ accountName: 'team', campaignId: 7, shippingId: 'abc' },
			'GET',
			`${base}/shippings/abc`,
			{ type: 'scheduled', status: null },
		],
		[
			'deleteShipping',
			{ accountName: 'team', campaignId: 7, shippingId: 'abc' },
			'DELETE',
			`${base}/shippings/abc`,
			{ message: 'ok' },
		],
		[
			'getSocial',
			{ accountName: 'team', campaignId: 7 },
			'GET',
			`${base}/social-media`,
			social,
		],
		[
			'updateSocial',
			{ accountName: 'team', campaignId: 7, socialMediaPreferences: social },
			'PUT',
			`${base}/social-media`,
			{ message: 'ok' },
		],
	] as const)(
		'%s forwards the provider request',
		async (operation, input, method, path, response) => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(response), {
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const call = campaigns[operation] as (
				ctx: DopplerMarketingAutomationContext,
				value: typeof input,
			) => Promise<unknown>;
			expect(await call(context, input)).toMatchObject(response);
			const [url, init] = fetchMock.mock.calls[0]!;
			expect(String(url)).toBe(`https://restapi.fromdoppler.com${path}`);
			expect(init?.method).toBe(method);
			expect(new Headers(init?.headers).get('Authorization')).toBe(
				'token test-key',
			);
			if ('Body' in input) {
				expect(init?.body).toBe(input.Body);
				expect(new Headers(init?.headers).get('Content-Type')).toBe(
					'text/html',
				);
			} else {
				const key = [
					'campaign',
					'recipients',
					'shipping',
					'textAlternativeContent',
					'socialMediaPreferences',
				].find((name) => name in input);
				if (key)
					expect(JSON.parse(String(init?.body))).toEqual(
						input[key as keyof typeof input],
					);
				else expect(init?.body).toBeUndefined();
			}
		},
	);

	it('returns campaign HTML unchanged', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<p>Hello</p>', {
				headers: { 'Content-Type': 'text/html' },
			}),
		);
		expect(
			await campaigns.getContent(context, {
				accountName: 'team',
				campaignId: 7,
			}),
		).toBe('<p>Hello</p>');
		expect(
			new Headers(fetchMock.mock.calls[0]![1]?.headers).get('Accept'),
		).toBe('text/html');
	});

	it('returns image preview bytes without text decoding', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([0, 255, 137]), {
				headers: { 'Content-Type': 'image/png' },
			}),
		);
		expect(
			await campaigns.preview(context, {
				accountName: 'team',
				campaignId: 7,
				Accept: 'image/png',
			}),
		).toEqual(new Uint8Array([0, 255, 137]));
		expect(
			new Headers(fetchMock.mock.calls[0]![1]?.headers).get('Accept'),
		).toBe('image/png');
	});

	it('returns SVG previews as text', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<svg/>', { headers: { 'Content-Type': 'image/svg+xml' } }),
		);
		expect(
			await campaigns.preview(context, {
				accountName: 'team',
				campaignId: 7,
				Accept: 'image/svg+xml',
			}),
		).toBe('<svg/>');
	});
});
