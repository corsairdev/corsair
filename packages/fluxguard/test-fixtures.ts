/**
 * Fixtures whose SHAPES match the live Fluxguard API; every identifier is
 * synthetic. The ids use Fluxguard's own documented example values
 * (https://www.fluxguard.com/how-to-guides/use-our-api) and the signing secret
 * is a placeholder, so nothing here belongs to a real account.
 *
 * The shapes themselves are what the probes found, and each one differs from
 * the written docs:
 *
 * - `/account` answers epoch milliseconds for `created`, `lastTouch` and
 *   `lastFreeCredits`, a lowercase `status`, a numeric `plan`, and `flags` as a
 *   record of objects.
 * - `/site/{s}/session/{s}/page/{p}` answers ISO strings for `created` and
 *   arrays of category NAMES, not category objects.
 * - `/account/webhook` and `/account/webhook/sample` answer a bare array.
 * - `/account/category` answers an object keyed by category id with a `for`
 *   field, and `{}` when the account has none.
 */

export const accountResponse = {
	created: 1602357421519,
	credits: 200,
	id: '0123jdq6th8dc',
	lastFreeCredits: 1602357421519,
	lastTouch: 1602357421519,
	notifyGap: 1440,
	plan: 0,
	status: 'active',
	flags: {
		danger: { name: 'danger', color: '#f00', isDefault: true },
		warning: { name: 'warning', color: '#f7bc08', isDefault: true },
		serenity: { name: 'serenity', color: '#00f', isDefault: true },
		resolved: { name: 'resolved', color: '#20af00', isDefault: true },
	},
	siteCount: 0,
};

export const addPageResponse = {
	siteId: '0123jdq6th8dc',
	sessionId: '0123jdqze3cbg',
	pageId: '0123jdu8r4724',
};

/** As returned for a page with no categories. */
export const pageResponse = {
	orgId: '0123jdq6th8dc',
	created: '2020-10-10T19:18:19.685Z',
	status: 'active',
	url: 'https://example.org/',
	id: '0123jdu8r4724',
	versions: 0,
	versionsKept: 0,
	site: { id: '0123jdq6th8dc', origin: 'https://example.org' },
	session: {
		id: '0123jdqze3cbg',
		name: 'Monitoring example.org',
		comparisonType: 'text',
	},
	viewUrl:
		'https://app.fluxguard.com/site/0123jdq6th8dc/session/0123jdqze3cbg/page/0123jdu8r4724/',
	path: '/',
	siteCategories: [],
	pageCategories: [],
};

/** As returned for a page whose site belongs to one category. */
export const pageWithCategoryResponse = {
	status: 'active',
	id: '0123jdu8r4725',
	url: 'https://example.org/probe',
	created: '2020-10-10T19:18:19.685Z',
	orgId: '0123jdq6th8dc',
	versions: 0,
	versionsKept: 0,
	site: { id: '0123jdq6th8dd', origin: 'https://example.org' },
	session: {
		id: '0123jdqze3cbf',
		name: 'Monitoring example.org',
		comparisonType: 'text',
	},
	viewUrl:
		'https://app.fluxguard.com/site/0123jdq6th8dd/session/0123jdqze3cbf/page/0123jdu8r4725/',
	path: '/probe',
	siteCategories: ['News'],
	pageCategories: [],
};

/** A page that was deleted: Fluxguard keeps the row with status `ignore`. */
export const ignoredPageResponse = {
	status: 'ignore',
	created: '2020-10-10T19:18:19.685Z',
	versions: 0,
	orgId: '0123jdq6th8dc',
	id: '0123jdu8r4724',
	url: 'https://example.org/',
	versionsKept: 0,
	site: { id: '0123jdq6th8dc', origin: 'https://example.org' },
	session: {
		id: '0123jdqze3cbg',
		name: 'Monitoring example.org',
		comparisonType: 'text',
	},
	viewUrl:
		'https://app.fluxguard.com/site/0123jdq6th8dc/session/0123jdqze3cbg/page/0123jdu8r4724/',
	path: '/',
	siteCategories: [],
	pageCategories: [],
};

/** A placeholder in Fluxguard's signing-key shape; not a usable key. */
export const webhookSecret = 'whsec_test_placeholder_not_a_real_secret';

export const webhookListResponse = [
	{
		api: '2019-11-19',
		created: 1602357800000,
		id: '0123jdxabuzn2',
		secret: webhookSecret,
		url: 'https://example.org/hooks/fluxguard',
		siteCategories: [],
	},
];

export const webhookCreateResponse = { id: '0123jdxabuzn2' };

export const categoryListResponse = {
	'0123jdq6th0ab': {
		created: '2020-10-10T19:18:19.685Z',
		name: 'Probe',
		updated: '2020-10-10T19:18:19.685Z',
		for: 'site',
	},
};

export const categoryCreateResponse = {
	id: '0123jdq6th0ab',
	name: 'Probe',
	created: '2020-10-10T19:18:19.685Z',
};

/** One change, in the shape Fluxguard POSTs to a webhook. */
export const changeEvent = {
	url: 'https://example.org/news',
	capturedAt: '2020-10-10T19:18:19.685Z',
	comparisonType: 'text',
	orgId: '0c540649-53f7-478b-9e49-3c8801163010',
	site: {
		id: '0123jdq6th8dc',
		origin: 'https://example.org',
	},
	session: {
		id: '0123jdqze3cbg',
		name: 'Default Session',
	},
	page: {
		id: '0123jdu8r4724',
		path: '/news',
	},
	fileBaseUrl:
		'https://files.example.org/perm/0c540649-53f7-478b-9e49-3c8801163010/0123jdq6th8dc/0123jdqze3cbg/0123jdu8r4724/0123jdxabuzn2/1602357421519/',
	files: {
		captures: {
			html: 'compareTarget.html',
			visual: 'compareTarget.png',
			txt: 'compareTarget.txt',
			net: 'network.har',
			nlp: 'nlp.json',
		},
		diffs: {
			visual: 'compareTarget_diff.png',
			net: true,
			txt: 'mergedComparison.txt',
			html: 'mergedComparison.html',
		},
	},
	diffUrl:
		'https://app.fluxguard.com/site/0123jdq6th8dc/session/0123jdqze3cbg/page/0123jdu8r4724/txtview?actionId=0123jdxabuzn2&captureId=1602357421519&showDiff=true',
	siteCategories: [],
	pageCategories: [],
};

export const sampleResponse = [changeEvent];
