import { ScrapingAntAPIError } from './client';
import type {
	AccountUsageResponse,
	ExtractDataResponse,
	ScrapeExtendedResponse,
	ScrapeHtmlResponse,
	ScrapeMarkdownResponse,
} from './endpoints/types';
import {
	ScrapingAntEndpointInputSchemas,
	ScrapingAntEndpointOutputSchemas,
} from './endpoints/types';
import { EXTENDED_BODY, USAGE_BODY } from './test-fixtures';

/**
 * The output schemas are what a caller's parsed result goes through, so they
 * are exercised directly: a field typed wrong here throws on a successful call,
 * after the credits have already been spent.
 */
const Outputs = ScrapingAntEndpointOutputSchemas;
const Inputs = ScrapingAntEndpointInputSchemas;

/**
 * Parses through one output schema. Non-object values are parsed directly with
 * `schema.parse` in the two tests that prove they are rejected, so this
 * signature cannot be used to quietly widen what a schema accepts.
 */
function parseAs<T>(schema: { parse: (value: object) => T }, value: object) {
	return schema.parse(value);
}

describe('scrape.html output', () => {
	it('parses a page with its status and cost', () => {
		const result = parseAs<ScrapeHtmlResponse>(Outputs.scrapeHtml, {
			html: '<html></html>',
			page_status: 200,
			credits_cost: 10,
		});
		expect(result.html).toBe('<html></html>');
		expect(result.page_status).toBe(200);
		expect(result.credits_cost).toBe(10);
	});

	it('accepts a missing header as null', () => {
		const result = parseAs<ScrapeHtmlResponse>(Outputs.scrapeHtml, {
			html: '<html></html>',
			page_status: null,
			credits_cost: null,
		});
		expect(result.page_status).toBeNull();
	});

	it('rejects an empty body, which is not a page', () => {
		expect(() =>
			parseAs(Outputs.scrapeHtml, { html: '', page_status: 200 }),
		).toThrow();
	});

	it('rejects a body that is not a string at all', () => {
		expect(() =>
			parseAs(Outputs.scrapeHtml, { html: { detail: 'oops' } }),
		).toThrow();
	});
});

describe('scrape.markdown output', () => {
	it('parses the url and markdown', () => {
		const result = parseAs<ScrapeMarkdownResponse>(Outputs.scrapeMarkdown, {
			url: 'https://example.com/',
			markdown: '# Title',
			credits_cost: 10,
		});
		expect(result.markdown).toBe('# Title');
	});

	it('accepts an empty markdown page, which a blank page produces', () => {
		const result = parseAs<ScrapeMarkdownResponse>(Outputs.scrapeMarkdown, {
			url: 'https://example.com/',
			markdown: '',
		});
		expect(result.markdown).toBe('');
	});

	it('rejects a payload missing the envelope field', () => {
		expect(() =>
			parseAs(Outputs.scrapeMarkdown, { markdown: '# Title' }),
		).toThrow();
	});
});

describe('scrape.extended output', () => {
	it('parses the whole envelope and keeps unknown fields', () => {
		const result = parseAs<ScrapeExtendedResponse>(Outputs.scrapeExtended, {
			...EXTENDED_BODY,
			credits_cost: 10,
			future_field: 'kept',
		});
		expect(result.status_code).toBe(200);
		expect(result.cookies).toBe('session=abc123; theme=dark');
		expect(result).toMatchObject({ future_field: 'kept' });
	});

	it('accepts absent xhrs and iframes, which no browser means no entry for', () => {
		const result = parseAs<ScrapeExtendedResponse>(Outputs.scrapeExtended, {
			html: '<html></html>',
			text: 'hi',
			cookies: '',
			status_code: 200,
			headers: [],
		});
		expect(result.xhrs).toBeUndefined();
		expect(result.iframes).toBeUndefined();
	});

	it('rejects a status_code sent as a string', () => {
		expect(() =>
			parseAs(Outputs.scrapeExtended, {
				...EXTENDED_BODY,
				status_code: '200',
			}),
		).toThrow();
	});
});

describe('extract.data output', () => {
	it('parses whatever properties the model returned', () => {
		const result = parseAs<ExtractDataResponse>(Outputs.extractData, {
			title: 'Example Domain',
			price: null,
			reviews: [{ reviewTitle: 'Fine' }],
		});
		expect(result.title).toBe('Example Domain');
		expect(result.price).toBeNull();
	});

	it('rejects a non-object answer', () => {
		// A body that arrived as a bare string is the wrong shape for an
		// extracted object, and the schema has to reject it rather than coerce.
		expect(() => Outputs.extractData.parse('not an object')).toThrow();
	});
});

describe('account.usage output', () => {
	it('parses the plan and credits', () => {
		const result = parseAs<AccountUsageResponse>(
			Outputs.accountUsage,
			USAGE_BODY,
		);
		expect(result.plan_name).toBe('Enthusiast');
		expect(result.remained_credits).toBe(96740);
	});

	it('rejects credits sent as a string', () => {
		expect(() =>
			parseAs(Outputs.accountUsage, {
				...USAGE_BODY,
				remained_credits: '96740',
			}),
		).toThrow();
	});

	it('rejects a missing plan name', () => {
		const { plan_name: _omitted, ...rest } = USAGE_BODY;
		expect(() => parseAs(Outputs.accountUsage, rest)).toThrow();
	});
});

