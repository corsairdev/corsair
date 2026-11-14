/**
 * Recorded from the live CustomJS API. These are the fields the responses
 * actually carried, not the examples in the docs, which disagree in several
 * places (see the comments on each entry).
 */

/** GET https://api.app.customjs.io/core/api-key/{key} */
export const authResponse = {
	workspaceId: '7fba00da-48f0-4f44-b7f3-50fec1d56aac',
	name: 'Default',
	maxRequestCount: 20,
	apiKeyData: {
		id: 'wcmnbsdiih',
		// Redacted: the live answer echoes the key back, which is exactly why the
		// output schema strips it.
		value: 'REDACTED',
	},
	apiKey: 'REDACTED',
	paddleSubscription: {},
	businessInformation: {},
	timestamp: 1794469247243,
	inActive: false,
	createdAt: 1794469247243,
	jwt: {
		sub: '1364d822-1081-7062-7113-181d4bd0a0f2',
		email: 'corsairtest00@gmail.com',
		email_verified: false,
		token_use: 'id',
	},
	utmSource: 'ahref_search.brave.com',
};

/**
 * POST https://e.customjs.io/pages/page/upload-html answers 201. Note `shortId`
 * and the missing `name`: the docs show a `created` flag and a `name` that the
 * live route never sends.
 */
export const pageCreated = {
	pageId: '76f8fd9c-3dcb-4598-83f4-3eee09a23529',
	shortId: 'LbYxXBeV',
	htmlFileUrl: 'https://lp.customjs.space/LbYxXBeV',
	message: 'HTML page uploaded successfully',
};

/** PUT .../update-html, a 200. */
export const pageUpdated = {
	pageId: '76f8fd9c-3dcb-4598-83f4-3eee09a23529',
	htmlFileUrl: 'https://lp.customjs.space/LbYxXBeV',
	name: 'corsair probe page',
	message: 'HTML page updated successfully',
};

/** GET /pages/api/page. The live route answers a bare array, not `{ pages }`. */
export const pageListed = {
	workspaceId: '7fba00da-48f0-4f44-b7f3-50fec1d56aac',
	pageId: '76f8fd9c-3dcb-4598-83f4-3eee09a23529',
	type: 'HTML',
	name: 'corsair probe page',
	htmlFileUrl: 'https://lp.customjs.space/LbYxXBeV',
	origin: 'corsair/probe',
	timestamp: 1794469314660,
	createdAt: 1794469314660,
	updatedAt: 1794469314660,
};

/** POST /ai-scraper in command mode. */
export const scrapeCommandResponse = {
	status: 'success',
	steps: 1,
	extractions: { heading: null },
	events: [
		{
			step: 1,
			type: 'action',
			action: 'extract',
			selector: 'h1',
			success: true,
		},
	],
	returnType: 'json',
	screenshots: [],
	sessionUrl:
		'https://customjs-runtime-pdf-production-tmp-pdf-storage.s3.eu-central-1.amazonaws.com/b4beb5de-954e-4f77-8f5b-3cd39d31d842/response.json',
};

/** POST /ai-scraper in agentic mode, from the docs; the live agent needs a paid run. */
export const scrapeAgentResponse = {
	status: 'success',
	steps: 4,
	events: [
		{
			step: 1,
			type: 'decision',
			action: 'navigate',
			url: 'https://shop.example.com/products',
		},
		{ step: 4, type: 'result' },
	],
	result: {
		data: 'Product A: $12.99, Product B: $8.49',
		format: 'ai_extract',
	},
	usage: {
		promptTokens: 4200,
		completionTokens: 80,
		totalTokens: 4280,
		estimatedCostUsd: 0.0011,
	},
	screenshots: [{ step: 1, url: 'https://s3.example.test/step-001.png' }],
	sessionUrl: 'https://s3.example.test/response.json',
};

/** The envelope a bad key gets on the render host, as a 403. */
export const invalidKey = { error: { message: 'Api Key is invalid' } };

/** The envelope an exhausted window gets, as a 403. The body is the only tell. */
export const tooManyRequests = { message: 'Too Many Requests' };

/** A script that throws answers text/plain with this body and a 500. */
export const scriptThrew = '{"error":"Error: boom from script"}';

/** The pages host uses a different envelope for the same condition. */
export const pagesInvalidKey = { error: 'Invalid API Key' };

/** A page id that does not exist. */
export const pageNotFound = { error: 'Page not found' };

/** What a route that does not exist answers: a 500 with an empty object. */
export const emptyFailure = {};
