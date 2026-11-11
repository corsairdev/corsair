import { logEventFromContext } from 'corsair/core';
import {
	emCampaignsCreate,
	emCampaignsList,
	emCampaignsUpdate,
	emEventsCreate,
	emEventsList,
	templatesCreate,
	templatesDelete,
	templatesGet,
	templatesList,
	templatesMerge,
	templatesUpdate,
	textMessageTemplatesCreate,
	textMessageTemplatesDelete,
	textMessageTemplatesGet,
	textMessageTemplatesList,
	textMessageTemplatesMerge,
	textMessageTemplatesUpdate,
} from './marketing';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'fub-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what call() reads: ctx.key and the
	// systemName/systemKey identification options, which stay unset so the
	// X-System header falls back to 'corsair'.
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function lastUrl() {
	const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return url;
}

// FUB authenticates with the API key as the Basic username and an empty
// password, and identifies the calling system with X-System.
function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.followupboss.com');
	expect(sent.path).toMatch(/^\/v1\//);
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
	expect(sent.headers.get('x-system')).toBe('corsair');
	expect(sent.headers.get('x-system-key')).toBeNull();
}

const metadata = {
	collection: 'templates',
	offset: 0,
	limit: 10,
	total: 5,
};

const template = {
	id: 6,
	created: '2014-02-28T08:45:46Z',
	updated: '2014-08-12T17:24:22Z',
	createdById: 14,
	updatedById: 14,
	name: 'I am here to help',
	isMobile: 1,
	isShared: true,
	body: 'Hi %contact_first_name%, I am here to help, ...',
	subject: 'Your property inquiry from Zillow',
	isEditable: true,
	isDeletable: true,
	actionPlans: [{ id: 1, name: 'Buyers engagement emails' }],
};

const textMessageTemplate = {
	id: 110,
	name: 'Agent > Client + Lender intro',
	totalSent: 1,
	totalReplies: 1,
	message:
		"%lender_first_name% - %contact_first_name% is a client of mine who's going to be buying a property shortly.",
	isShared: true,
	createdBy: -1,
	isEditable: true,
	isDeletable: true,
	isShareable: false,
	sentPeopleIds: [34663],
	actionPlans: [],
};

const emCampaign = {
	id: 102,
	origin: 'Curaytor',
	originId: '912',
	name: 'Can I help',
	subject: 'Can I help?',
	bodyHtml: "I saw you're browsing our website, can I help with...",
};

