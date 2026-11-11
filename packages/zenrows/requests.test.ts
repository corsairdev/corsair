import { logEventFromContext } from 'corsair/core';
import { ZenRowsAPIError } from './client';
import { Crawls, Extract, Fetch } from './endpoints';
import type { ZenRowsEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	captureError,
	crawlPage,
	crawlStarted,
	crawlSummary,
	extractAllowance,
	extractPreparation,
	extractServedDomain,
	jsonResponseEnvelope,
	jsonResponseWithCssExtractor,
	productsExtract,
	selectorsResult,
	subscriptionDetails,
	textPage,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'zr-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each returns its own output type, so the shared
// return is unknown, and each assertion below casts to the fields it reads.
// unknown: see the note above; the shared return type cannot be narrowed
// without listing every operation's output.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts, and a positive case
// passes the operation's own input. The endpoint validates it either way.
function invoke(endpoint: AnyEndpoint, input: unknown = {}) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary provider JSON or page text.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
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
		rawBody: init.body as string | undefined,
		// unknown: the request body is whatever the endpoint serialised, and a
		// forwarded Fetch body can be a urlencoded or plain string.
		body: parseJsonBodyOrUndefined(init.body),
	};
}

// unknown: only a JSON body is parsed; a forwarded string or urlencoded body
// stays raw, and the caller asserts on `rawBody` instead.
function parseJsonBodyOrUndefined(body: RequestInit['body']): unknown {
	if (typeof body !== 'string') return undefined;
	try {
		return JSON.parse(body);
	} catch {
		return undefined;
	}
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.zenrows.com');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	// A spy with no queued response falls through to the real fetch, so every
	// call a test did not stub fails here instead of reaching the network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('fetch.page', () => {
	it('GETs /v1/ with the url and asks for markdown', async () => {
		respond(textPage.markdown, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			responseType: 'markdown',
		})) as { body: string; responseType: string };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/');
		expect(sent.query).toEqual({
			url: 'https://example.com',
			response_type: 'markdown',
		});
		expect(result.responseType).toBe('markdown');
		expect(result.body).toBe(textPage.markdown);
	});

	it('defaults responseType to html and sends every rendering option', async () => {
		respond(textPage.html, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			jsRender: true,
			premiumProxy: true,
			proxyCountry: 'us',
			waitFor: '.price',
			wait: 500,
			blockResources: ['image', 'font'],
			allowedStatusCodes: [404, 500],
			sessionId: 12345,
			originalStatus: true,
		})) as { responseType: string };

		const sent = lastRequest();
		expect(result.responseType).toBe('html');
		expect(sent.query).toMatchObject({
			js_render: 'true',
			premium_proxy: 'true',
			proxy_country: 'us',
			wait_for: '.price',
			wait: '500',
			block_resources: 'image,font',
			allowed_status_codes: '404,500',
			session_id: '12345',
			original_status: 'true',
		});
		// Browser actions are a write, so a read never carries them.
		expect(sent.query.js_instructions).toBeUndefined();
	});

	it('rejects mode=auto combined with jsRender or premiumProxy', async () => {
		await expect(
			invoke(Fetch.fetchPage, {
				url: 'https://example.com',
				mode: 'auto',
				jsRender: true,
			}),
		).rejects.toThrow(/picks rendering itself/);
		await expect(
			invoke(Fetch.fetchPage, {
				url: 'https://example.com',
				mode: 'auto',
				premiumProxy: true,
			}),
		).rejects.toThrow(/picks proxies itself/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects the options Zenrows only accepts with a browser', async () => {
		await expect(
			invoke(Fetch.fetchPage, {
				url: 'https://example.com',
				waitFor: '.x',
			}),
		).rejects.toThrow(/waitFor needs jsRender/);
		await expect(
			invoke(Fetch.fetchPage, {
				url: 'https://example.com',
				proxyCountry: 'us',
			}),
		).rejects.toThrow(/proxyCountry needs premiumProxy/);
	});

	it('follows the spec: wait needs a browser, proxyCountry needs premiumProxy', async () => {
		// The OpenAPI spec says `wait` "Requires js_render" and `proxy_country`
		// "Requires premium_proxy"; rendering alone does not unlock geolocation.
		await expect(
			invoke(Fetch.fetchPage, { url: 'https://example.com', wait: 500 }),
		).rejects.toThrow(/wait needs jsRender/);
		await expect(
			invoke(Fetch.fetchPage, {
				url: 'https://example.com',
				jsRender: true,
				proxyCountry: 'us',
			}),
		).rejects.toThrow(/proxyCountry needs premiumProxy/);
		expect(fetchMock).not.toHaveBeenCalled();

		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			mode: 'auto',
			proxyCountry: 'us',
			wait: 500,
		});
		expect(lastRequest().query).toMatchObject({
			mode: 'auto',
			proxy_country: 'us',
			wait: '500',
		});
	});

	it('rejects a non-http url', async () => {
		await expect(
			invoke(Fetch.fetchPage, { url: 'ftp://example.com' }),
		).rejects.toThrow(/http or https/);
	});
});

