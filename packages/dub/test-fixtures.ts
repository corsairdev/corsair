// Response bodies built from the shapes in https://dub.co/openapi.json and the
// docs examples, with made-up links and companies. They were not captured from
// the live API: every authenticated probe answers 401 without a key.

export const errorEnvelope = (code: string, message: string) => ({
	error: {
		code,
		message,
		doc_url: `https://dub.co/docs/api-reference/errors#${code}`,
	},
});

export const unauthorized = errorEnvelope(
	'unauthorized',
	'Missing Authorization header.',
);

export const rateLimited = errorEnvelope(
	'rate_limit_exceeded',
	'Too many requests. Please retry later.',
);

export const notFound = errorEnvelope(
	'not_found',
	'The resource you are looking for does not exist.',
);

export const tag = {
	id: 'tag_1KAP4C9G2F',
	name: 'Announcement',
	color: 'red',
};

export const linkTag = {
	id: 'tag_1KAP4C9G2F',
	name: 'Announcement',
	color: 'red',
};

export const link = {
	id: 'link_1KAP4CQ4Y1',
	domain: 'dub.sh',
	key: 'try',
	url: 'https://dub.co',
	trackConversion: false,
	externalId: null,
	tenantId: null,
	programId: null,
	partnerId: null,
	archived: false,
	expiresAt: null,
	expiredUrl: null,
	disabledAt: null,
	password: null,
	proxy: false,
	title: null,
	description: null,
	image: null,
	video: null,
	rewrite: false,
	doIndex: false,
	ios: null,
	android: null,
	geo: null,
	publicStats: false,
	tags: [linkTag],
	folderId: null,
	comments: null,
	shortLink: 'https://dub.sh/try',
	qrCode: 'https://api.dub.co/qr?url=https://dub.sh/try',
	utm_source: null,
	utm_medium: null,
	utm_campaign: null,
	utm_term: null,
	utm_content: null,
	testStartedAt: null,
	testCompletedAt: null,
	userId: 'user_1KAP4C',
	workspaceId: 'ws_1KAP4C',
	clicks: 0,
	leads: 0,
	conversions: 0,
	sales: 0,
	saleAmount: 0,
	lastClicked: null,
	createdAt: '2026-11-01T00:00:00.000Z',
	updatedAt: '2026-11-01T00:00:00.000Z',
	projectId: 'ws_1KAP4C',
};

/** A per-link failure row in the bulkCreate answer. */
export const linkError = {
	link: { url: 'https://not-a-domain.example', key: 'taken' },
	error: 'A link with this externalId already exists.',
	code: 'conflict',
};

export const customer = {
	id: 'cus_1KAP4CXQ2W',
	externalId: 'ext_123456',
	name: 'Jordan Lee',
	email: 'jordan@acme-logistics.example',
	avatar: 'https://example.test/avatar.png',
	stripeCustomerId: null,
	country: 'US',
	sales: 0,
	saleAmount: 0,
	createdAt: '2026-11-01T00:00:00.000Z',
	firstSaleAt: null,
	subscriptionCanceledAt: null,
	link: null,
	programId: null,
	partner: null,
	discount: null,
};

export const folder = {
	id: 'fold_1KAP4CZF3T',
	name: 'Campaigns',
	description: null,
	type: 'default',
	accessLevel: 'write',
	createdAt: '2026-11-01T00:00:00.000Z',
	updatedAt: '2026-11-01T00:00:00.000Z',
};

export const domain = {
	id: 'dom_1KAP4CD1E2',
	slug: 'acme.link',
	verified: true,
	primary: false,
	archived: false,
	placeholder: null,
	expiredUrl: null,
	notFoundUrl: null,
	logo: null,
	assetLinks: null,
	appleAppSiteAssociation: null,
	createdAt: '2026-11-01T00:00:00.000Z',
	updatedAt: '2026-11-01T00:00:00.000Z',
	registeredDomain: null,
};

export const clickEvent = {
	event: 'click',
	timestamp: '2026-11-20T10:00:00.000Z',
	click: {
		id: 'click_1KAP4CD1E2',
		timestamp: '2026-11-20T10:00:00.000Z',
		url: 'https://dub.co',
		country: 'US',
		city: 'Austin',
		region: 'TX',
		continent: 'NA',
		device: 'Desktop',
		browser: 'Chrome',
		os: 'Mac OS X',
		referer: '(direct)',
		refererUrl: '(none)',
		qr: false,
		ip: '10.0.0.1',
	},
	link: {
		...link,
	},
	click_id: 'click_1KAP4CD1E2',
	link_id: 'link_1KAP4CQ4Y1',
	domain: 'dub.sh',
	key: 'try',
};

export const leadEvent = {
	event: 'lead',
	timestamp: '2026-11-20T10:05:00.000Z',
	eventId: 'lead_1KAP4CD1E2',
	eventName: 'Sign up',
	metadata: {},
	click: clickEvent.click,
	link: { ...link },
	customer: {
		id: 'cus_1KAP4CXQ2W',
		name: 'Jordan Lee',
		email: 'jordan@acme-logistics.example',
		avatar: null,
		externalId: 'ext_123456',
		createdAt: '2026-11-20T10:05:00.000Z',
	},
};

export const saleEvent = {
	event: 'sale',
	timestamp: '2026-11-21T09:00:00.000Z',
	eventId: 'sale_1KAP4CD1E2',
	eventName: 'Invoice paid',
	sale: {
		amount: 4900,
		invoiceId: 'inv_1KAP4CD1E2',
		paymentProcessor: 'stripe',
		currency: 'usd',
	},
	saleAmount: 4900,
	invoice_id: 'inv_1KAP4CD1E2',
	payment_processor: 'stripe',
	customer: leadEvent.customer,
};

export const trackLeadResponse = {
	click: { id: 'click_1KAP4CD1E2' },
	link: {
		id: 'link_1KAP4CQ4Y1',
		domain: 'dub.sh',
		key: 'try',
		shortLink: 'https://dub.sh/try',
		url: 'https://dub.co',
		partnerId: null,
		programId: null,
		tenantId: null,
		externalId: null,
	},
	customer: {
		name: 'Jordan Lee',
		email: 'jordan@acme-logistics.example',
		avatar: null,
		externalId: 'ext_123456',
	},
};

export const trackSaleResponse = {
	eventName: 'Invoice paid',
	customer: {
		id: 'cus_1KAP4CXQ2W',
		name: 'Jordan Lee',
		email: 'jordan@acme-logistics.example',
		avatar: null,
		externalId: 'ext_123456',
	},
	sale: {
		amount: 4900,
		currency: 'usd',
		paymentProcessor: 'stripe',
		invoiceId: 'inv_1KAP4CD1E2',
		metadata: null,
	},
};

export const svgDocument =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33"><rect width="33" height="33" fill="#ffffff"/><path d="M0 0h7v7H0z" fill="#000000"/></svg>';