describe('input validation', () => {
	const base = { url: 'https://example.com/' };

	it('rejects a non-http URL scheme', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ url: 'ftp://example.com/' }),
		).toThrow(/scheme/);
	});

	it('rejects a malformed URL with a ZodError, not a TypeError', () => {
		const result = Inputs.scrapeHtml.safeParse({ url: 'not a url' });
		expect(result.success).toBe(false);
		expect(() => Inputs.extractData.parse({ url: 'not a url' })).toThrow(
			expect.objectContaining({ name: 'ZodError' }),
		);
	});

	it('rejects a timeout outside the documented 5-60 seconds', () => {
		expect(() => Inputs.scrapeHtml.parse({ ...base, timeout: 4 })).toThrow();
		expect(() => Inputs.scrapeHtml.parse({ ...base, timeout: 61 })).toThrow();
		expect(Inputs.scrapeHtml.parse({ ...base, timeout: 5 })).toMatchObject({
			timeout: 5,
		});
		expect(Inputs.scrapeHtml.parse({ ...base, timeout: 60 })).toMatchObject({
			timeout: 60,
		});
	});

	it('rejects a timeout that is not a whole number of seconds', () => {
		expect(() => Inputs.scrapeHtml.parse({ ...base, timeout: 12.5 })).toThrow();
	});

	it('rejects an unknown proxy type', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, proxy_type: 'stealth' }),
		).toThrow();
	});

	it('rejects a proxy country that is not a two-letter code', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, proxy_country: 'USA' }),
		).toThrow(/two-letter/);
	});

	it('rejects a js_snippet that is not base64', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({
				...base,
				js_snippet: 'window.scrollTo(0, 0)',
			}),
		).toThrow(/base64/);
	});

	it('accepts a base64 js_snippet', () => {
		const parsed = Inputs.scrapeHtml.parse({
			...base,
			js_snippet: 'd2luZG93LnNjcm9sbFRvKDAsMCk=',
		});
		expect(parsed.js_snippet).toBe('d2luZG93LnNjcm9sbFRvKDAsMCk=');
	});

	it('rejects an unknown block_resource type', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, block_resource: ['images'] }),
		).toThrow();
	});

	it('rejects a browser-only option sent with browser: false', () => {
		const result = Inputs.scrapeHtml.safeParse({
			...base,
			browser: false,
			wait_for_selector: '#price',
		});
		expect(result.success).toBe(false);
		if (result.success) throw new Error('expected a rejection');
		expect(result.error.issues[0]?.path).toEqual(['wait_for_selector']);
	});

	it('rejects every browser-only option under browser: false', () => {
		for (const key of [
			'return_page_source',
			'js_snippet',
			'wait_for_selector',
			'block_resource',
		] as const) {
			const value =
				key === 'block_resource'
					? ['image']
					: key === 'js_snippet'
						? 'aGk='
						: key === 'wait_for_selector'
							? '#x'
							: true;
			const result = Inputs.scrapeHtml.safeParse({
				...base,
				browser: false,
				[key]: value,
			});
			expect({ key, success: result.success }).toEqual({
				key,
				success: false,
			});
		}
	});

	it('accepts a browser-only option when browser is unset or true', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({ ...base, wait_for_selector: '#price' }),
		).not.toThrow();
		expect(() =>
			Inputs.scrapeHtml.parse({
				...base,
				browser: true,
				wait_for_selector: '#price',
			}),
		).not.toThrow();
	});

	// Live 11-12: with return_page_source=true a js_snippet that marks the DOM
	// left no mark, at 2 credits instead of 10; the browser actions never ran.
	it('rejects js_snippet or wait_for_selector with return_page_source: true', () => {
		for (const [key, value] of [
			['js_snippet', 'aGk='],
			['wait_for_selector', '#x'],
		] as const) {
			const result = Inputs.scrapeHtml.safeParse({
				...base,
				return_page_source: true,
				[key]: value,
			});
			expect({ key, success: result.success }).toEqual({
				key,
				success: false,
			});
			if (!result.success) {
				expect(result.error.issues[0]?.path).toEqual([key]);
			}
		}
	});

	it('accepts js_snippet with return_page_source: false', () => {
		expect(() =>
			Inputs.scrapeHtml.parse({
				...base,
				return_page_source: false,
				js_snippet: 'aGk=',
			}),
		).not.toThrow();
	});

	it('rejects an empty extract_properties', () => {
		expect(() =>
			Inputs.extractData.parse({ ...base, extract_properties: '   ' }),
		).toThrow();
	});

	it('rejects an unknown url entirely', () => {
		expect(() => Inputs.scrapeHtml.parse({})).toThrow();
	});
});

describe('ScrapingAntAPIError', () => {
	it('reports an unreachable target from its exact detail', () => {
		const error = new ScrapingAntAPIError('x', {
			status: 404,
			detail: "This site can't be reached.",
		});
		expect(error.isTargetUnreachable).toBe(true);
	});

	it('does not read every 404 as an unreachable target', () => {
		const error = new ScrapingAntAPIError('x', {
			status: 404,
			detail: 'Not Found',
		});
		expect(error.isTargetUnreachable).toBe(false);
	});

	it('does not read a plain 409 as the free-plan concurrency limit', () => {
		const error = new ScrapingAntAPIError('x', {
			status: 409,
			detail: 'Something else conflicts',
		});
		expect(error.isConcurrencyLimit).toBe(false);
	});

	it('reads a 423 as bot detection', () => {
		expect(new ScrapingAntAPIError('x', { status: 423 }).isBotDetected).toBe(
			true,
		);
	});
});
