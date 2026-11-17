import { FirehoseEndpoints, IssuancesEndpoints } from './endpoints';
import {
	bareIssuance,
	issuance,
	issuancePage,
	revokedIssuance,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		expand: parsed.searchParams.getAll('expand'),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.certspotter.com');
	expect(sent.headers.get('authorization')).toBe('Bearer cs-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('issuances.list', () => {
	it('GETs v1/issuances with only the domain', async () => {
		respond(issuancePage);

		const result = (await invoke(IssuancesEndpoints.list, {
			domain: 'example.com',
		})) as unknown[];

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/issuances',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({ domain: 'example.com' });
		expect(result).toHaveLength(2);
	});

	it('sends the paging cursor and the boolean filters', async () => {
		respond([revokedIssuance]);

		await invoke(IssuancesEndpoints.list, {
			domain: 'example.com',
			include_subdomains: true,
			match_wildcards: true,
			after: '4326219514',
		});

		expect(lastRequest().params).toEqual({
			domain: 'example.com',
			include_subdomains: 'true',
			match_wildcards: 'true',
			after: '4326219514',
		});
	});

	it('repeats expand once per requested field', async () => {
		respond([issuance]);

		await invoke(IssuancesEndpoints.list, {
			domain: 'example.com',
			expand: ['dns_names', 'issuer', 'issuer.caa_domains', 'revocation'],
		});

		expect(lastRequest().expand).toEqual([
			'dns_names',
			'issuer',
			'issuer.caa_domains',
			'revocation',
		]);
	});

	it('omits expand entirely when none is asked for', async () => {
		respond([bareIssuance]);

		await invoke(IssuancesEndpoints.list, { domain: 'example.com' });

		expect(lastRequest().expand).toEqual([]);
	});

	it('rejects an expand value the reference does not list', async () => {
		const error = await captureError(
			invoke(IssuancesEndpoints.list, {
				domain: 'example.com',
				expand: ['dns_names', 'not_a_field'],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a missing domain before sending', async () => {
		const error = await captureError(invoke(IssuancesEndpoints.list, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('firehose', () => {
	it('GETs v1/issuances/firehose with no cursor', async () => {
		respond([bareIssuance]);

		const result = (await invoke(FirehoseEndpoints.list, {})) as unknown[];

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/issuances/firehose',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({});
		expect(result).toHaveLength(1);
	});

	it('sends the cursor and the expansions', async () => {
		respond([]);

		await invoke(FirehoseEndpoints.list, {
			after: '17433446883',
			expand: ['dns_names'],
		});

		expect(lastRequest().params).toMatchObject({ after: '17433446883' });
		expect(lastRequest().expand).toEqual(['dns_names']);
	});
});