describe('fetch.browse', () => {
	it('sends browser actions only through the write operation', async () => {
		respond(textPage.html, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchBrowse, {
			url: 'https://example.com',
			jsRender: true,
			jsInstructions: [{ fill: ['#q', 'shoes'] }, { click: '#submit' }],
		})) as { body: string; responseType: string };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.query.js_instructions).toBe(
			'[{"fill":["#q","shoes"]},{"click":"#submit"}]',
		);
		expect(sent.query.js_render).toBe('true');
		expect(result.responseType).toBe('html');
		expect(result.body).toBe(textPage.html);
	});

	it('requires at least one action and a browser', async () => {
		await expect(
			invoke(Fetch.fetchBrowse, {
				url: 'https://example.com',
				jsRender: true,
				jsInstructions: [],
			}),
		).rejects.toThrow();
		// No jsRender and no mode: nothing would run the actions.
		await expect(
			invoke(Fetch.fetchBrowse, {
				url: 'https://example.com',
				jsInstructions: [{ click: '#a' }],
			}),
		).rejects.toThrow(/jsRender/);
	});

	it('rejects an instruction with two actions and a mistyped action key', async () => {
		await expect(
			invoke(Fetch.fetchBrowse, {
				url: 'https://example.com',
				jsRender: true,
				jsInstructions: [{ click: '.a', wait: 10 }],
			}),
		).rejects.toThrow(/exactly one action key/);
		await expect(
			invoke(Fetch.fetchBrowse, {
				url: 'https://example.com',
				jsRender: true,
				// A mistyped key would be ignored by the browser, not rejected.
				jsInstructions: [{ clik: '.a' }],
			}),
		).rejects.toThrow();
	});
});

