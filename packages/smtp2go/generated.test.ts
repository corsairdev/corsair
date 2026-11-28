import { generatedCases as cases } from './__fixtures__/generated-cases';
import { generatedEndpointGroups } from './endpoints/generated';
import {
	API_KEY,
	BASE,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

type Endpoint = (ctx: never, input: unknown) => Promise<unknown>;

const byName = new Map<string, Endpoint>();
for (const [group, actions] of Object.entries(generatedEndpointGroups)) {
	for (const [action, fn] of Object.entries(actions)) {
		byName.set(`${group}.${action}`, fn as unknown as Endpoint);
	}
}

beforeEach(() => {
	installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});
afterEach(() => {
	restoreFetchMock();
	jest.restoreAllMocks();
});

function ok(data: object = {}) {
	return new Response(JSON.stringify({ request_id: 'req-1', data }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('generated operations', () => {
	it('covers the 40 operations the hand-written endpoints leave out', () => {
		expect(cases).toHaveLength(40);
		expect([...byName.keys()].sort()).toEqual(cases.map((c) => c.name).sort());
	});

	it.each(cases.map((c) => [c.name, c] as const))(
		'%s validates its smallest input and sends its method and path',
		async (_name, testCase) => {
			// An empty `data` of the documented kind (object, array or string),
			// which the lenient output schema must accept.
			mockFetch(
				new Response(
					JSON.stringify({ request_id: 'req-1', data: testCase.data }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
			);
			const endpoint = byName.get(testCase.name);
			if (!endpoint) throw new Error(`no endpoint ${testCase.name}`);
			await endpoint(makeCtx() as never, testCase.input);
			expect(lastCall().url).toBe(`${BASE}${testCase.path}`);
			expect(lastCall().init.method).toBe(testCase.method);
			expect(sentHeader('X-Smtp2go-Api-Key')).toBe(API_KEY);
			expect(JSON.stringify(sentBody())).not.toContain(API_KEY);
		},
	);

	it('sends the documented body and drops unset fields', async () => {
		mockFetch(ok());
		await byName.get('singleSenders.add')?.(makeCtx() as never, {
			email_address: 'sender@example.com',
		});
		expect(lastCall().url).toBe(`${BASE}/single_sender_emails/add`);
		expect(sentBody()).toEqual({ email_address: 'sender@example.com' });
	});

	it('uses PATCH for the patch editors', async () => {
		mockFetch(ok());
		await byName
			.get('apiKeys.patch')?.(
				makeCtx() as never,
				{
					api_key: undefined,
					description: 'x',
				} as never,
			)
			.catch(() => undefined);
		const patched = cases
			.filter((c) => c.method === 'PATCH')
			.map((c) => c.name);
		expect(patched.sort()).toEqual([
			'apiKeys.patch',
			'ipAuth.patch',
			'smtpUsers.patch',
		]);
	});

	it('refuses an input missing a required field before calling SMTP2GO', async () => {
		await expect(
			byName.get('sms.send')?.(makeCtx() as never, {}),
		).rejects.toThrow();
		expect(() => lastCall()).toThrow();
	});
});
