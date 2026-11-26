import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import {
	blogPostIndexNowUrls,
	INDEXNOW_ENDPOINT,
	INDEXNOW_KEY,
	INDEXNOW_KEY_LOCATION,
	INDEXNOW_MAX_URLS,
	indexNowPayload,
	indexNowUrls,
	sitemapLocs,
	submitToIndexNow,
} from './indexnow';

describe('IndexNow key', () => {
	it('is a valid key and public/<key>.txt holds exactly it', () => {
		assert.match(INDEXNOW_KEY, /^[a-zA-Z0-9-]{8,128}$/);
		const file = new URL(`../../public/${INDEXNOW_KEY}.txt`, import.meta.url);
		assert.equal(readFileSync(file, 'utf8'), INDEXNOW_KEY);
		assert.equal(
			INDEXNOW_KEY_LOCATION,
			`https://corsair.dev/${INDEXNOW_KEY}.txt`,
		);
	});
});

describe('indexNowUrls', () => {
	it('keeps https corsair.dev URLs only, without fragments or duplicates', () => {
		assert.deepEqual(
			indexNowUrls([
				'https://corsair.dev/blog/mcp-vs-api',
				'https://corsair.dev/blog/mcp-vs-api#faq',
				'http://corsair.dev/pricing',
				'https://docs.corsair.dev/',
				'https://www.corsair.dev/x',
				'not a url',
				' https://corsair.dev/pricing ',
			]),
			['https://corsair.dev/blog/mcp-vs-api', 'https://corsair.dev/pricing'],
		);
	});

	it('keeps every URL past the protocol limit, for the caller to batch', () => {
		const many = Array.from(
			{ length: INDEXNOW_MAX_URLS + 1 },
			(_, i) => `https://corsair.dev/p/${i}`,
		);
		assert.equal(indexNowUrls(many).length, INDEXNOW_MAX_URLS + 1);
	});
});

describe('indexNowPayload', () => {
	it('caps one request at the protocol limit', () => {
		const many = Array.from(
			{ length: INDEXNOW_MAX_URLS + 1 },
			(_, i) => `https://corsair.dev/p/${i}`,
		);
		assert.equal(indexNowPayload(many).urlList.length, INDEXNOW_MAX_URLS);
	});

	it('names the host, key and key location', () => {
		assert.deepEqual(indexNowPayload(['https://corsair.dev/']), {
			host: 'corsair.dev',
			key: INDEXNOW_KEY,
			keyLocation: INDEXNOW_KEY_LOCATION,
			urlList: ['https://corsair.dev/'],
		});
	});
});

describe('blogPostIndexNowUrls', () => {
	it('sends the post and the blog index', () => {
		assert.deepEqual(blogPostIndexNowUrls('claude-connectors'), [
			'https://corsair.dev/blog/claude-connectors',
			'https://corsair.dev/blog',
		]);
		assert.deepEqual(blogPostIndexNowUrls(undefined), [
			'https://corsair.dev/blog',
		]);
	});
});

describe('submitToIndexNow', () => {
	it('POSTs the payload as JSON and reports the status', async () => {
		const calls: Array<{ url: string; init?: RequestInit }> = [];
		const fakeFetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			return new Response(null, { status: 202 });
		}) as typeof fetch;

		const result = await submitToIndexNow(
			['https://corsair.dev/blog'],
			fakeFetch,
		);
		assert.deepEqual(result, { submitted: 1, status: 202 });
		assert.equal(calls.length, 1);
		assert.equal(calls[0].url, INDEXNOW_ENDPOINT);
		assert.equal(calls[0].init?.method, 'POST');
		assert.deepEqual(JSON.parse(String(calls[0].init?.body)).urlList, [
			'https://corsair.dev/blog',
		]);
	});

	it('sends nothing when no URL qualifies, and never throws', async () => {
		let called = false;
		const fakeFetch = (async () => {
			called = true;
			throw new Error('network down');
		}) as unknown as typeof fetch;

		assert.deepEqual(
			await submitToIndexNow(['https://example.com/'], fakeFetch),
			{
				submitted: 0,
				status: null,
			},
		);
		assert.equal(called, false);
		assert.deepEqual(
			await submitToIndexNow(['https://corsair.dev/'], fakeFetch),
			{
				submitted: 1,
				status: null,
			},
		);
	});
});

describe('sitemapLocs', () => {
	it('reads <loc> entries and unescapes XML entities', () => {
		const xml = `<?xml version="1.0"?><urlset>
<url><loc>https://corsair.dev</loc></url>
<url><loc> https://corsair.dev/a?x=1&amp;y=2 </loc><lastmod>2026-11-20</lastmod></url>
</urlset>`;
		assert.deepEqual(sitemapLocs(xml), [
			'https://corsair.dev',
			'https://corsair.dev/a?x=1&y=2',
		]);
	});

	it('decodes each reference once, so &amp;lt; stays a literal &lt;', () => {
		assert.deepEqual(sitemapLocs('<loc>https://corsair.dev/a&amp;lt;b</loc>'), [
			'https://corsair.dev/a&lt;b',
		]);
	});
});