describe('caller headers', () => {
	it('forwards headers to the target and moves the key off the header', async () => {
		respond(textPage.html, 200, 'text/plain');

		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			headers: { Referer: 'https://www.google.com', Cookie: 'session=abc' },
		});

		const sent = lastRequest();
		// ZenRows copies every request header onto the target when forwarding,
		// so the key must ride in the query string.
		expect(sent.headers.get('x-api-key')).toBeNull();
		expect(sent.query.apikey).toBe(API_KEY);
		expect(sent.headers.get('referer')).toBe('https://www.google.com');
		expect(sent.headers.get('cookie')).toBe('session=abc');
		// headers imply the switch that turns forwarding on.
		expect(sent.query.custom_headers).toBe('true');
	});

	it('forwards headers on every Fetch operation that accepts them', async () => {
		// unknown: each entry pairs an operation with that operation's own input,
		// which no single type can describe; `invoke` validates it per endpoint.
		const ops: [AnyEndpoint, unknown][] = [
			[Fetch.fetchPage, { url: 'https://example.com' }],
			[
				Fetch.fetchBrowse,
				{
					url: 'https://example.com',
					jsRender: true,
					jsInstructions: [{ wait: 10 }],
				},
			],
			[
				Fetch.fetchCssExtract,
				{ url: 'https://example.com', cssExtractor: { t: 'h1' } },
			],
			[Fetch.fetchOutputs, { url: 'https://example.com', outputs: ['links'] }],
			[Fetch.fetchJsonResponse, { url: 'https://example.com', jsRender: true }],
			[Fetch.fetchExtract, { url: 'https://example.com' }],
		];
		for (const [op, input] of ops) {
			fetchMock.mockClear();
			respond('{"ok":true}', 200, 'text/plain');
			await invoke(op, {
				...(input as object),
				headers: { 'User-Agent': 'corsair-test' },
			});
			const sent = lastRequest();
			expect(sent.headers.get('user-agent')).toBe('corsair-test');
			expect(sent.headers.get('x-api-key')).toBeNull();
			expect(sent.query.apikey).toBe(API_KEY);
		}
	});

	it('turns forwarding on for headers even when customHeaders is false', async () => {
		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			customHeaders: false,
			headers: { Cookie: 'session=abc' },
		});
		const sent = lastRequest();
		// The key already left the header for these headers, so ZenRows must
		// forward them to the target rather than keep them for itself.
		expect(sent.query.apikey).toBe(API_KEY);
		expect(sent.query.custom_headers).toBe('true');
	});

	it('does not forward its own Accept header to the target', async () => {
		// ZenRows forwards Accept when custom_headers is on, and a site that
		// negotiates content would answer JSON or 406 to application/json.
		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			headers: { Cookie: 'session=abc' },
		});
		expect(lastRequest().headers.get('accept')).toBeNull();

		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			customHeaders: true,
		});
		expect(lastRequest().headers.get('accept')).toBeNull();

		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			headers: { Accept: 'text/html' },
		});
		expect(lastRequest().headers.get('accept')).toBe('text/html');

		// Without forwarding, Accept reaches only ZenRows and stays as it was.
		respond(textPage.html, 200, 'text/plain');
		await invoke(Fetch.fetchPage, { url: 'https://example.com' });
		expect(lastRequest().headers.get('accept')).toBe('application/json');
	});

	it('refuses a header the client owns', async () => {
		for (const name of ['X-API-Key', 'apikey', 'Content-Type']) {
			await expect(
				invoke(Fetch.fetchPage, {
					url: 'https://example.com',
					headers: { [name]: 'x' },
				}),
			).rejects.toThrow(/set by Corsair/);
		}
		await expect(
			invoke(Fetch.fetchPage, { url: 'https://example.com', headers: {} }),
		).rejects.toThrow(/at least one header/);
	});
});

describe('fetch.extract', () => {
	it('defaults extract to auto and returns the parsed fields', async () => {
		respond(productsExtract, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchExtract, {
			url: 'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie/',
		})) as ReturnType<typeof Outputs.fetchExtract.parse>;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.query).toMatchObject({
			url: 'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie/',
			extract: 'auto',
		});
		expect(result.parsed).toEqual(productsExtract.parsed);
	});

	it('narrows fields and never sends extract with a selector map', async () => {
		respond(productsExtract, 200, 'text/plain');
		await invoke(Fetch.fetchExtract, {
			url: 'https://example.com/p/1',
			extract: 'native',
			extractFields: ['product.name', 'product.price'],
		});
		expect(lastRequest().query).toMatchObject({
			extract: 'native',
			extract_fields: 'product.name,product.price',
		});
	});

	it('rejects extractFields without extract', async () => {
		await expect(
			invoke(Fetch.fetchExtract, {
				url: 'https://example.com',
				extractFields: ['a'],
			}),
		).rejects.toThrow(/only narrows an Extract call/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails loudly when a JSON mode answers HTML', async () => {
		respond('<html></html>', 200, 'text/plain');

		const error = await captureError(
			invoke(Fetch.fetchExtract, {
				url: 'https://example.com',
			}),
		);

		expect(error).toBeInstanceOf(ZenRowsAPIError);
		expect((error as ZenRowsAPIError).message).toContain('not JSON');
	});
});

// unknown: the casts in this file narrow an operation's output to the fields the
// test reads. Declaring every operation's full output type here would duplicate
// the schemas this suite is meant to check.

