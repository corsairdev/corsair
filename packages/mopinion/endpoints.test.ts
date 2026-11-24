import { createHmac } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { Account, Datasets, Deployments, Reports } from './endpoints';
import {
	account,
	dataset,
	deployment,
	feedbackItem,
	invalidCredentialsProblem,
	meta,
	report,
	serverProblem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
// The keyBuilder resolves `<public key>:<signature token>`; the client reads only ctx.key.
const ctx = { key: 'pub-1:sig-1' };

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
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
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('GETs /account signed and passes the body through', async () => {
		respond(account);

		const result = await invoke(Account.get, {});

		const sent = lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://api.mopinion.com',
			method: 'GET',
			path: '/account',
		});
		const token = Buffer.from(
			sent.headers.get('x-auth-token') ?? '',
			'base64',
		).toString('utf8');
		expect(token).toMatch(/^pub-1:[0-9a-f]{64}$/);
		const expected = createHmac('sha256', 'sig-1')
			.update('/account|')
			.digest('hex');
		expect(token.split(':')[1]).toBe(expected);
		expect(sent.headers.get('version')).toBe('2.5.0');
		expect(result).toEqual(account);
	});

	it('surfaces the RFC 7807 problem on a 401', async () => {
		respond(invalidCredentialsProblem, 401, 'application/problem+json');

		// unknown: a promise can reject with any value, so the rejection
		// reason has no static type; the assertions narrow it.
		const error = await invoke(Account.get, {}).catch(
			(caught: unknown) => caught,
		);

		expect(error).toMatchObject({
			name: 'ApiError',
			status: 401,
			message: 'Mopinion 401 18: The credentials you provided are not valid',
		});
	});
});

describe('datasets', () => {
	it('lists feedback with paging, sorting and filters', async () => {
		respond({ data: [feedbackItem], _meta: meta });

		const result = await invoke(Datasets.feedback, {
			datasetId: '123456',
			page: 2,
			limit: 10,
			sort: 'datetime',
			order: 'asc',
			filters: { '<<nps': 5, date_from: '2026-04-01' },
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/datasets/123456/feedback',
		});
		expect(lastRequest().query).toEqual({
			page: '2',
			limit: '10',
			sort: 'datetime',
			order: 'asc',
			'filter[<<nps]': '5',
			'filter[date_from]': '2026-04-01',
		});
		expect(result).toEqual({ data: [feedbackItem], _meta: meta });
	});

	it('reads one feedback item and the fields', async () => {
		respond({ data: [feedbackItem], _meta: { code: 200 } });

		const result = await invoke(Datasets.feedbackItem, {
			datasetId: '123456',
			feedbackId: '987654',
		});

		expect(lastRequest().path).toBe('/datasets/123456/feedback/987654');
		expect(result).toEqual({ data: [feedbackItem], _meta: { code: 200 } });

		respond({ data: [], _meta: { code: 200 } });
		await invoke(Datasets.fields, { datasetId: '123456' });
		expect(lastRequest().path).toBe('/datasets/123456/fields');
	});

	it('rejects a limit above the documented 1000', async () => {
		await expect(
			invoke(Datasets.feedback, { datasetId: '123456', limit: 1001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown sort field', async () => {
		await expect(
			invoke(Datasets.feedback, { datasetId: '123456', sort: 'nps' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets basic info on a dataset', async () => {
		respond({ ...dataset, _meta: { code: 200 } });

		const result = await invoke(Datasets.get, { datasetId: '123456' });

		expect(lastRequest().path).toBe('/datasets/123456');
		expect(result).toEqual({ ...dataset, _meta: { code: 200 } });
	});
});

describe('reports', () => {
	it('lists report feedback with a filter expression', async () => {
		respond({ data: [feedbackItem], _meta: meta });

		await invoke(Reports.feedback, {
			reportId: '42',
			filters: { tags: '*', '!nps': 3 },
		});

		expect(lastRequest().path).toBe('/reports/42/feedback');
		expect(lastRequest().query).toEqual({
			'filter[tags]': '*',
			'filter[!nps]': '3',
		});
	});

	it('reads one report feedback item and the fields', async () => {
		respond({ data: [feedbackItem], _meta: { code: 200 } });

		const result = await invoke(Reports.feedbackItem, {
			reportId: '42',
			feedbackId: '987654',
		});

		expect(lastRequest().path).toBe('/reports/42/feedback/987654');
		expect(result).toEqual({ data: [feedbackItem], _meta: { code: 200 } });

		respond({ data: [], _meta: { code: 200 } });
		await invoke(Reports.fields, { reportId: '42' });
		expect(lastRequest().path).toBe('/reports/42/fields');
	});

	it('reads basic info on a report', async () => {
		respond({ ...report, _meta: { code: 200 } });

		const result = await invoke(Reports.get, { reportId: 1 });

		expect(lastRequest().path).toBe('/reports/1');
		expect(result).toEqual({ ...report, _meta: { code: 200 } });
	});
});

describe('deployments', () => {
	it('lists and gets', async () => {
		respond({ data: [deployment], _meta: meta });

		const result = await invoke(Deployments.list, {});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/deployments',
		});
		expect(result).toEqual({ data: [deployment], _meta: meta });

		respond({ ...deployment, _meta: { code: 200 } });
		await invoke(Deployments.get, { deploymentId: '441' });
		expect(lastRequest().path).toBe('/deployments/441');
	});

	it('passes paging to the deployments list and surfaces the live 500', async () => {
		respond(serverProblem, 500, 'application/problem+json');

		const error = await invoke(Deployments.list, { page: 2, limit: 5 }).catch(
			(caught: unknown) => caught,
		);

		expect(lastRequest().query).toEqual({ page: '2', limit: '5' });
		expect(error).toMatchObject({
			status: 500,
			message: 'Mopinion 500 2: Server error',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('documented shapes the trial did not return', () => {
	it('accepts a string feedback id, as the 2.x spec documents', async () => {
		respond({ data: [{ ...feedbackItem, id: '218463' }], _meta: meta });
		const result = (await invoke(Datasets.feedback, { datasetId: 1 })) as {
			data: Array<{ id: unknown }>;
		};
		expect(result.data[0]?.id).toBe('218463');
	});

	it('accepts the deployments list as a bare array, as the 2.x spec documents', async () => {
		respond([{ key: 'abc', name: 'Web' }]);
		await expect(invoke(Deployments.list, {})).resolves.toEqual([
			{ key: 'abc', name: 'Web' },
		]);
	});
});

describe('ids', () => {
	it('takes numeric ids', async () => {
		respond({ data: [], _meta: meta });
		await invoke(Datasets.feedback, { datasetId: 123, limit: 2 });
		expect(lastRequest().path).toBe('/datasets/123/feedback');
	});

	it.each(['..', '.', '1/../account', ''])(
		'refuses %p before signing anything',
		async (id) => {
			await expect(invoke(Datasets.get, { datasetId: id })).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});
