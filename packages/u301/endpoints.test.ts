import { logEventFromContext } from 'corsair/core';
import * as Api from './endpoints';
import { U301EndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	AUDIENCE,
	BAD_REQUEST,
	CLICKS,
	DOMAIN_ACTIVE,
	DOMAIN_CREATED,
	DOMAIN_DELETED,
	DOMAIN_DETAIL,
	DOMAIN_NOT_READY,
	DOMAINS,
	LINK,
	LINK_CREATED_ARRAY,
	LINK_DELETED,
	LINK_REUSED,
	LINKS,
	LIST_PER_PAGE_TOO_SMALL,
	PRO_ONLY,
	QUOTA,
	SETTINGS_OK,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('links.create', () => {
	it('posts a one-element array to the bulk route', async () => {
		respond(fetchMock, LINK_CREATED_ARRAY);

		const result = (await invoke(Api.create, {
			url: 'https://example.com',
		})) as { slug?: string; shortLink?: string; isReused?: boolean };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/shorten/bulk');
		expect(request.method).toBe('POST');
		// The SDK's create is the bulk route with one element.
		expect(request.bodyArray).toHaveLength(1);
		expect(result.slug).toBe('jtyZ');
		expect(result.shortLink).toBe('u301.co/jtyZ');
	});

	it('unwraps the array the bulk route answers even for one link', async () => {
		respond(fetchMock, LINK_CREATED_ARRAY);

		const result = (await invoke(Api.create, {
			url: 'https://example.com',
		})) as {
			id?: string;
		};

		// A caller gets the link, not a one-element array.
		expect(result.id).toBe('019a7d8c-4a85-7aa4-9862-ee2008f54854');
	});

	it('carries the custom slug, domain, password and comment', async () => {
		respond(fetchMock, LINK_CREATED_ARRAY);

		await invoke(Api.create, {
			url: 'https://example.com/x',
			domain: 'go.example.com',
			slug: 'spring',
			password: 'hunter2',
			comment: 'spring campaign',
		});

		// unknown: the bulk item is the JSON the endpoint sent; the cast only lets
		// toMatchObject read its fields.
		const body = lastRequest(fetchMock).bodyArray?.[0] as Record<
			string,
			unknown
		>;
		expect(body).toMatchObject({
			domain: 'go.example.com',
			slug: 'spring',
			password: 'hunter2',
			comment: 'spring campaign',
		});
	});

	it('reports a reuse, which spends no allowance', async () => {
		respond(fetchMock, [LINK_REUSED]);

		const result = (await invoke(Api.create, {
			url: 'https://example.com',
			reuseExisting: true,
		})) as { isReused?: boolean };

		expect(result.isReused).toBe(true);
	});

	it('logs the slug and whether it was reused, never the destination', async () => {
		respond(fetchMock, [LINK_REUSED]);

		await invoke(Api.create, {
			url: 'https://example.com/secret-path',
			reuseExisting: true,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'u301.links.create',
			{ slug: 'jtyZ', reused: true },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret-path');
	});

	it('rejects a create with no url', async () => {
		await expect(invoke(Api.create, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		['an empty array', []],
		[
			'an item that carries error',
			[{ error: 'INVALID_URL', message: 'The url is not valid' }],
		],
		['an item with no link in it', [{}]],
	])(
		'rejects a 200 answer with %s and does not log it as completed',
		async (_label, body) => {
			respond(fetchMock, body);

			await expect(
				invoke(Api.create, { url: 'https://example.com' }),
			).rejects.toThrow();
			expect(mockLog).not.toHaveBeenCalledWith(
				expect.anything(),
				'u301.links.create',
				expect.anything(),
				'completed',
			);
		},
	);

	it('surfaces the link quota rather than retrying it', async () => {
		respond(fetchMock, QUOTA, 429);

		await expect(
			invoke(Api.create, { url: 'https://example.com' }),
		).rejects.toThrow('MONTHLY_LINK_LIMIT_REACHED: Monthly link limit reached');
	});
});

describe('links.list', () => {
	it('reads the rows from the links key', async () => {
		respond(fetchMock, LINKS);

		const result = (await invoke(Api.list, {})) as {
			links?: { slug?: string; statsClicks?: number }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/v3/shorten/list');
		expect(result.links).toHaveLength(2);
		expect(result.links?.[0]?.statsClicks).toBe(42);
	});

	it('rejects a 200 answer with no links key', async () => {
		respond(fetchMock, {});

		await expect(invoke(Api.list, {})).rejects.toThrow();
	});

	it('accepts an empty page', async () => {
		respond(fetchMock, {
			links: [],
			metadata: { total: 0, perPage: 10, page: 1 },
		});

		const result = (await invoke(Api.list, {})) as { links?: unknown[] };

		expect(result.links).toEqual([]);
	});

	it('types the paging metadata the list returns', async () => {
		respond(fetchMock, LINKS);

		const result = Outputs.linkList.parse(await invoke(Api.list, {}));

		expect(result.metadata?.total).toBe(2);
		expect(result.metadata?.page).toBe(1);
	});

	it('passes paging', async () => {
		respond(fetchMock, LINKS);

		await invoke(Api.list, { page: 2, perPage: 50 });

		expect(lastRequest(fetchMock).query).toMatchObject({
			page: '2',
			perPage: '50',
		});
	});

	it('logs the count', async () => {
		respond(fetchMock, LINKS);

		await invoke(Api.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'u301.links.list',
			{ links: 2 },
			'completed',
		);
	});

	it('refuses a page size outside the 10 to 200 the API accepts', async () => {
		// Live: perPage=5 answers 400 "must be greater than or equal to 10", and
		// perPage=1000 answers "less than or equal to 200".
		for (const perPage of [5, 201]) {
			await expect(invoke(Api.list, { perPage })).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a page below 1', async () => {
		await expect(invoke(Api.list, { page: 0 })).rejects.toThrow();
	});
});

describe('links.get', () => {
	it('puts the whole short link in the path, keeping its slash', async () => {
		respond(fetchMock, LINK);

		const result = (await invoke(Api.get, { shortlink: 'u301.co/jtyZ' })) as {
			slug?: string;
			statsClicks?: number;
			archived?: boolean;
		};

		// The slash is part of the path the API expects, not an encoded %2F.
		expect(lastRequest(fetchMock).path).toBe('/v3/shorten/u301.co/jtyZ');
		expect(result.slug).toBe('jtyZ');
		expect(result.statsClicks).toBe(42);
		expect(result.archived).toBe(false);
	});

	it('strips a scheme a caller might include', async () => {
		respond(fetchMock, LINK);

		await invoke(Api.get, { shortlink: 'https://u301.co/jtyZ' });

		expect(lastRequest(fetchMock).path).toBe('/v3/shorten/u301.co/jtyZ');
	});

	it('encodes a character that would break the path', async () => {
		respond(fetchMock, LINK);

		await invoke(Api.get, { shortlink: 'u301.co/a b' });

		expect(lastRequest(fetchMock).path).toBe('/v3/shorten/u301.co/a%20b');
	});

	it('rejects an empty short link', async () => {
		await expect(invoke(Api.get, { shortlink: '' })).rejects.toThrow();
	});

	it('refuses a short link that names the domain route', async () => {
		// `domains/go.example.com` would build DELETE /shorten/domains/go.example.com,
		// which is the domain-delete route on a call authorised only as links.delete.
		await expect(
			invoke(Api.get, { shortlink: 'domains/go.example.com' }),
		).rejects.toThrow(/reserved route/);
	});

	it('refuses a short link with more than one separator', async () => {
		await expect(
			invoke(Api.get, { shortlink: 'u301.co/abc/def' }),
		).rejects.toThrow(/one host and one slug/);
	});

	it('refuses a bare host with no slug', async () => {
		await expect(invoke(Api.get, { shortlink: 'u301.co' })).rejects.toThrow(
			/one host and one slug/,
		);
	});
});

describe('links.delete', () => {
	it('never sends a delete for a short link that names the domain route', async () => {
		await expect(
			invoke(Api.remove, { shortlink: 'domains/go.example.com' }),
		).rejects.toThrow(/reserved route/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses dot segments, which fetch would resolve into another route', async () => {
		// `./domains` would become DELETE /v3/shorten/domains once the URL is
		// normalised, a domain route reached through links.delete.
		for (const shortlink of ['./domains', '../domains', 'u301.co/..']) {
			await expect(invoke(Api.remove, { shortlink })).rejects.toThrow(
				/dot segment/,
			);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes by short link and reads the bare success message', async () => {
		respond(fetchMock, LINK_DELETED);

		const result = (await invoke(Api.remove, {
			shortlink: 'u301.co/jtyZ',
		})) as { message?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v3/shorten/u301.co/jtyZ');
		expect(result.message).toBe('success');
	});
});

describe('domains', () => {
	it('lists domains with their slug length and origin', async () => {
		respond(fetchMock, DOMAINS);

		const result = (await invoke(Api.domainList, {})) as {
			domain?: string;
			randomCodeLength?: number;
			isGlobal?: boolean;
		}[];

		expect(lastRequest(fetchMock).path).toBe('/v3/shorten/domains');
		expect(result).toHaveLength(2);
		expect(result[0]?.isGlobal).toBe(true);
		expect(result[1]?.randomCodeLength).toBe(5);
	});

	it('creates a domain with PUT and a slug length', async () => {
		respond(fetchMock, DOMAIN_CREATED);

		const result = (await invoke(Api.domainCreate, {
			domain: 'go.example.com',
			shortCodeLength: 5,
		})) as { message?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/v3/shorten/domains');
		expect(request.bodyRecord).toEqual({
			domain: 'go.example.com',
			shortCodeLength: 5,
		});
		expect(result.message).toBe('Domain created');
	});

	it('rejects a create or delete that answers success false', async () => {
		respond(fetchMock, { success: false, message: 'Domain already exists' });
		respond(fetchMock, { success: false, message: 'Domain not found' });

		await expect(
			invoke(Api.domainCreate, { domain: 'go.example.com' }),
		).rejects.toThrow();
		await expect(
			invoke(Api.domainDelete, { domain: 'go.example.com' }),
		).rejects.toThrow();
	});

	it('accepts the documented success true answer', async () => {
		respond(fetchMock, { success: true });

		const result = (await invoke(Api.domainCreate, {
			domain: 'go.example.com',
		})) as { success?: boolean };

		expect(result.success).toBe(true);
	});

	it('types the message create and delete answer', async () => {
		respond(fetchMock, DOMAIN_CREATED);
		respond(fetchMock, DOMAIN_DELETED);

		const created = Outputs.domainCreate.parse(
			await invoke(Api.domainCreate, { domain: 'go.example.com' }),
		);
		const deleted = Outputs.domainDelete.parse(
			await invoke(Api.domainDelete, { domain: 'go.example.com' }),
		);

		expect(created.message).toBe('Domain created');
		expect(deleted.message).toBe('success');
	});

	it('rejects a slug length outside the documented 3-10', async () => {
		await expect(
			invoke(Api.domainCreate, { domain: 'x.com', shortCodeLength: 11 }),
		).rejects.toThrow();
	});

	it('reads one domain with its redirect settings', async () => {
		respond(fetchMock, DOMAIN_DETAIL);

		const result = (await invoke(Api.domainGet, {
			domain: 'go.example.com',
		})) as {
			isValid?: boolean;
			homePageRedirectUrl?: string;
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/v3/shorten/domains/go.example.com',
		);
		expect(result.isValid).toBe(true);
		expect(result.homePageRedirectUrl).toBe('https://example.com');
	});

	it('types the documented DNS settings, which finish the custom-domain setup', async () => {
		respond(fetchMock, DOMAIN_DETAIL);

		const result = Outputs.domainGet.parse(
			await invoke(Api.domainGet, { domain: 'go.example.com' }),
		);

		expect(result.isGlobal).toBe(false);
		expect(result.dnsSettings?.cnameValue).toBe('babbette971.bender.u301.com');
		expect(result.dnsSettings?.isHostedOnCloudflare).toBe(true);
		expect(result.dnsSettings?.subdomain).toBe('go');
		expect(result.dnsSettings?.cloudflareAuthUrl).toContain(
			'dash.cloudflare.com',
		);
	});

	it('checks the active status, whose field is spelled actived', async () => {
		respond(fetchMock, DOMAIN_ACTIVE);

		const result = (await invoke(Api.domainActive, {
			domain: 'go.example.com',
		})) as { actived?: boolean; message?: string };

		expect(lastRequest(fetchMock).path).toBe(
			'/v3/shorten/domains/active/go.example.com',
		);
		expect(lastRequest(fetchMock).method).toBe('PATCH');
		// Kept as the API spells it.
		expect(result.actived).toBe(true);
	});

	it('reports a domain whose challenge has not resolved', async () => {
		respond(fetchMock, DOMAIN_NOT_READY);

		const result = (await invoke(Api.domainActive, {
			domain: 'go.example.com',
		})) as { actived?: boolean; message?: string };

		expect(result.actived).toBe(false);
		expect(result.message).toBe('Challenge not ready');
	});

	it('refuses a dot segment as a domain, so the path stays on that domain', async () => {
		for (const domain of ['.', '..']) {
			await expect(invoke(Api.domainDelete, { domain })).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a domain', async () => {
		respond(fetchMock, DOMAIN_DELETED);

		await invoke(Api.domainDelete, { domain: 'go.example.com' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v3/shorten/domains/go.example.com');
	});
});

describe('domain settings', () => {
	it('sets the random slug length with one PATCH field', async () => {
		respond(fetchMock, SETTINGS_OK);

		await invoke(Api.domainPathLength, {
			domain: 'go.example.com',
			randomCodeLength: 8,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe('/v3/shorten/domains/go.example.com');
		expect(request.bodyRecord).toEqual({ randomCodeLength: 8 });
	});

	it('sets the home redirect with only that field', async () => {
		respond(fetchMock, SETTINGS_OK);

		await invoke(Api.domainHomeRedirect, {
			domain: 'go.example.com',
			homePageRedirectUrl: 'https://example.com',
		});

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			homePageRedirectUrl: 'https://example.com',
		});
	});

	it('sets the not-found redirect with only that field', async () => {
		respond(fetchMock, SETTINGS_OK);

		await invoke(Api.domainNotFoundRedirect, {
			domain: 'go.example.com',
			notFoundPageRedirectUrl: 'https://example.com/404',
		});

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			notFoundPageRedirectUrl: 'https://example.com/404',
		});
	});
});

describe('analytics', () => {
	it('reads click buckets for a range and granularity', async () => {
		respond(fetchMock, CLICKS);

		const result = (await invoke(Api.clicks, {
			range: '7d',
			granularity: 'day',
		})) as { data?: { date?: string; click?: number }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/shorten/analytics/clicks');
		expect(request.query).toMatchObject({ range: '7d', granularity: 'day' });
		expect(result.data).toHaveLength(3);
		expect(result.data?.[1]?.click).toBe(30);
	});

	it('passes the timezone', async () => {
		respond(fetchMock, CLICKS);

		await invoke(Api.clicks, {
			range: '30d',
			granularity: 'hour',
			timezone: 'Asia/Kolkata',
		});

		expect(lastRequest(fetchMock).query.timezone).toBe('Asia/Kolkata');
	});

	it('sums the clicks for the log', async () => {
		respond(fetchMock, CLICKS);

		await invoke(Api.clicks, { range: '7d', granularity: 'day' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'u301.analytics.clicks',
			{ range: '7d', buckets: 3, clicks: 50 },
			'completed',
		);
	});

	it('puts the audience dimension in the path', async () => {
		respond(fetchMock, AUDIENCE);

		const result = (await invoke(Api.audience, {
			dimension: 'countries',
			range: '30d',
		})) as { data?: { label?: string; click?: number }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v3/shorten/analytics/top-countries');
		expect(request.query.range).toBe('30d');
		expect(result.data?.[0]?.label).toBe('United States');
		expect(result.data?.[0]?.click).toBe(210);
	});

	it('does not fail a read when the API echoes a range it adds later', async () => {
		respond(fetchMock, { ...AUDIENCE, range: '90d' });

		const result = (await invoke(Api.audience, {
			dimension: 'countries',
			range: '30d',
		})) as { range?: string };

		expect(result.range).toBe('90d');
	});

	it('accepts each documented dimension', async () => {
		for (const dimension of [
			'countries',
			'cities',
			'referers',
			'browsers',
			'operating-systems',
			'device-types',
		] as const) {
			respond(fetchMock, AUDIENCE);
			await invoke(Api.audience, { dimension, range: '7d' });
			expect(lastRequest(fetchMock).path).toBe(
				`/v3/shorten/analytics/top-${dimension}`,
			);
		}
	});

	it('rejects a dimension the API does not document', async () => {
		await expect(
			invoke(Api.audience, { dimension: 'languages', range: '7d' }),
		).rejects.toThrow();
	});

	it('rejects a range the API does not document', async () => {
		await expect(
			invoke(Api.clicks, { range: '2d', granularity: 'day' }),
		).rejects.toThrow();
	});
});

describe('error propagation', () => {
	it("reads the reason from the API's nested validation body", async () => {
		respond(fetchMock, LIST_PER_PAGE_TOO_SMALL, 400);

		const error = await invoke(Api.domainList, {}).catch((e: Error) => e);

		expect(String(error)).toContain(
			'perPage: Number must be greater than or equal to 10',
		);
		expect((error as { details?: unknown }).details).toEqual([
			{
				field: 'perPage',
				message: 'Number must be greater than or equal to 10',
			},
		]);
	});

	it('names the plan when a redirect setting is Pro only', async () => {
		respond(fetchMock, PRO_ONLY, 403);

		await expect(
			invoke(Api.domainHomeRedirect, {
				domain: 'go.example.com',
				homePageRedirectUrl: 'https://example.com',
			}),
		).rejects.toThrow('only available for Pro Plan');
	});

	it('surfaces the per-field errors from a validation failure', async () => {
		respond(fetchMock, BAD_REQUEST, 422);

		await expect(invoke(Api.create, { url: 'not-a-url' })).rejects.toThrow(
			'url must be a valid URL',
		);
	});
});