describe('fetch.cssExtract', () => {
	it('sends the selector map and returns the keys at the top level', async () => {
		respond(selectorsResult, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchCssExtract, {
			url: 'https://example.com',
			cssExtractor: { title: 'h1', links: 'a @href' },
		})) as ReturnType<typeof Outputs.fetchCssExtract.parse>;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.query.css_extractor).toBe('{"title":"h1","links":"a @href"}');
		// No envelope: Extract is off, so nothing is sent for it.
		expect(sent.query.extract).toBeUndefined();
		expect(result).toEqual(selectorsResult);
	});

	it('rejects an empty selector map', async () => {
		await expect(
			invoke(Fetch.fetchCssExtract, {
				url: 'https://example.com',
				cssExtractor: {},
			}),
		).rejects.toThrow(/at least one selector/);
	});
});

describe('fetch.outputs', () => {
	it('sends the filters comma-joined', async () => {
		respond({ emails: ['a@example.com'], links: [] }, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchOutputs, {
			url: 'https://example.com',
			outputs: ['emails', 'links', 'phone_numbers'],
		})) as ReturnType<typeof Outputs.fetchCssExtract.parse>;

		expectAuthenticated();
		expect(lastRequest().query.outputs).toBe('emails,links,phone_numbers');
		expect(result.emails).toEqual(['a@example.com']);
	});

	it('keeps a null filter result rather than dropping the key', async () => {
		// A live page with no emails answers `{"emails":null,"phone_numbers":[]}`.
		respond({ emails: null, phone_numbers: [] }, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchOutputs, {
			url: 'https://example.com',
			outputs: ['emails', 'phone_numbers'],
		})) as ReturnType<typeof Outputs.fetchCssExtract.parse>;

		expect(result).toEqual({ emails: null, phone_numbers: [] });
	});

	it('rejects an unknown filter and an empty list', async () => {
		await expect(
			invoke(Fetch.fetchOutputs, {
				url: 'https://example.com',
				outputs: ['bogus'],
			}),
		).rejects.toThrow();
		await expect(
			invoke(Fetch.fetchOutputs, { url: 'https://example.com', outputs: [] }),
		).rejects.toThrow();
	});
});

