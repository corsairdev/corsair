import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { EchtpostContext } from './context';
import * as Ops from './endpoints/ops';
import { echtpost } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function ctx(db?: EchtpostContext['db']): EchtpostContext {
	// unknown: the endpoints read only `key` and `db` from the context.
	return { key: 'ep_test_key', db } as unknown as EchtpostContext;
}

function sent() {
	const [config, options] = mockRequest.mock.calls[0] ?? [];
	return {
		apiKey: (config?.HEADERS as Record<string, string>)['X-Api-Key'],
		method: options?.method,
		url: options?.url,
		query: options?.query,
		body: options?.body,
		mediaType: options?.mediaType,
	};
}

// Bodies from the OpenAPI examples (https://api.echtpost.de/v2/openapi.json).
const CONTACT = {
	id: 101,
	account_id: 1,
	first_name: 'Max',
	last_name: 'Mustermann',
	greeting_style: 'formal',
	greeting: 'Hallo Herr Mustermann',
	company_name: null,
	street: 'Hauptstr. 1',
	zip: '10115',
	city: 'Berlin',
	state_code: null,
	country_code: 'DE',
	birthdate: null,
	external_id: null,
	created_at: '2026-01-01T10:00:00Z',
	updated_at: '2026-01-01T10:00:00Z',
};
const GROUP = {
	id: 7,
	name: 'Kunden',
	external_id: null,
	recipient_count: 3,
	created_at: '2026-01-01T10:00:00Z',
	updated_at: '2026-01-01T10:00:00Z',
};
const CARD = {
	id: '0b9e3c1e-2a4f-4b8a-9f00-1c2d3e4f5a6b',
	account_id: 1,
	user_id: 2,
	motive_id: 42,
	template_id: null,
	status: 'scheduled',
	type: 'CardMulti',
	content: '{anrede}, frohe Ostern',
	content_ps: null,
	content_vertical: null,
	font: { family: 'architects_daughter', size: 13, color: 'black' },
	contacts_count: 2,
	deliver_at: '2026-11-18T00:00:00Z',
	qr_code_url: null,
	cancelable: true,
	web_url: 'https://my.echtpost.de/cards/x',
	created_at: '2026-11-17T10:00:00Z',
	updated_at: '2026-11-17T10:00:00Z',
};
const MOTIVE = {
	id: 42,
	name: 'Ostern',
	desc: null,
	orientation: 'landscape',
	highlight: false,
	content_available: true,
	content_ps_available: true,
	vertical_text_available: true,
	qr_code_available: false,
	has_back_side: false,
	url: null,
	preview_image_url: 'https://cdn.echtpost.de/m/42.jpg',
	back_side_image_url: null,
	tags: ['easter'],
	temporary: false,
};

beforeEach(() => {
	jest.clearAllMocks();
});

// [name, endpoint, input, method, url, query, body, response, expected]
// unknown: each row holds a different endpoint with its own input and JSON
// response, so the table is typed by the widest shape.
type Row = [
	string,
	(c: EchtpostContext, i: never) => Promise<unknown>,
	Record<string, unknown>,
	string,
	string,
	Record<string, string> | undefined,
	Record<string, unknown> | undefined,
	unknown,
	Record<string, unknown>,
];

