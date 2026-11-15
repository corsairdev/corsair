import { logEventFromContext } from 'corsair/core';
import { WoodpeckerCoAPIError } from './client';
import { Campaigns, Prospects, Webhooks } from './endpoints';
import { WOODPECKERCO_WEBHOOK_EVENTS } from './endpoints/webhooks';
import {
	campaign,
	campaignDetail,
	campaignWithStats,
	noProspects,
	prospect,
	prospectsAdded,
	prospectsNotAdded,
	prospectsPartiallyAdded,
	v1Error,
	v2Domain,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'wp-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.woodpecker.co');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('campaigns.list', () => {
	it('GETs v1/campaign_list without filters and keeps every campaign', async () => {
		respond([campaign, { ...campaign, id: 1235678, status: 'COMPLETED' }]);

		const result = await invoke(Campaigns.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/rest/v1/campaign_list',
			query: {},
			body: undefined,
		});
		expect(result).toEqual({
			campaigns: [campaign, { ...campaign, id: 1235678, status: 'COMPLETED' }],
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'woodpeckerco.campaigns.list',
			{ count: 2 },
			'completed',
		);
	});

	it('joins status and id filters with commas', async () => {
		respond([campaign]);

		await invoke(Campaigns.list, {
			status: ['RUNNING', 'PAUSED'],
			id: [1234567, 1235678],
		});

		expect(lastRequest().query).toEqual({
			status: 'RUNNING,PAUSED',
			id: '1234567,1235678',
		});
	});

	it('returns stats when one id is requested', async () => {
		respond([campaignWithStats]);

		const result = await invoke(Campaigns.list, { id: [1234567] });

		expect(lastRequest().query).toEqual({ id: '1234567' });
		expect(result).toEqual({ campaigns: [campaignWithStats] });
	});

	it('treats a 204 as an empty list', async () => {
		respondEmpty(204);

		await expect(
			invoke(Campaigns.list, { status: ['DRAFT'] }),
		).resolves.toEqual({
			campaigns: [],
		});
	});

	it('keeps fields and statuses it does not know', async () => {
		respond([{ id: 1, status: 'ARCHIVED', brand_new_field: 'kept' }]);

		await expect(invoke(Campaigns.list, {})).resolves.toEqual({
			campaigns: [{ id: 1, status: 'ARCHIVED', brand_new_field: 'kept' }],
		});
	});

	it.each([
		[{ status: ['running'] }],
		[{ status: [] }],
		[{ id: ['abc'] }],
		[{ id: [] }],
		[{ id: [-1] }],
	])('rejects %j before calling Woodpecker', async (input) => {
		await expect(invoke(Campaigns.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a response that is not a campaign list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Campaigns.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe.each([
	['run', Campaigns.run],
	['pause', Campaigns.pause],
	['stop', Campaigns.stop],
])('campaigns.%s', (action, endpoint) => {
	it('POSTs to the v2 campaign action with no body', async () => {
		respondEmpty(200);

		const result = await invoke(endpoint, { campaign_id: 1234567 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/rest/v2/campaigns/1234567/${action}`,
			query: {},
			body: undefined,
		});
		expect(result).toEqual({ success: true, campaign_id: 1234567 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			`woodpeckerco.campaigns.${action}`,
			{ campaignId: 1234567 },
			'completed',
		);
	});

	it.each([
		[{}],
		[{ campaign_id: 'abc' }],
		[{ campaign_id: 0 }],
		[{ campaign_id: 1.5 }],
	])('rejects %j before calling Woodpecker', async (input) => {
		await expect(invoke(endpoint, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a missing campaign', async () => {
		respond(v2Domain('CAMPAIGN_NOT_EXIST', 'Campaign not found'), 404);

		await expect(invoke(endpoint, { campaign_id: 999 })).rejects.toMatchObject({
			status: 404,
			code: 'CAMPAIGN_NOT_EXIST',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('campaigns.run', () => {
	it('surfaces a campaign that fails validation', async () => {
		respond(
			v2Domain(
				'API_UNSUPPORTED_CAMPAIGN_FEATURES',
				'Campaign contains currently unsupported features',
				'A/Z testing',
			),
			409,
		);

		const error = await invoke(Campaigns.run, { campaign_id: 1 }).catch(
			(e: unknown) => e,
		);

		expect(error).toBeInstanceOf(WoodpeckerCoAPIError);
		expect(error).toMatchObject({
			status: 409,
			code: 'API_UNSUPPORTED_CAMPAIGN_FEATURES',
			isRateLimit: false,
		});
	});
});

describe('campaigns.deleteStep', () => {
	it('DELETEs a step and returns the updated campaign', async () => {
		respond(campaignDetail);

		const stepId = '36c4fb2c-6f4f-45bf-aeae-4903501193hd';
		const result = await invoke(Campaigns.deleteStep, {
			campaign_id: 1234567,
			step_id: stepId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/rest/v2/campaigns/1234567/steps/${stepId}`,
			query: {},
			body: undefined,
		});
		expect(result).toEqual({
			success: true,
			campaign_id: 1234567,
			step_id: stepId,
			campaign: campaignDetail,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'woodpeckerco.campaigns.deleteStep',
			{ campaignId: 1234567, stepId },
			'completed',
		);
	});

	it('accepts the integer step IDs in the docs samples', async () => {
		respond(campaignDetail);

		await invoke(Campaigns.deleteStep, { campaign_id: 123, step_id: 456 });

		expect(lastRequest().path).toBe('/rest/v2/campaigns/123/steps/456');
	});

	it('encodes the step ID into one path segment', async () => {
		respond(campaignDetail);

		await invoke(Campaigns.deleteStep, {
			campaign_id: 123,
			step_id: '../../me',
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			'https://api.woodpecker.co/rest/v2/campaigns/123/steps/..%2F..%2Fme',
		);
	});

	it('reports success when the 200 has no campaign payload', async () => {
		respondEmpty(200);

		await expect(
			invoke(Campaigns.deleteStep, { campaign_id: 1, step_id: 'a' }),
		).resolves.toEqual({ success: true, campaign_id: 1, step_id: 'a' });
	});

	it.each([
		['BRANCH_NOT_DELETABLE', 'Step is not allowed to be deleted'],
		[
			'NOT_EDITABLE_STATUS',
			'The campaign must be in DRAFT or EDITED status to be updated',
		],
	])('surfaces a 409 %s', async (code, message) => {
		respond(v2Domain(code, message), 409);

		await expect(
			invoke(Campaigns.deleteStep, { campaign_id: 1, step_id: 'a' }),
		).rejects.toMatchObject({
			status: 409,
			code,
			isRateLimit: false,
			message: `Woodpecker 409 ${code}: ${message}`,
		});
	});

	it.each([
		[{ campaign_id: 1 }],
		[{ step_id: 'a' }],
		[{ campaign_id: 1, step_id: '' }],
		[{ campaign_id: 1, step_id: 0 }],
	])('rejects %j before calling Woodpecker', async (input) => {
		await expect(invoke(Campaigns.deleteStep, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('prospects.addToCampaign', () => {
	const input = {
		campaign: { campaign_id: 1234567, send_after: '2025-04-01T00:01:01-0000' },
		force: false,
		file_name: 'API import 2025-04-01',
		prospects: [
			{
				email: 'jordan@acme-logistics.example',
				status: 'ACTIVE',
				first_name: 'Jordan',
				last_name: 'Lee',
				company: 'Acme Logistics',
				website: 'https://acme-logistics.example',
				linkedin_url: 'https://linkedin.example/jordan-lee',
				tags: '#VIP',
				title: 'CEO',
				phone: '5550100',
				address: '700 Main Road',
				city: 'Austin',
				state: 'Texas',
				country: 'USA',
				industry: 'SaaS',
				snippet1: 'First <br/> line',
				snippet15: 'Last',
			},
			{ email: 'priya@northwind.example' },
		],
	};

	it('POSTs the campaign, options and prospects as JSON', async () => {
		respond(prospectsAdded);

		const result = await invoke(Prospects.addToCampaign, input);

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/rest/v1/add_prospects_campaign',
			query: {},
			body: input,
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(prospectsAdded);
	});

	it('sends only the required fields when that is all it is given', async () => {
		respond(prospectsAdded);

		await invoke(Prospects.addToCampaign, {
			campaign: { campaign_id: 1 },
			prospects: [{ email: 'priya@northwind.example' }],
		});

		expect(lastRequest().body).toEqual({
			campaign: { campaign_id: 1 },
			prospects: [{ email: 'priya@northwind.example' }],
		});
	});

	it('returns per-prospect results on a partial success', async () => {
		respond(prospectsPartiallyAdded);

		await expect(invoke(Prospects.addToCampaign, input)).resolves.toEqual(
			prospectsPartiallyAdded,
		);
	});

	it('logs counts and never prospect details', async () => {
		respond(prospectsPartiallyAdded);

		await invoke(Prospects.addToCampaign, input);

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'woodpeckerco.prospects.addToCampaign',
			{ campaignId: 1234567, submitted: 2, rejected: 1 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});

	it('lets Woodpecker reject a bad address per prospect', async () => {
		respond(prospectsPartiallyAdded);

		await invoke(Prospects.addToCampaign, {
			campaign: { campaign_id: 1 },
			prospects: [{ email: 'not-an-address.example' }],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('throws on the 400 where none were added, keeping the reasons', async () => {
		respond(prospectsNotAdded, 400);

		await expect(invoke(Prospects.addToCampaign, input)).rejects.toMatchObject({
			status: 400,
			code: 'E_INV_STATUS',
			body: prospectsNotAdded,
		});
	});

	it('surfaces an unknown campaign', async () => {
		respond(v1Error('E_RECORD_NOT_FOUND', 'Campaign not found.'), 400);

		await expect(invoke(Prospects.addToCampaign, input)).rejects.toMatchObject({
			status: 400,
			code: 'E_RECORD_NOT_FOUND',
			message: 'Woodpecker 400 E_RECORD_NOT_FOUND: Campaign not found.',
		});
	});

	it.each([
		[{ prospects: [{ email: 'a@b.example' }] }],
		[{ campaign: { campaign_id: 1 } }],
		[{ campaign: { campaign_id: 1 }, prospects: [] }],
		[{ campaign: { campaign_id: 1 }, prospects: [{ first_name: 'No email' }] }],
		[{ campaign: {}, prospects: [{ email: 'a@b.example' }] }],
		[
			{
				campaign: { campaign_id: 1 },
				prospects: [{ email: 'a@b.example', status: 'OPTED_OUT' }],
			},
		],
	])('rejects %j before calling Woodpecker', async (bad) => {
		await expect(invoke(Prospects.addToCampaign, bad)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects more than the 20,000 prospects a request can hold', async () => {
		const prospects = Array.from({ length: 20_001 }, (_, i) => ({
			email: `p${i}@example.test`,
		}));

		await expect(
			invoke(Prospects.addToCampaign, {
				campaign: { campaign_id: 1 },
				prospects,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('prospects.listInCampaigns', () => {
	it('GETs v1/prospects with the campaign IDs joined', async () => {
		respond([prospect]);

		const result = await invoke(Prospects.listInCampaigns, {
			campaigns_id: [321654, 987654],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/rest/v1/prospects',
			query: { campaigns_id: '321654,987654' },
			body: undefined,
		});
		expect(result).toEqual({
			prospects: [prospect],
			page: 1,
			per_page: 100,
			next_page: null,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'woodpeckerco.prospects.listInCampaigns',
			{ campaigns: 2, page: 1, count: 1 },
			'completed',
		);
	});

	it('sends every filter, sort and paging parameter', async () => {
		respond([]);

		await invoke(Prospects.listInCampaigns, {
			campaigns_id: [1],
			id: [10, 11],
			status: 'REPLIED',
			contacted: true,
			interested: 'MAYBE-LATER',
			activity: 'OPENED',
			diff: '2025-01-15T00:00:00+0200',
			sort: '-updated',
			page: 3,
			per_page: 50,
		});

		expect(lastRequest().query).toEqual({
			campaigns_id: '1',
			id: '10,11',
			status: 'REPLIED',
			contacted: 'true',
			interested: 'MAYBE-LATER',
			activity: 'OPENED',
			diff: '2025-01-15T00:00:00+0200',
			sort: '-updated',
			page: '3',
			per_page: '50',
		});
	});

	it('sends contacted: false rather than dropping it', async () => {
		respond([]);

		await invoke(Prospects.listInCampaigns, {
			campaigns_id: [1],
			contacted: false,
		});

		expect(lastRequest().query.contacted).toBe('false');
	});

	it('offers the next page while a page is full', async () => {
		respond([prospect, { ...prospect, id: 2 }]);

		await expect(
			invoke(Prospects.listInCampaigns, {
				campaigns_id: [1],
				page: 2,
				per_page: 2,
			}),
		).resolves.toMatchObject({ page: 2, per_page: 2, next_page: 3 });
	});

	it('uses the default page size to judge a full page', async () => {
		respond(Array.from({ length: 100 }, (_, id) => ({ ...prospect, id })));

		await expect(
			invoke(Prospects.listInCampaigns, { campaigns_id: [1] }),
		).resolves.toMatchObject({ per_page: 100, next_page: 2 });
		expect(lastRequest().query.per_page).toBeUndefined();
	});

	it('turns the 200 no-prospects message into an empty page', async () => {
		respond(noProspects);

		await expect(
			invoke(Prospects.listInCampaigns, { campaigns_id: [1] }),
		).resolves.toEqual({
			prospects: [],
			page: 1,
			per_page: 100,
			next_page: null,
			message: noProspects.message,
		});
	});

	it('keeps the fields sent only with an activity filter', async () => {
		const clicked = {
			...prospect,
			last_clicked: '2025-03-21T08:11:35+0100',
			click_url: 'https://fieldkit.example/pricing',
		};
		respond([clicked]);

		await expect(
			invoke(Prospects.listInCampaigns, {
				campaigns_id: [1],
				activity: 'CLICKED',
			}),
		).resolves.toMatchObject({ prospects: [clicked] });
	});

	it('keeps a row nested under prospect, as the field table describes', async () => {
		respond([{ prospect }]);

		await expect(
			invoke(Prospects.listInCampaigns, { campaigns_id: [1] }),
		).resolves.toMatchObject({ prospects: [{ prospect }] });
	});

	it('surfaces a rejected parameter', async () => {
		respond(v1Error('E_WRONG_PARAM', 'Wrong param [status]=active'), 400);

		await expect(
			invoke(Prospects.listInCampaigns, { campaigns_id: [1] }),
		).rejects.toMatchObject({ status: 400, code: 'E_WRONG_PARAM' });
	});

	it.each([
		[{}],
		[{ campaigns_id: [] }],
		[{ campaigns_id: [1], per_page: 1001 }],
		[{ campaigns_id: [1], per_page: 0 }],
		[{ campaigns_id: [1], page: 0 }],
		[{ campaigns_id: [1], status: 'active' }],
		[{ campaigns_id: [1], interested: 'MAYBE_LATER' }],
		[{ campaigns_id: [1], activity: 'SEEN' }],
	])('rejects %j before calling Woodpecker', async (input) => {
		await expect(invoke(Prospects.listInCampaigns, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('webhooks.listEvents', () => {
	it('returns the documented catalog without calling Woodpecker', async () => {
		const result = await invoke(Webhooks.listEvents, {});

		expect(fetchMock).not.toHaveBeenCalled();
		expect(result).toEqual({ events: WOODPECKERCO_WEBHOOK_EVENTS });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'woodpeckerco.webhooks.listEvents',
			{ count: 27 },
			'completed',
		);
	});

	it('accepts a call with no input', async () => {
		await expect(invoke(Webhooks.listEvents, undefined)).resolves.toMatchObject(
			{ events: WOODPECKERCO_WEBHOOK_EVENTS },
		);
	});

	it('lists each of the 27 documented events once, with a docs link', () => {
		const names = WOODPECKERCO_WEBHOOK_EVENTS.map(({ event }) => event);

		expect(names).toHaveLength(27);
		expect(new Set(names).size).toBe(27);
		expect(names).toEqual(expect.arrayContaining(['prospect_replied']));
		expect(names).toEqual(expect.arrayContaining(['task_ignored']));
		for (const {
			event,
			description,
			docs_url,
		} of WOODPECKERCO_WEBHOOK_EVENTS) {
			expect(event).toMatch(/^[a-z_]+$/);
			expect(description.length).toBeGreaterThan(10);
			expect(docs_url).toMatch(
				/^https:\/\/developers\.woodpecker\.co\/docs\/webhooks\/[a-z_-]+\.md$/,
			);
		}
	});
});
