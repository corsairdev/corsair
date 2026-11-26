import { SPEC_OPERATION_EXAMPLES } from './spec-examples-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentHeader,
} from './test-helpers';

// unknown: endpoints are looked up by their dotted name from the fixture table,
// so their input and output types are not known statically here.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function endpointAt(name: string): AnyEndpoint {
	const [group, op] = name.split('.') as [string, string];
	const groupEndpoints = (endpoints as Record<string, Record<string, unknown>>)[
		group
	];
	const fn = groupEndpoints?.[op];
	if (typeof fn !== 'function') throw new Error(`no endpoint ${name}`);
	return fn as AnyEndpoint;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('every spec-built operation against the Loops reference examples', () => {
	it.each(SPEC_OPERATION_EXAMPLES.map((row) => [row.op, row] as const))(
		'%s sends the documented request and parses the documented answer',
		async (_name, row) => {
			mockFetch(
				row.response === null
					? new Response(null, { status: row.status })
					: jsonResponse(row.response, { status: row.status }),
			);

			const result = await endpointAt(row.op)(makeCtx(), row.input);

			const { url, init } = lastCall();
			expect(init.method).toBe(row.method);
			expect(url).toBe(`${BASE}${row.path}`);
			expect(sentHeader('Authorization')).toBe('Bearer test-key');
			if (row.body === null) {
				expect(init.body).toBeUndefined();
			} else {
				expect(JSON.parse(String(init.body))).toEqual(row.body);
			}
			if (row.response === null) {
				expect(result).toEqual({ success: true });
			} else {
				// Lenient output schemas keep every field Loops sent.
				expect(result).toEqual(row.response);
			}
		},
	);
});

describe('spec-built operation details', () => {
	it('encodes path ids, so an id cannot change the route', async () => {
		mockFetch(jsonResponse({ id: 'x' }));

		await endpointAt('campaigns.get')(makeCtx(), { campaignId: '../lists' });

		expect(lastCall().url).toBe(`${BASE}/v1/campaigns/..%2Flists`);
	});

	it('sends pagination as query parameters', async () => {
		mockFetch(jsonResponse({ pagination: {}, data: [] }));

		await endpointAt('campaigns.list')(makeCtx(), {
			perPage: 25,
			cursor: 'cur_1',
			campaignGroupId: 'grp_1',
		});

		const url = new URL(lastCall().url);
		expect(url.pathname).toBe('/api/v1/campaigns');
		expect(Object.fromEntries(url.searchParams)).toEqual({
			perPage: '25',
			cursor: 'cur_1',
			campaignGroupId: 'grp_1',
		});
	});

	it('refuses a perPage outside the 10-50 Loops accepts, before any call', async () => {
		await expect(
			endpointAt('workflows.list')(makeCtx(), { perPage: 5 }),
		).rejects.toThrow();
	});

	it('removes a suppression by exactly one identifier, sent in the query', async () => {
		mockFetch(
			jsonResponse({
				success: true,
				message: 'Email removed from suppression list.',
				removalQuota: { limit: 100, remaining: 9 },
			}),
		);

		await endpointAt('contacts.removeSuppression')(makeCtx(), {
			email: 'alex+tag@company.com',
		});

		const url = new URL(lastCall().url);
		expect(lastCall().init.method).toBe('DELETE');
		expect(url.searchParams.get('email')).toBe('alex+tag@company.com');
		await expect(
			endpointAt('contacts.removeSuppression')(makeCtx(), {
				email: 'alex@company.com',
				userId: 'usr_1',
			}),
		).rejects.toThrow('exactly one');
	});

	it('does not count a 204 with a body it did not expect as a delete', async () => {
		mockFetch(jsonResponse({ success: false, message: 'Footer in use' }));

		await expect(
			endpointAt('footers.delete')(makeCtx(), { footerId: 'f_1' }),
		).rejects.toThrow('Footer in use');
	});

	it('keeps an unknown campaign status instead of failing the parse', async () => {
		mockFetch(jsonResponse({ id: 'c_1', status: 'Archived', newField: 1 }));

		await expect(
			endpointAt('campaigns.get')(makeCtx(), { campaignId: 'c_1' }),
		).resolves.toMatchObject({ status: 'Archived', newField: 1 });
	});
});
