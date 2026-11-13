import fixtures from './fixtures.json';
import { postalytics, postalyticsEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	AuthMissingError: class AuthMissingError extends Error {},
}));

const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;
const context = { key: 'fixture-key', options: {} } as never;

beforeAll(() => {
	globalThis.fetch = fetchMock as typeof fetch;
});
afterAll(() => {
	globalThis.fetch = originalFetch;
});
beforeEach(() => fetchMock.mockReset());

type TestEndpoint = (ctx: never, input: never) => Promise<unknown>;
type TestSchema = {
	input: { parse(value: unknown): unknown };
	output: { parse(value: unknown): unknown };
};

describe('all documented Postalytics operations', () => {
	it('covers the complete 45-operation registry', () => {
		expect(fixtures).toHaveLength(45);
		expect(Object.keys(postalyticsEndpointSchemas)).toHaveLength(45);
	});
	for (const fixture of fixtures) {
		it(`${fixture.method} ${fixture.path}`, async () => {
			fetchMock.mockResolvedValue(
				new Response(JSON.stringify(fixture.output), { status: 200 }),
			);
			const endpointGroups = postalytics().endpoints as unknown as Record<
				string,
				Record<string, TestEndpoint>
			>;
			const schemas = postalyticsEndpointSchemas as unknown as Record<
				string,
				TestSchema
			>;
			const endpoint = endpointGroups[fixture.group]?.[fixture.name];
			const schema = schemas[`${fixture.group}.${fixture.name}`];
			expect(endpoint).toBeDefined();
			expect(schema).toBeDefined();
			if (!endpoint || !schema)
				throw new Error('Missing endpoint registration');
			const input = schema.input.parse(fixture.input);
			const result = await endpoint(context, input as never);
			expect(schema.output.parse(result)).toEqual(fixture.output);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://api.postalytics.com${fixture.path}`);
			expect(init.method).toBe(fixture.method);
			expect(new Headers(init.headers).get('Authorization')).toBe(
				`Basic ${Buffer.from('fixture-key:').toString('base64')}`,
			);
			if ('body' in fixture.input)
				expect(JSON.parse(String(init.body))).toEqual(fixture.input.body);
			else expect(init.body).toBeUndefined();
		});
	}
});
