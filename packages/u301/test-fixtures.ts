/**
 * Response bodies for the tests, from https://u301.com/docs/ and the live API at
 * https://api.u301.com/v3.
 */

import { composeU301Key } from './client';

/** The two credentials every call needs, packed the way the plugin expects. */
export const API_KEY = 'u301-test-key';
export const WORKSPACE_ID = 'ws_test_123';
export const COMPOSITE_KEY = composeU301Key(API_KEY, WORKSPACE_ID);

/** A create answer, straight from the docs' `response-example.json`. */
export const LINK_CREATED = {
	id: '019a7d8c-4a85-7aa4-9862-ee2008f54854',
	url: 'https://example.com',
	slug: 'jtyZ',
	isCustomSlug: false,
	domain: 'u301.co',
	isReused: false,
	shortLink: 'u301.co/jtyZ',
	comment: '',
};

/** `reuseExisting` matched, so no allowance slot was spent. */
export const LINK_REUSED = {
	...LINK_CREATED,
	isReused: true,
};

/** What the bulk route actually answers: an array, even for one link. */
export const LINK_CREATED_ARRAY = [LINK_CREATED];

export const LINK = {
	id: '019a7d8c-4a85-7aa4-9862-ee2008f54854',
	domainName: 'u301.co',
	slug: 'jtyZ',
	isCustomSlug: false,
	shortUrl: 'https://u301.co/jtyZ',
	originalUrl: 'https://example.com',
	allowSearchEngineIndexing: false,
	archived: false,
	suspended: false,
	statsClicks: 42,
	expiresAt: null,
	userId: 'user_1',
	workspaceId: WORKSPACE_ID,
	comment: '',
	createdAt: '2026-05-01T10:00:00.000Z',
	updatedAt: '2026-05-01T10:00:00.000Z',
};

export const LINKS = {
	links: [LINK, { ...LINK, slug: 'abc123', statsClicks: 0 }],
};

export const LINK_DELETED = { message: 'success' };

export const DOMAINS = [
	{
		domain: 'u301.co',
		randomCodeLength: 6,
		isPrimary: true,
		isGlobal: true,
	},
	{
		domain: 'go.example.com',
		randomCodeLength: 5,
		isPrimary: false,
		isGlobal: false,
	},
];

export const DOMAIN_CREATED = { success: true };

export const DOMAIN_DETAIL = {
	domain: 'go.example.com',
	isValid: true,
	isArchived: false,
	lastCheckedAt: '2026-05-01T10:00:00.000Z',
	randomCodeLength: 5,
	workspaceId: WORKSPACE_ID,
	homePageRedirectUrl: 'https://example.com',
	notFoundPageRedirectUrl: 'https://example.com/404',
	createdAt: '2026-04-01T10:00:00.000Z',
	updatedAt: '2026-05-01T10:00:00.000Z',
	isPrimary: false,
};

/** The field is spelled `actived` by the API, which the model keeps. */
export const DOMAIN_ACTIVE = { actived: true, message: 'Domain is active' };

export const DOMAIN_NOT_READY = {
	actived: false,
	message: 'Challenge not ready',
};

export const CLICKS = {
	start: '2026-05-01T00:00:00.000Z',
	end: '2026-05-08T00:00:00.000Z',
	data: [
		{ date: '2026-05-01', clicks: 12 },
		{ date: '2026-05-02', clicks: 30 },
		{ date: '2026-05-03', clicks: 8 },
	],
};

export const AUDIENCE = [
	{ name: 'United States', clicks: 210 },
	{ name: 'Germany', clicks: 44 },
];

// Live: a wrong key, and every route answers it the same way.
export const UNAUTHORIZED = { message: 'Unauthorized' };

// Live: no key at all, which answers an empty message.
export const NO_KEY = { message: '' };

export const NOT_FOUND = { message: 'Short link not found' };

export const BAD_REQUEST = {
	message: 'Validation failed',
	code: 'VALIDATION_FAILED',
	errors: [{ field: 'url', message: 'url must be a valid URL' }],
	requestId: 'req_123',
};

export const QUOTA = {
	message: 'Monthly link allowance exceeded',
	code: 'RATE_LIMITED',
};

export const SERVER_ERROR = { message: 'Internal server error' };