const emEvent = {
	count: 2,
	type: 'open',
	personId: 10911,
	campaignId: 102,
	campaignName: 'Can I help',
	created: '2017-01-03T19:20:49Z',
	updated: '2017-01-03T19:20:49Z',
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('templates', () => {
	it('list keeps every template and the _metadata block', async () => {
		respond({ templates: [template], _metadata: metadata });

		const result = await invoke(templatesList, { limit: 10 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/templates',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({ limit: '10' });
		expect(result).toEqual({ templates: [template], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.templates.list',
			{ count: 1 },
			'completed',
		);
	});

	it('create POSTs the required content fields and unwraps the 201 answer', async () => {
		const created = { ...template, id: 526, isShareable: true, categories: [] };
		respond(created, 201);

		const result = await invoke(templatesCreate, {
			name: 'Beach House promo',
			subject: 'Check out this beach house!',
			body: '%greeting_time%, %contact_first_name%<br><br>Check out: https://example.com',
			isShared: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/templates',
			body: {
				name: 'Beach House promo',
				subject: 'Check out this beach house!',
				body: '%greeting_time%, %contact_first_name%<br><br>Check out: https://example.com',
				isShared: true,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(created);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.templates.create',
			{ templateId: 526 },
			'completed',
		);
	});

	it('get fills the merge fields through the mergePersonId query', async () => {
		respond({ templates: [template] });

		const result = await invoke(templatesGet, { id: 6, mergePersonId: 950 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/templates/6',
		});
		expect(lastRequest().query).toEqual({ mergePersonId: '950' });
		expect(result).toEqual(template);
	});

	it('update PUTs the full replacement body without the id', async () => {
		const updated = {
			id: 845,
			name: 'Beach House promo',
			subject: 'Check out this beach house!',
			body: '%greeting_time%, %contact_first_name%<br><br>Check out: https://example.com',
			isShared: true,
		};
		respond(updated);

		const result = await invoke(templatesUpdate, {
			id: 845,
			name: 'Beach House promo',
			subject: 'Check out this beach house!',
			body: '%greeting_time%, %contact_first_name%<br><br>Check out: https://example.com',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/templates/845',
			body: {
				name: 'Beach House promo',
				subject: 'Check out this beach house!',
				body: '%greeting_time%, %contact_first_name%<br><br>Check out: https://example.com',
			},
		});
		expect(result).toEqual(updated);
	});

	it('delete keeps the empty resource FUB echoes in the 200 body', async () => {
		respond({});

		const result = await invoke(templatesDelete, { id: 845 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/templates/845',
			body: undefined,
		});
		// The spec answers 200 with an empty `{}` JSON body.
		expect(result).toEqual({ id: 845, resource: {} });
	});

	it('merge POSTs the template, person and recipients and answers the merged template', async () => {
		respond(template);

		const input = {
			templateId: 31,
			mergePersonId: 1213,
			recipients: {
				to: [
					{ name: 'Bob Alvarez', email: 'bob@example.com' },
					{ name: 'Alice Alvarez', email: 'alice@example.com' },
					{ email: 'other@example.com' },
				],
			},
		};

		const result = await invoke(templatesMerge, input);

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/templates/merge',
			body: input,
		});
		expect(result).toEqual(template);
	});
});

describe('textMessageTemplates', () => {
	it('list unwraps the lowercase textmessagetemplates envelope', async () => {
		const textMetadata = { collection: 'textmessagetemplates', total: 24 };
		respond({
			textmessagetemplates: [textMessageTemplate],
			_metadata: textMetadata,
		});

		const result = await invoke(textMessageTemplatesList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/textMessageTemplates',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		// The path is camelCase but the collection key is lowercase.
		expect(result).toEqual({
			textmessagetemplates: [textMessageTemplate],
			_metadata: textMetadata,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.textMessageTemplates.list',
			{ count: 1 },
			'completed',
		);
	});

	it('create POSTs the single-slash path the published OAS doubles', async () => {
		const created = { ...textMessageTemplate, id: 182, createdBy: 15 };
		const body = {
			name: 'Beach House promo',
			message:
				'%greeting_time%, %contact_first_name%\nCheck out this beach house: https://example.com',
			isShared: true,
		};
		respond(created, 200);

		const result = await invoke(textMessageTemplatesCreate, body);

		// The published OAS paths this operation '//textMessageTemplates' with a
		// doubled slash; the request must use the sibling GET's single slash.
		expect(lastUrl()).toBe(
			'https://api.followupboss.com/v1/textMessageTemplates',
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/textMessageTemplates',
			body,
		});
		expect(result).toEqual(created);
	});

	it('get unwraps the single-template envelope', async () => {
		respond({ textmessagetemplates: [textMessageTemplate] });

		const result = await invoke(textMessageTemplatesGet, { id: 110 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/textMessageTemplates/110',
		});
		expect(result).toEqual(textMessageTemplate);
	});

	it('update PUTs the required name and message without the id', async () => {
		const updated = {
			...textMessageTemplate,
			id: 182,
			name: 'Buyer tour',
			message: '%contact_first_name%, are you free this week?',
		};
		respond(updated);

		const result = await invoke(textMessageTemplatesUpdate, {
			id: 182,
			name: 'Buyer tour',
			message: '%contact_first_name%, are you free this week?',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/textMessageTemplates/182',
			body: {
				name: 'Buyer tour',
				message: '%contact_first_name%, are you free this week?',
			},
		});
		expect(result).toEqual(updated);
	});

	it('delete keeps the empty resource FUB echoes in the 200 body', async () => {
		respond({});

		const result = await invoke(textMessageTemplatesDelete, { id: 182 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/textMessageTemplates/182',
		});
		// The spec answers 200 with an empty `{}` JSON body.
		expect(result).toEqual({ id: 182, resource: {} });
	});

	it('merge POSTs the template, person and phone recipients', async () => {
		const merged = { mergedTemplate: 'Hey Bob, Alice and Carol...' };
		respond(merged);

		const input = {
			templateId: 31,
			personId: 1213,
			recipients: {
				to: [
					{ name: 'Bob Alvarez', phone: '+14075558075' },
					{ phone: '+14075556097' },
				],
			},
		};

		const result = await invoke(textMessageTemplatesMerge, input);

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/textMessageTemplates/merge',
			body: input,
		});
		expect(result).toEqual(merged);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.textMessageTemplates.merge',
			{ templateId: 31 },
			'completed',
		);
	});
});

describe('emCampaigns', () => {
	it('list filters by origin and originId', async () => {
		respond({ emCampaigns: [emCampaign], _metadata: metadata });

		const result = await invoke(emCampaignsList, {
			origin: 'Curaytor',
			originId: '912',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/emCampaigns',
		});
		expect(lastRequest().query).toEqual({
			origin: 'Curaytor',
			originId: '912',
		});
		expect(result).toEqual({ emCampaigns: [emCampaign], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.emCampaigns.list',
			{ count: 1 },
			'completed',
		);
	});

	it('create POSTs the campaign fields and keeps the 200 answer', async () => {
		respond(emCampaign, 200);

		const result = await invoke(emCampaignsCreate, {
			origin: 'Curaytor',
			originId: '912',
			name: 'Can I help',
			subject: 'Can I help?',
			bodyHtml: "I saw you're browsing our website, can I help with...",
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/emCampaigns',
			body: {
				origin: 'Curaytor',
				originId: '912',
				name: 'Can I help',
				subject: 'Can I help?',
				bodyHtml: "I saw you're browsing our website, can I help with...",
			},
		});
		expect(result).toEqual(emCampaign);
	});

	it('update PUTs the fields without the id', async () => {
		const updated = {
			...emCampaign,
			name: 'How can I help',
			subject: 'How can I help?',
			bodyHtml: "I saw you're browsing our website, how can I help with...",
		};
		respond(updated);

		const result = await invoke(emCampaignsUpdate, {
			id: 102,
			name: 'How can I help',
			subject: 'How can I help?',
			bodyHtml: "I saw you're browsing our website, how can I help with...",
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/emCampaigns/102',
			body: {
				name: 'How can I help',
				subject: 'How can I help?',
				bodyHtml: "I saw you're browsing our website, how can I help with...",
			},
		});
		expect(result).toEqual(updated);
	});
});

describe('emEvents', () => {
	it('list filters by type, person and updatedAfter', async () => {
		const emMetadata = { collection: 'emEvents', total: 102938 };
		respond({ emEvents: [emEvent], _metadata: emMetadata });

		const result = await invoke(emEventsList, {
			type: 'open',
			personId: 10911,
			updatedAfter: '2017-01-01T00:00:00Z',
			limit: 10,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/emEvents',
		});
		expect(lastRequest().query).toEqual({
			type: 'open',
			personId: '10911',
			updatedAfter: '2017-01-01T00:00:00Z',
			limit: '10',
		});
		expect(result).toEqual({ emEvents: [emEvent], _metadata: emMetadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.emEvents.list',
			{ count: 1 },
			'completed',
		);
	});

	it('create POSTs the event batch and answers the id lists', async () => {
		const result_ = {
			emEventIds: [193928, 193929],
			recipientsNotFound: ['email.not.in.fub@example.com'],
		};
		respond(result_);

		const input = {
			emEvents: [
				{
					type: 'delivered',
					occurred: '2017-04-09T16:10:59Z',
					recipient: 'john.smith@gmail.com',
					personId: 1,
					campaignId: 141,
					userId: 3,
				},
			],
		};

		const result = await invoke(emEventsCreate, input);

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/emEvents',
			body: input,
		});
		expect(result).toEqual(result_);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.emEvents.create',
			{ count: 2 },
			'completed',
		);
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed. emCampaigns.create
	// and emEvents.create stay valid with `{}`: the spec publishes both bodies
	// without required fields.
	const emptyInputs: [string, AnyEndpoint][] = [
		['templates.get', templatesGet],
		['templates.create', templatesCreate],
		['templates.update', templatesUpdate],
		['templates.delete', templatesDelete],
		['templates.merge', templatesMerge],
		['textMessageTemplates.get', textMessageTemplatesGet],
		['textMessageTemplates.create', textMessageTemplatesCreate],
		['textMessageTemplates.update', textMessageTemplatesUpdate],
		['textMessageTemplates.delete', textMessageTemplatesDelete],
		['textMessageTemplates.merge', textMessageTemplatesMerge],
		['emCampaigns.update', emCampaignsUpdate],
	];

	it.each(emptyInputs)(
		'rejects an empty input to %s with a ZodError',
		async (_operation, endpoint) => {
			await expect(invoke(endpoint, {})).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);
});
