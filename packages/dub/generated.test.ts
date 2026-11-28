import { generatedCases as cases } from './__fixtures__/generated-cases';
import {
	GeneratedInputSchemas,
	GeneratedOutputSchemas,
	generatedEndpointGroups,
} from './endpoints/generated';

// Each generated operation, called with the smallest input its spec allows:
// it must validate, hit the documented method and path with the key, and
// parse an empty-ish success body leniently.
type Endpoint = (ctx: never, input: unknown) => Promise<unknown>;

const byName = new Map<string, Endpoint>();
for (const [group, actions] of Object.entries(generatedEndpointGroups)) {
	for (const [action, fn] of Object.entries(actions)) {
		byName.set(`${group}.${action}`, fn as unknown as Endpoint);
	}
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => jest.restoreAllMocks());

const ctx = { key: 'dub_test_key' } as never;

describe('generated operations', () => {
	it('covers all 32 operations the hand-written endpoints leave out', () => {
		expect(cases).toHaveLength(32);
		expect([...byName.keys()].sort()).toEqual(cases.map((c) => c.name).sort());
	});

	it.each(cases.map((c) => [c.name, c] as const))(
		'%s sends the documented method and path',
		async (_name, testCase) => {
			fetchMock.mockResolvedValueOnce(
				new Response(testCase.method === 'GET' ? '[]' : '{}', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const endpoint = byName.get(testCase.name);
			if (!endpoint) throw new Error(`no endpoint ${testCase.name}`);
			await endpoint(ctx, testCase.input).catch((error: unknown) => {
				// An output schema that wants an array or object of a different
				// shape is fine here: the request is what this test checks.
				if (!(error instanceof Error) || error.name !== 'ZodError') throw error;
			});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(init.method).toBe(testCase.method);
			expect(new URL(url).pathname).toBe(testCase.path);
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer dub_test_key',
			);
		},
	);

	it('refuses an input missing a required field before calling Dub', async () => {
		const create = byName.get('messages.create');
		await expect(create?.(ctx, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends array query values comma-separated', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('[]', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await byName.get('partners.listNetwork')?.(ctx, {
			partnerIds: ['pn_1', 'pn_2'],
		});
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(new URL(url).searchParams.get('partnerIds')).toBe('pn_1,pn_2');
	});

	it('parses outputs leniently: unknown fields kept, nulls allowed', () => {
		const parsed = GeneratedOutputSchemas.partnersBan.parse({
			partnerId: 'pn_1',
			somethingNew: 1,
		});
		expect(parsed).toMatchObject({ partnerId: 'pn_1', somethingNew: 1 });
		expect(
			GeneratedOutputSchemas.payoutsList.parse([{ id: 'po_1', status: null }]),
		).toHaveLength(1);
	});

	it('keeps input enums strict', () => {
		expect(
			GeneratedInputSchemas.commissionsBulkUpdate.safeParse({
				commissionIds: ['cm_1'],
				status: 'not-a-status',
			}).success,
		).toBe(false);
	});
});
