jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { scrapingant } from './index';
import {
	EXTENDED_BODY,
	EXTRACT_BODY,
	HTML_BODY,
	MARKDOWN_BODY,
	USAGE_BODY,
} from './test-fixtures';
import {
	installFetchMock,
	makeCtx,
	respond,
	restoreFetchMock,
	sentQuery,
	sentUrl,
} from './test-helpers';

/**
 * The real endpoint tree, so each operation keeps its own input and output
 * types. The endpoint functions are invoked directly, which means a wrong query
 * selector shows up as a wrong URL rather than as a silently different result.
 */
function endpoints() {
	const tree = scrapingant({ key: 'sa-test-key' }).endpoints;
	if (!tree) throw new Error('the plugin registers no endpoints');
	return tree;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('scrape.html', () => {
	it('sends only the url when nothing else is asked for', async () => {
		respond(HTML_BODY, 200, {
			'Ant-page-status-code': '200',
			'Ant-credits-cost': '1',
		});

		const result = await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/',
		});

		expect(sentUrl().pathname).toBe('/v2/general');
		expect(sentQuery().get('url')).toBe('https://example.com/');
		// Only `url` is sent, so the provider's own defaults (browser on,
		// datacenter proxy, 60s) apply rather than being overwritten with an
		// empty value.
		expect([...sentQuery().keys()]).toEqual(['url']);
		expect(result.html).toBe(HTML_BODY);
		expect(result.page_status).toBe(200);
		expect(result.credits_cost).toBe(1);
	});

	it('sends every option it was given', async () => {
		respond(HTML_BODY);

		await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/product',
			browser: true,
			return_page_source: false,
			cookies: 'session=abc; theme=dark',
			js_snippet: 'd2luZG93LnNjcm9sbFRvKDAsMCk=',
			proxy_type: 'residential',
			proxy_country: 'DE',
			wait_for_selector: '#price',
			block_resource: ['image', 'media'],
			timeout: 45,
		});

		expect(sentQuery().get('browser')).toBe('true');
		expect(sentQuery().get('return_page_source')).toBe('false');
		expect(sentQuery().get('cookies')).toBe('session=abc; theme=dark');
		expect(sentQuery().get('js_snippet')).toBe('d2luZG93LnNjcm9sbFRvKDAsMCk=');
		expect(sentQuery().get('proxy_type')).toBe('residential');
		expect(sentQuery().get('proxy_country')).toBe('DE');
		expect(sentQuery().get('wait_for_selector')).toBe('#price');
		expect(sentQuery().getAll('block_resource')).toEqual(['image', 'media']);
		expect(sentQuery().get('timeout')).toBe('45');
	});

	it('reports a target page that answered 404 without failing the call', async () => {
		respond(HTML_BODY, 200, {
			'Ant-page-status-code': '404',
			'Ant-credits-cost': '1',
		});

		const result = await endpoints().scrape.html(makeCtx(), {
			url: 'https://example.com/missing',
		});

		expect(result.page_status).toBe(404);
	});
});

describe('scrape.markdown', () => {
	it('sends the url and returns the markdown with its cost', async () => {
		respond(MARKDOWN_BODY, 200, { 'Ant-credits-cost': '10' });

		const result = await endpoints().scrape.markdown(makeCtx(), {
			url: 'https://example.com/',
			browser: false,
		});

		expect(sentUrl().pathname).toBe('/v2/markdown');
		expect(sentQuery().get('url')).toBe('https://example.com/');
		expect(sentQuery().get('browser')).toBe('false');
		expect(result.url).toBe('https://example.com/');
		expect(result.markdown).toBe(MARKDOWN_BODY.markdown);
		expect(result.credits_cost).toBe(10);
	});

	it('sends the proxy and timeout options it was given', async () => {
		respond(MARKDOWN_BODY);

		await endpoints().scrape.markdown(makeCtx(), {
			url: 'https://example.com/',
			proxy_type: 'datacenter',
			proxy_country: 'GB',
			timeout: 15,
		});

		expect(sentQuery().get('proxy_type')).toBe('datacenter');
		expect(sentQuery().get('proxy_country')).toBe('GB');
		expect(sentQuery().get('timeout')).toBe('15');
	});
});