describe('fetch.jsonResponse', () => {
	it('sets json_response and returns the envelope with captured XHR calls', async () => {
		respond(jsonResponseEnvelope, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchJsonResponse, {
			url: 'https://example.com',
			jsRender: true,
		})) as ReturnType<typeof Outputs.fetchJsonResponse.parse>;

		expectAuthenticated();
		expect(lastRequest().query).toMatchObject({
			url: 'https://example.com',
			js_render: 'true',
			json_response: 'true',
		});
		expect(result.html).toBe(jsonResponseEnvelope.html);
		expect(result.xhr).toEqual([]);
	});

	it('carries filters inside the envelope under outputs', async () => {
		respond(
			{
				...jsonResponseEnvelope,
				outputs: { headings: ['Shop'], emails: null },
			},
			200,
			'text/plain',
		);

		const result = (await invoke(Fetch.fetchJsonResponse, {
			url: 'https://example.com',
			mode: 'auto',
			outputs: ['headings', 'emails'],
		})) as ReturnType<typeof Outputs.fetchJsonResponse.parse>;

		expect(lastRequest().query).toMatchObject({
			mode: 'auto',
			json_response: 'true',
			outputs: 'headings,emails',
		});
		expect(result.outputs).toEqual({ headings: ['Shop'], emails: null });
	});

	it('carries selector results under css_extractor.data', async () => {
		// Live answer (11-10): the selector map's keys sit one level down, in `data`.
		respond(jsonResponseWithCssExtractor, 200, 'text/plain');

		const result = (await invoke(Fetch.fetchJsonResponse, {
			url: 'https://example.com',
			jsRender: true,
			cssExtractor: { h1: 'h1', title: 'title' },
		})) as ReturnType<typeof Outputs.fetchJsonResponse.parse>;

		expect(lastRequest().query).toMatchObject({
			json_response: 'true',
			css_extractor: '{"h1":"h1","title":"title"}',
		});
		expect(result.css_extractor).toEqual({
			data: { h1: 'Shop', title: 'Ecommerce Test Site' },
		});
	});

	it('rejects outputs together with cssExtractor, which ZenRows answers without outputs', async () => {
		await expect(
			invoke(Fetch.fetchJsonResponse, {
				url: 'https://example.com',
				mode: 'auto',
				outputs: ['links'],
				cssExtractor: { title: 'h1' },
			}),
		).rejects.toThrow(/outputs and cssExtractor/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a request with no browser to render in', async () => {
		await expect(
			invoke(Fetch.fetchJsonResponse, { url: 'https://example.com' }),
		).rejects.toThrow(/json_response needs jsRender/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('fetch.post and fetch.put', () => {
	it('relays a JSON body to the target and returns the page', async () => {
		respond('<html>posted</html>', 200, 'text/plain');

		const result = (await invoke(Fetch.fetchPost, {
			url: 'https://httpbin.io/anything',
			body: { type: 'json', value: { hello: 'world' } },
		})) as { body: string };

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.method).toBe('POST');
		expect(sent.query.url).toBe('https://httpbin.io/anything');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ hello: 'world' });
		expect(result.body).toBe('<html>posted</html>');
	});

	it('relays form fields as urlencoded text', async () => {
		respond('ok', 200, 'text/plain');

		await invoke(Fetch.fetchPost, {
			url: 'https://httpbin.io/anything',
			body: { type: 'form', value: { a: '1', b: 'two words' } },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
		expect(sent.rawBody).toBe('a=1&b=two+words');
	});

	it('relays a verbatim body with its own content type', async () => {
		respond('ok', 200, 'text/plain');

		await invoke(Fetch.fetchPost, {
			url: 'https://httpbin.io/anything',
			body: { type: 'text', value: '<x/>', contentType: 'text/xml' },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('text/xml');
		expect(sent.rawBody).toBe('<x/>');
	});

	it('sends PUT with no body when none is given', async () => {
		respond('ok', 200, 'text/plain');

		await invoke(Fetch.fetchPut, { url: 'https://httpbin.io/anything' });

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.rawBody).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('moves the key to the query when the caller forwards headers', async () => {
		respond('ok', 200, 'text/plain');

		await invoke(Fetch.fetchPost, {
			url: 'https://httpbin.io/anything',
			customHeaders: true,
		});

		const sent = lastRequest();
		expect(sent.headers.get('x-api-key')).toBeNull();
		expect(sent.query.apikey).toBe(API_KEY);
		expect(sent.query.custom_headers).toBe('true');
	});

	it('refuses a raw string sent as JSON, which would be re-encoded', async () => {
		await expect(
			invoke(Fetch.fetchPost, {
				url: 'https://httpbin.io/anything',
				body: {
					type: 'text',
					value: '{"id":1}',
					contentType: 'application/json',
				},
			}),
		).rejects.toThrow(/use body type/);
		// A JSON body goes through the json mode, which sends an object.
		respond('ok', 200, 'text/plain');
		await invoke(Fetch.fetchPost, {
			url: 'https://httpbin.io/anything',
			body: { type: 'json', value: { id: 1 } },
		});
		expect(lastRequest().body).toEqual({ id: 1 });
	});

	it('rejects a body type it cannot relay', async () => {
		await expect(
			invoke(Fetch.fetchPost, {
				url: 'https://httpbin.io/anything',
				body: { type: 'text', value: 'x' },
			}),
		).rejects.toThrow();
	});
});

describe('crawl.start', () => {
	it('POSTs the crawl body with snake_case fields and returns the running crawl', async () => {
		respond(crawlStarted, 202);

		const result = (await invoke(Crawls.start, {
			url: 'https://www.scrapingcourse.com/ecommerce/',
			maxPages: 10,
			maxItems: 100,
			depth: 2,
			includePatterns: ['/product/'],
			excludePatterns: ['/cart/'],
			outputFormat: 'html',
			idempotencyKey: 'crawl-1',
		})) as { crawl_id: string; status: string };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/crawls');
		expect(sent.headers.get('idempotency-key')).toBe('crawl-1');
		expect(sent.body).toEqual({
			url: 'https://www.scrapingcourse.com/ecommerce/',
			depth: 2,
			max_items: 100,
			max_pages: 10,
			include_patterns: ['/product/'],
			exclude_patterns: ['/cart/'],
			output_format: 'html',
		});
		expect(result.crawl_id).toBe(crawlStarted.crawl_id);
		expect(result.status).toBe('running');
	});

	it('nests the webhook as Zenrows expects it', async () => {
		respond(crawlStarted, 202);

		await invoke(Crawls.start, {
			url: 'https://example.com',
			webhookUrl: 'https://hooks.example.com/zenrows',
			webhookEvents: ['crawl.completed'],
			webhookMetadata: { site: 'example' },
		});

		const sent = lastRequest().body as {
			webhook: {
				url: string;
				events: string[];
				metadata: Record<string, string>;
			};
		};
		expect(sent.webhook).toEqual({
			url: 'https://hooks.example.com/zenrows',
			events: ['crawl.completed'],
			metadata: { site: 'example' },
		});
	});

	it('rejects out-of-range limits, a non-https webhook and an unparsable url', async () => {
		await expect(
			invoke(Crawls.start, { url: 'https://example.com', maxPages: 0 }),
		).rejects.toThrow();
		await expect(
			invoke(Crawls.start, {
				url: 'https://example.com',
				webhookUrl: 'http://hooks.example.com/x',
			}),
		).rejects.toThrow(/https/);
		await expect(invoke(Crawls.start, { url: 'example.com' })).rejects.toThrow(
			/http or https/,
		);
	});
});

describe('crawl.list', () => {
	it('GETs /v1/crawls with the cursor and limit, then reports the next cursor', async () => {
		respond({ crawls: [crawlSummary], next_cursor: 'cur_2' });

		const result = (await invoke(Crawls.list, {
			cursor: 'cur_1',
			limit: 50,
		})) as ReturnType<typeof Outputs.crawlList.parse>;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/crawls');
		expect(sent.query).toEqual({ cursor: 'cur_1', limit: '50' });
		expect(result.crawls).toHaveLength(1);
		expect(result.next_cursor).toBe('cur_2');
	});

	it('accepts a last page with no next_cursor at all', async () => {
		respond({ crawls: [crawlSummary] });

		const result = (await invoke(Crawls.list, {})) as {
			next_cursor?: string | null;
		};

		expect(result.next_cursor).toBeUndefined();
	});
});

describe('crawl.get', () => {
	it('GETs one crawl with its results and cursor', async () => {
		respond(crawlPage);

		const result = (await invoke(Crawls.get, {
			crawlId: crawlPage.crawl_id,
			cursor: 'cur_1',
			limit: 5,
		})) as ReturnType<typeof Outputs.crawlGet.parse>;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe(`/v1/crawls/${crawlPage.crawl_id}`);
		expect(sent.query).toEqual({ cursor: 'cur_1', limit: '5' });
		expect(result.results).toHaveLength(1);
		expect(result.next_cursor).toBeNull();
	});

	it('encodes the crawl id in the path', async () => {
		respond(crawlPage);

		await invoke(Crawls.get, { crawlId: 'c_1/../2' });

		expect(lastRequest().path).toBe('/v1/crawls/c_1%2F..%2F2');
	});
});

describe('crawl.getContent', () => {
	it('GETs one page as text, taking the ids as separate segments', async () => {
		respond('<html>cart</html>', 200, 'text/html');

		const result = (await invoke(Crawls.getContent, {
			crawlId: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
			contentId: 'ct_43c2cdbac1508bc68fe4d9788c11caf3',
			download: true,
		})) as { body: string };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe(
			'/v1/crawls/c_01M72F709NDF8XFBYKBXRZ3QFA/contents/ct_43c2cdbac1508bc68fe4d9788c11caf3',
		);
		expect(sent.query).toEqual({ download: 'true' });
		expect(result.body).toBe('<html>cart</html>');
	});
});

describe('crawl.stop', () => {
	it('POSTs to the stop action with no body and returns the stop state', async () => {
		respond({
			crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
			status: 'completed',
			stop_reason: 'max_pages',
			finished_at: '2026-11-10T10:14:20.445560976Z',
		});

		const result = (await invoke(Crawls.stop, {
			crawlId: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
		})) as { status: string; stop_reason?: string | null };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/crawls/c_01M72F709NDF8XFBYKBXRZ3QFA/stop');
		expect(sent.rawBody).toBeUndefined();
		expect(result.status).toBe('completed');
		expect(result.stop_reason).toBe('max_pages');
	});
});

describe('extract.domains', () => {
	it('GETs the served domains with their verticals', async () => {
		respond({ domains: [extractServedDomain] });

		const result = (await invoke(Extract.domains)) as {
			domains: { domain: string }[];
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/extract/domains');
		expect(result.domains[0]?.domain).toBe('scrapingcourse.com');
	});
});

describe('extract.prepareDomain', () => {
	it('POSTs the domain and its example URLs, returning the preparation', async () => {
		respond(extractPreparation, 202);

		const result = (await invoke(Extract.prepareDomain, {
			domain: 'scrapingcourse.com',
			exampleUrls: [
				'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie/',
			],
			idempotencyKey: 'prep-1',
		})) as { domain: string; status: string };

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/extract/prepared-domains');
		expect(sent.headers.get('idempotency-key')).toBe('prep-1');
		expect(sent.body).toEqual({
			domain: 'scrapingcourse.com',
			example_urls: [
				'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie/',
			],
		});
		expect(result.domain).toBe('scrapingcourse.com');
		expect(result.status).toBe('preparing');
	});

	it('rejects a scheme in the domain and more than five example URLs', async () => {
		await expect(
			invoke(Extract.prepareDomain, { domain: 'https://example.com' }),
		).rejects.toThrow(/bare domain/);
		await expect(
			invoke(Extract.prepareDomain, {
				domain: 'example.com',
				exampleUrls: Array.from(
					{ length: 6 },
					(_value, index) => `https://example.com/${index}`,
				),
			}),
		).rejects.toThrow();
	});
});

describe('extract.getDomainStatus', () => {
	it('GETs one domain preparation', async () => {
		respond(extractPreparation);

		const result = (await invoke(Extract.getDomainStatus, {
			domain: 'scrapingcourse.com',
		})) as ReturnType<typeof Outputs.extractGetDomainStatus.parse>;

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/v1/extract/prepared-domains/scrapingcourse.com',
		);
		expect(result.domain).toBe('scrapingcourse.com');
		expect(result.roles).toBeDefined();
	});
});

describe('extract.listPreparedDomains', () => {
	it('GETs this account submissions with the allowance', async () => {
		respond({ allowance: extractAllowance, domains: [extractPreparation] });

		const result = (await invoke(Extract.listPreparedDomains)) as ReturnType<
			typeof Outputs.extractListPreparedDomains.parse
		>;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/extract/prepared-domains');
		expect(result.domains).toHaveLength(1);
		expect(result.allowance?.remaining).toBe(10);
	});
});

describe('extract.allowance', () => {
	it('GETs the monthly preparation allowance', async () => {
		respond(extractAllowance);

		const result = (await invoke(Extract.allowance)) as {
			used: number;
			limit: number;
			month: string;
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/extract/prepared-domains/allowance');
		expect(result).toEqual(extractAllowance);
	});
});

describe('account.subscription', () => {
	it('GETs the plan behind the key', async () => {
		respond(subscriptionDetails);

		const result = (await invoke(Extract.subscription)) as {
			status: string;
			plan?: { name?: string | null };
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/subscriptions/self/details');
		expect(result.status).toBe('TRIALING');
		expect(result.plan?.name).toBe('Free');
	});
});

describe('logging', () => {
	it('logs an event per call with the operation name and no page content', async () => {
		respond(textPage.markdown, 200, 'text/plain');

		await invoke(Fetch.fetchPage, {
			url: 'https://example.com',
			responseType: 'markdown',
		});

		expect(mockLog).toHaveBeenCalledTimes(1);
		// unknown: jest types a mock call as an array of `unknown` arguments, so
		// each position is narrowed here to what this plugin's logger receives.
		const [, event, payload] = mockLog.mock.calls[0] as [
			unknown,
			string,
			Record<string, unknown>,
		];
		expect(event).toBe('zenrows.fetch.page');
		expect(payload).toEqual({
			responseType: 'markdown',
			bytes: textPage.markdown.length,
			jsRender: undefined,
			premiumProxy: undefined,
			mode: undefined,
		});
		// The URL is never logged: with customHeaders the key rides in the query.
		expect(JSON.stringify(payload)).not.toContain('example.com');
	});
});