const rows: Row[] = [
	[
		'account.get',
		Ops.accountGet,
		{},
		'GET',
		'/me',
		undefined,
		undefined,
		{
			account: { id: 1, name: 'Acme' },
			user: { id: 2, email: 'a@b.de' },
			api_key: { id: 3, last_used_on: null, created_at: 'x' },
			balance: {
				credits_eur: '12.50',
				cards_regular: 5,
				cards_foreign: 3,
				currency: 'EUR',
			},
		},
		{ balance: { credits_eur: '12.50' } },
	],
	[
		'account.credits',
		Ops.accountCredits,
		{},
		'GET',
		'/credits',
		undefined,
		undefined,
		{
			credits_eur: '12.50',
			cards_regular: 5,
			cards_foreign: 3,
			currency: 'EUR',
			price_per_card_eur: '2.50',
			price_per_foreign_card_eur: '3.50',
		},
		{ price_per_card_eur: '2.50' },
	],
	[
		'contacts.list',
		Ops.contactsList,
		{ page: 2, per_page: 50, group_id: 7, search: 'Muster', include: 'groups' },
		'GET',
		'/contacts',
		{
			page: '2',
			per_page: '50',
			group_id: '7',
			search: 'Muster',
			include: 'groups',
		},
		undefined,
		[CONTACT],
		{ contacts: [CONTACT] },
	],
	[
		'contacts.get',
		Ops.contactsGet,
		{ id: 101 },
		'GET',
		'/contacts/101',
		undefined,
		undefined,
		CONTACT,
		{ id: 101, city: 'Berlin' },
	],
	[
		'contacts.create',
		Ops.contactsCreate,
		{
			last_name: 'Mustermann',
			street: 'Hauptstr. 1',
			zip: '10115',
			city: 'Berlin',
			country_code: 'DE',
			group_names: ['Kunden'],
		},
		'POST',
		'/contacts',
		undefined,
		{
			last_name: 'Mustermann',
			street: 'Hauptstr. 1',
			zip: '10115',
			city: 'Berlin',
			country_code: 'DE',
			group_names: ['Kunden'],
		},
		CONTACT,
		{ id: 101 },
	],
	[
		'contacts.update',
		Ops.contactsUpdate,
		{ id: '101', city: 'Hamburg' },
		'PATCH',
		'/contacts/101',
		undefined,
		{ city: 'Hamburg' },
		{ ...CONTACT, city: 'Hamburg' },
		{ city: 'Hamburg' },
	],
	[
		'contacts.delete',
		Ops.contactsDelete,
		{ id: 101 },
		'DELETE',
		'/contacts/101',
		undefined,
		undefined,
		undefined,
		{ deleted: true, id: '101' },
	],
	[
		'groups.list',
		Ops.groupsList,
		{ sort: 'name', direction: 'asc' },
		'GET',
		'/groups',
		{ sort: 'name', direction: 'asc' },
		undefined,
		[GROUP],
		{ groups: [GROUP] },
	],
	[
		'groups.get',
		Ops.groupsGet,
		{ id: 7 },
		'GET',
		'/groups/7',
		undefined,
		undefined,
		GROUP,
		{ name: 'Kunden' },
	],
	[
		'groups.create',
		Ops.groupsCreate,
		{ name: 'Kunden' },
		'POST',
		'/groups',
		undefined,
		{ name: 'Kunden' },
		GROUP,
		{ id: 7 },
	],
	[
		'groups.update',
		Ops.groupsUpdate,
		{ id: 7, name: 'VIP' },
		'PATCH',
		'/groups/7',
		undefined,
		{ name: 'VIP' },
		{ ...GROUP, name: 'VIP' },
		{ name: 'VIP' },
	],
	[
		'groups.delete',
		Ops.groupsDelete,
		{ id: 7 },
		'DELETE',
		'/groups/7',
		undefined,
		undefined,
		undefined,
		{ deleted: true, id: '7' },
	],
	[
		'templates.get',
		Ops.templatesGet,
		{ id: 12 },
		'GET',
		'/templates/12',
		undefined,
		undefined,
		{
			id: 12,
			motive_id: 42,
			content: 'Hallo',
			content_ps: null,
			content_vertical: null,
			font: { family: 'reenie_beanie', size: 16 },
			qr_code_url: null,
			preview_url: null,
			source: 'regular',
			created_at: 'x',
			updated_at: 'y',
		},
		{ id: 12, source: 'regular' },
	],
	[
		'motives.list',
		Ops.motivesList,
		{ temporary: false, search: 'Ostern' },
		'GET',
		'/motives',
		{ temporary: 'false', search: 'Ostern' },
		undefined,
		[MOTIVE],
		{ motives: [MOTIVE] },
	],
	[
		'motives.get',
		Ops.motivesGet,
		{ id: '42' },
		'GET',
		'/motives/42',
		undefined,
		undefined,
		MOTIVE,
		{ content_available: true },
	],
	[
		'cards.list',
		Ops.cardsList,
		{ status: 'scheduled', per_page: 10 },
		'GET',
		'/cards',
		{ status: 'scheduled', per_page: '10' },
		undefined,
		[CARD],
		{ cards: [CARD] },
	],
	[
		'cards.get',
		Ops.cardsGet,
		{ id: CARD.id },
		'GET',
		`/cards/${CARD.id}`,
		undefined,
		undefined,
		CARD,
		{ status: 'scheduled' },
	],
	[
		'cards.create',
		Ops.cardsCreate,
		{
			motive_id: 42,
			content: '{anrede}, frohe Ostern',
			recipient_ids: [101, 102],
			deliver_at: 'tomorrow',
			font: { family: 'architects_daughter', size: 13, color: 'black' },
		},
		'POST',
		'/cards',
		undefined,
		{
			motive_id: 42,
			content: '{anrede}, frohe Ostern',
			recipient_ids: [101, 102],
			deliver_at: 'tomorrow',
			font: { family: 'architects_daughter', size: 13, color: 'black' },
		},
		CARD,
		{ id: CARD.id, contacts_count: 2 },
	],
	[
		'cards.createFromTemplate',
		Ops.cardsCreateFromTemplate,
		{ template_id: 12, group_ids: [7] },
		'POST',
		'/cards/from_template',
		undefined,
		{ template_id: 12, group_ids: [7] },
		{ ...CARD, template_id: 12 },
		{ template_id: 12 },
	],
	[
		'cards.previewFit',
		Ops.cardsPreviewFit,
		{ content: 'Hallo', font: { family: 'special_elite', size: 12 } },
		'POST',
		'/cards/preview_fit',
		undefined,
		{ content: 'Hallo', font: { family: 'special_elite', size: 12 } },
		{
			fits: true,
			lines_used: 1,
			max_lines: 12,
			overflow_line: null,
			suggested_font_size: null,
		},
		{ fits: true },
	],
	[
		'cards.cancel',
		Ops.cardsCancel,
		{ id: CARD.id },
		'DELETE',
		`/cards/${CARD.id}`,
		undefined,
		undefined,
		{ id: CARD.id, status: 'canceled', cancelable: false },
		{ status: 'canceled' },
	],
];