describe('scrape.extended', () => {
	it('sends the url and returns the whole JSON envelope', async () => {
		respond(EXTENDED_BODY, 200, { 'Ant-credits-cost': '10' });

		const result = await endpoints().scrape.extended(makeCtx(), {
			url: 'https://example.com/',
		});

		expect(sentUrl().pathname).toBe('/v2/extended');
		expect(sentQuery().get('url')).toBe('https://example.com/');
		expect(result.html).toBe(EXTENDED_BODY.html);
		expect(result.text).toBe(EXTENDED_BODY.text);
		expect(result.cookies).toBe(EXTENDED_BODY.cookies);
		expect(result.credits_cost).toBe(10);
	});

	it('keeps the target status code the envelope carries', async () => {
		respond({ ...EXTENDED_BODY, status_code: 403 });

		const result = await endpoints().scrape.extended(makeCtx(), {
			url: 'https://example.com/blocked',
		});

		expect(result.status_code).toBe(403);
	});

	it('sends the browser options it was given', async () => {
		respond(EXTENDED_BODY);

		await endpoints().scrape.extended(makeCtx(), {
			url: 'https://example.com/',
			browser: true,
			wait_for_selector: '.loaded',
			block_resource: ['font'],
		});

		expect(sentQuery().get('browser')).toBe('true');
		expect(sentQuery().get('wait_for_selector')).toBe('.loaded');
		expect(sentQuery().getAll('block_resource')).toEqual(['font']);
	});
});

describe('extract.data', () => {
	it('sends the url and the requested properties', async () => {
		respond(EXTRACT_BODY);

		const result = await endpoints().extract.data(makeCtx(), {
			url: 'https://example.com/',
			extract_properties: 'title, content',
		});

		expect(sentUrl().pathname).toBe('/v2/extract');
		expect(sentQuery().get('url')).toBe('https://example.com/');
		expect(sentQuery().get('extract_properties')).toBe('title, content');
		expect(result.title).toBe(EXTRACT_BODY.title);
		expect(result.content).toBe(EXTRACT_BODY.content);
	});

	it('sends the scrape options alongside the extraction request', async () => {
		respond(EXTRACT_BODY);

		await endpoints().extract.data(makeCtx(), {
			url: 'https://example.com/product',
			extract_properties: 'price(number)',
			browser: true,
			proxy_type: 'residential',
			proxy_country: 'US',
			timeout: 60,
		});

		expect(sentQuery().get('browser')).toBe('true');
		expect(sentQuery().get('proxy_type')).toBe('residential');
		expect(sentQuery().get('proxy_country')).toBe('US');
		expect(sentQuery().get('timeout')).toBe('60');
	});

	it('passes a property the model could not find through as null', async () => {
		respond({ title: 'Example Domain', price: null });

		const result = await endpoints().extract.data(makeCtx(), {
			url: 'https://example.com/',
			extract_properties: 'title, price',
		});

		expect(result.title).toBe('Example Domain');
		expect(result.price).toBeNull();
	});
});

describe('account.usage', () => {
	it('sends no query and returns the plan and credits', async () => {
		respond(USAGE_BODY);

		const result = await endpoints().account.usage(makeCtx(), {});

		expect(sentUrl().pathname).toBe('/v2/usage');
		expect([...sentQuery().keys()]).toEqual([]);
		expect(result.plan_name).toBe(USAGE_BODY.plan_name);
		expect(result.remained_credits).toBe(USAGE_BODY.remained_credits);
	});
});

describe('event log payloads', () => {
	// The logger is mocked at the top of this file, and the event table keeps
	// whatever it is given unless encryptDataAtRest is on.
	const loggedPayload = (): string => {
		const log = jest.requireMock('corsair/core').logEventFromContext;
		// unknown: jest types a mock's recorded arguments as unknown[], and the
		// third one is the payload this helper reads.
		const lastCall = log.mock.calls[log.mock.calls.length - 1] as [
			unknown,
			string,
			Record<string, unknown>,
		];
		return JSON.stringify(lastCall[2]);
	};

	it('logs a url without its query, so a signed link is not copied', async () => {
		respond(HTML_BODY);

		await endpoints().scrape.html(makeCtx(), {
			url: 'https://cdn.example.com/report.pdf?signature=supersecret',
		});

		const payload = loggedPayload();
		expect(payload).not.toContain('supersecret');
		expect(payload).toContain('cdn.example.com/report.pdf');
	});

	it('logs a url without embedded credentials', async () => {
		respond(MARKDOWN_BODY);

		await endpoints().scrape.markdown(makeCtx(), {
			url: 'https://user:hunter2@example.com/admin',
			browser: false,
		});

		expect(loggedPayload()).not.toContain('hunter2');
	});
});