describe.each(rows)(
	'%s',
	(_name, endpoint, input, method, url, query, body, response, expected) => {
		it('sends the documented request and parses the documented response', async () => {
			mockRequest.mockResolvedValueOnce(response);
			const result = await endpoint(ctx(), input as never);
			const call = sent();
			expect(call.apiKey).toBe('ep_test_key');
			expect(call.method).toBe(method);
			expect(call.url).toBe(url);
			expect(call.query).toEqual(query);
			expect(call.body).toEqual(body);
			if (body) expect(call.mediaType).toBe('application/json');
			expect(result).toMatchObject(expected);
		});
	},
);

describe('safety', () => {
	it('encodes path ids so a value cannot change the route', async () => {
		mockRequest.mockResolvedValueOnce(CARD);
		await Ops.cardsGet(ctx(), { id: '../contacts' });
		expect(sent().url).toBe('/cards/..%2Fcontacts');
	});

	it('rejects a non-numeric contact id before sending', async () => {
		await expect(
			Ops.contactsGet(ctx(), { id: 'abc' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('drops the request body (names, addresses) from a failed call', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/contacts', body: { last_name: 'Mustermann' } },
			{
				url: 'https://api.echtpost.de/v2/contacts',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: {
					type: 'https://api.echtpost.de/problems/validation',
					title: 'Invalid',
				},
			},
			'Invalid',
		);
		mockRequest.mockRejectedValueOnce(error);
		const caught = await Ops.contactsCreate(ctx(), {
			last_name: 'Mustermann',
			street: 'x',
			zip: '1',
			city: 'y',
			country_code: 'DE',
		}).catch(
			// unknown: a promise can reject with any value; checked below.
			(e: unknown) => e,
		);
		expect(caught).toBe(error);
		expect(JSON.stringify((caught as ApiError).request)).not.toContain(
			'Mustermann',
		);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('drops contact filters from a failed list call', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/contacts', query: { last_name: 'Mustermann' } },
			{
				url: 'https://api.echtpost.de/v2/contacts?last_name=Mustermann',
				ok: false,
				status: 503,
				statusText: 'Service Unavailable',
				body: {},
			},
			'Service Unavailable',
		);
		mockRequest.mockRejectedValueOnce(error);
		const caught = await Ops.contactsList(ctx(), {
			last_name: 'Mustermann',
		}).catch(
			// unknown: a promise can reject with any value; checked below.
			(e: unknown) => e,
		);
		expect(caught).toBe(error);
		expect((caught as ApiError).status).toBe(503);
		expect(
			JSON.stringify({
				url: (caught as ApiError).url,
				request: (caught as ApiError).request,
			}),
		).not.toContain('Mustermann');
	});

	it('logs ids only, not names or addresses', async () => {
		mockRequest.mockResolvedValueOnce(CONTACT);
		await Ops.contactsGet(ctx(), { id: 101 });
		expect(JSON.stringify(mockLog.mock.calls[0])).not.toContain('Mustermann');
	});

	it('fails a list call that does not answer an array', async () => {
		mockRequest.mockResolvedValueOnce({ error: 'nope' });
		await expect(Ops.cardsList(ctx(), {})).rejects.toThrow('not an array');
	});

	it('stores a fetched template', async () => {
		const templates = { upsertByEntityId: jest.fn() };
		mockRequest.mockResolvedValueOnce({
			id: 12,
			motive_id: 42,
			content: 'Hallo',
			source: 'regular',
		});
		await Ops.templatesGet(
			// unknown: a fake table with only the method the endpoint calls.
			ctx({ templates } as unknown as EchtpostContext['db']),
			{ id: 12 },
		);
		expect(templates.upsertByEntityId).toHaveBeenCalledWith(
			'12',
			expect.objectContaining({ id: '12', motive_id: 42 }),
		);
	});

	it('keeps the font when templates.get saves a template', async () => {
		const templates = { upsertByEntityId: jest.fn() };
		mockRequest.mockResolvedValueOnce({
			id: 12,
			font: {
				family: 'reenie_beanie',
				size: 16,
				color: null,
				line_height: null,
			},
		});
		await Ops.templatesGet(
			// unknown: a fake table with only the method the endpoint calls.
			ctx({ templates } as unknown as EchtpostContext['db']),
			{ id: 12 },
		);
		expect(templates.upsertByEntityId.mock.calls[0]?.[1].font).toEqual({
			family: 'reenie_beanie',
			size: 16,
		});
	});
});

describe('risk levels', () => {
	it('marks sending, cancelling and deleting destructive', () => {
		const meta = echtpost().endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, m]) => m.riskLevel === 'destructive')
			.map(([k]) => k)
			.sort();
		expect(destructive).toEqual([
			'cards.cancel',
			'cards.create',
			'cards.createFromTemplate',
			'contacts.delete',
			'groups.delete',
		]);
	});
});
