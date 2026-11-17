import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { getEvent, listEvents } from './endpoints/events';
import {
	getOrder,
	listOrders,
	listOrdersByPresentation,
} from './endpoints/orders';
import {
	checkInByQrCode,
	checkInByTicketNumber,
	checkInParticipant,
	getParticipant,
	getParticipantByTicketNumber,
	listParticipants,
	listParticipantsByOrder,
	listParticipantsByPresentation,
} from './endpoints/participants';
import { getPresentation, listPresentations } from './endpoints/presentations';
import type { SymplaContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: { upsert?: jest.Mock; find?: jest.Mock },
): SymplaContext {
	return {
		key,
		db: db
			? {
					events: {
						upsertByEntityId: db.upsert ?? jest.fn(),
						findByEntityId: db.find ?? jest.fn().mockResolvedValue(null),
					},
				}
			: undefined,
		// unknown: a partial test double of the plugin context.
	} as unknown as SymplaContext;
}

function lastCall() {
	return {
		config: mockRequest.mock.calls.at(-1)?.[0],
		options: mockRequest.mock.calls.at(-1)?.[1],
	};
}

// Shapes from Sympla's v1.6.0 reference examples.
const PAGE = {
	pagination: { next_cursor: 'c2', page_size: 100, quantity: 1 },
	sort: { field_sort: 'start_date', sort: 'asc' },
};
const EVENT = {
	id: 'abc123def456',
	reference_id: 0,
	name: 'Workshop',
	start_date: '2026-06-18T19:12:37Z',
	private_event: 1,
	published: 1,
	cancelled: 0,
	address: { city: 'Belo Horizonte', lat: 0.1, lon: 0.1 },
	host: { name: 'Host', description: 'x' },
	category_prim: { name: 'Cursos' },
	url: 'https://www.sympla.com.br/evento/x',
};
const PRESENTATION = {
	id: 12345,
	event_id: 'abc123def456',
	closed: false,
	enabled: true,
	private_presentation: false,
	published: true,
	start_date: '2026-06-18T19:12:37Z',
	sectors: [{ id: 1, name: 'Pista', has_online_sale_available: true }],
};
const ORDER = {
	id: 'ORD1',
	event_id: 'abc123def456',
	order_status: 'A',
	order_total_sale_price: 0.1,
	buyer_email: 'buyer@example.com',
	invoice_info: { name: 'x' },
	utm: { utm_source: 'x' },
	presentation_id: 0,
};
const PARTICIPANT = {
	id: '12345',
	event_id: 'abc123def456',
	order_id: 'ORD1',
	first_name: 'Ana',
	email: 'ana@example.com',
	ticket_number: '94461180000001',
	ticket_sale_price: 0.1,
	checkin: { date: '2026-06-18 19:12:37', id: 'x' },
	custom_form: { cpf: 'string' },
};
const CHECKED_IN = {
	data: {
		check_in: true,
		check_in_date: '2026-06-18T19:12:37Z',
		check_in_id: 9,
	},
};
const QR = {
	itemId: 'item-1',
	walletId: 'wallet-1',
	signature: 'a'.repeat(130),
	timestamp: 1698770407738,
	version: 1,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('wire format of every operation', () => {
	// unknown: one table holds every operation, each with its own input and reply shape.
	type Case = {
		name: string;
		run: (ctx: SymplaContext) => Promise<unknown>;
		reply: unknown;
		method: string;
		url: string;
		query?: Record<string, unknown>;
		body?: unknown;
		event: string;
		payload: Record<string, string>;
	};
	const E = '/public/v1.6.0/events/abc123def456';

	const cases: Case[] = [
		{
			name: 'events.list',
			run: (ctx) =>
				listEvents(ctx, {
					published: 'all',
					sort: 'desc',
					field_sort: 'name',
					page_size: 50,
					cursor: 'c1',
					fields: 'id,name',
				}),
			reply: { data: [EVENT], ...PAGE },
			method: 'GET',
			url: '/public/v1.6.0/events',
			query: {
				published: 'all',
				sort: 'desc',
				field_sort: 'name',
				page_size: 50,
				cursor: 'c1',
				fields: 'id,name',
			},
			event: 'sympla.events.list',
			payload: {},
		},
		{
			name: 'events.get',
			run: (ctx) =>
				getEvent(ctx, { event_id: 'abc123def456', timezone: 'UTC' }),
			reply: EVENT,
			method: 'GET',
			url: E,
			query: { timezone: 'UTC' },
			event: 'sympla.events.get',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'presentations.list',
			run: (ctx) =>
				listPresentations(ctx, {
					event_id: 'abc123def456',
					published: false,
					filter_online_sector: false,
				}),
			reply: { data: [PRESENTATION], ...PAGE },
			method: 'GET',
			url: `${E}/presentations`,
			query: { published: false, filter_online_sector: false },
			event: 'sympla.presentations.list',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'presentations.get',
			run: (ctx) =>
				getPresentation(ctx, {
					event_id: 'abc123def456',
					presentation_id: 12345,
				}),
			reply: PRESENTATION,
			method: 'GET',
			url: `${E}/presentations/12345`,
			query: {},
			event: 'sympla.presentations.get',
			payload: { event_id: 'abc123def456', presentation_id: '12345' },
		},
		{
			name: 'orders.list',
			run: (ctx) =>
				listOrders(ctx, {
					event_id: 'abc123def456',
					cancelled_filter: 'include',
					buyer_email: 'buyer@example.com',
					from: '2025-09-08T00:00:00',
				}),
			reply: { data: [ORDER], ...PAGE },
			method: 'GET',
			url: `${E}/orders`,
			query: {
				cancelled_filter: 'include',
				buyer_email: 'buyer@example.com',
				from: '2025-09-08T00:00:00',
			},
			event: 'sympla.orders.list',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'orders.listByPresentation',
			run: (ctx) =>
				listOrdersByPresentation(ctx, {
					event_id: 'abc123def456',
					presentation_id: '12345',
					page_size: 10,
				}),
			reply: { data: [ORDER], ...PAGE },
			method: 'GET',
			url: `${E}/presentations/12345/orders`,
			query: { page_size: 10 },
			event: 'sympla.orders.listByPresentation',
			payload: { event_id: 'abc123def456', presentation_id: '12345' },
		},
		{
			name: 'orders.get',
			run: (ctx) =>
				getOrder(ctx, { event_id: 'abc123def456', order_id: 'ORD1' }),
			reply: { data: ORDER },
			method: 'GET',
			url: `${E}/orders/ORD1`,
			query: {},
			event: 'sympla.orders.get',
			payload: { event_id: 'abc123def456', order_id: 'ORD1' },
		},
		{
			name: 'participants.list',
			run: (ctx) =>
				listParticipants(ctx, {
					event_id: 'abc123def456',
					participant_email: 'ana@example.com',
					field_sort: 'ticket_updated_at',
				}),
			reply: { data: [PARTICIPANT], ...PAGE },
			method: 'GET',
			url: `${E}/participants`,
			query: {
				participant_email: 'ana@example.com',
				field_sort: 'ticket_updated_at',
			},
			event: 'sympla.participants.list',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'participants.listByOrder',
			run: (ctx) =>
				listParticipantsByOrder(ctx, {
					event_id: 'abc123def456',
					order_id: 'ORD1',
					page_size: 500,
				}),
			reply: { data: [PARTICIPANT], ...PAGE },
			method: 'GET',
			url: `${E}/orders/ORD1/participants`,
			query: { page_size: 500 },
			event: 'sympla.participants.listByOrder',
			payload: { event_id: 'abc123def456', order_id: 'ORD1' },
		},
		{
			name: 'participants.listByPresentation',
			run: (ctx) =>
				listParticipantsByPresentation(ctx, {
					event_id: 'abc123def456',
					presentation_id: 12345,
				}),
			reply: { data: [PARTICIPANT], ...PAGE },
			method: 'GET',
			url: `${E}/presentations/12345/participants`,
			query: {},
			event: 'sympla.participants.listByPresentation',
			payload: { event_id: 'abc123def456', presentation_id: '12345' },
		},
		{
			name: 'participants.get',
			run: (ctx) =>
				getParticipant(ctx, {
					event_id: 'abc123def456',
					participant_id: 12345,
				}),
			reply: { data: PARTICIPANT },
			method: 'GET',
			url: `${E}/participants/12345`,
			query: {},
			event: 'sympla.participants.get',
			payload: { event_id: 'abc123def456', participant_id: '12345' },
		},
		{
			name: 'participants.getByTicketNumber',
			run: (ctx) =>
				getParticipantByTicketNumber(ctx, {
					event_id: 'abc123def456',
					ticket_number: '94461180000001',
				}),
			reply: { data: PARTICIPANT },
			method: 'GET',
			url: `${E}/participants/ticketNumber/94461180000001`,
			query: {},
			event: 'sympla.participants.getByTicketNumber',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'participants.checkIn',
			run: (ctx) =>
				checkInParticipant(ctx, {
					event_id: 'abc123def456',
					participant_id: '12345',
				}),
			reply: CHECKED_IN,
			method: 'POST',
			url: `${E}/participants/12345/check-in`,
			event: 'sympla.participants.checkIn',
			payload: { event_id: 'abc123def456', participant_id: '12345' },
		},
		{
			name: 'participants.checkInByTicketNumber',
			run: (ctx) =>
				checkInByTicketNumber(ctx, {
					event_id: 'abc123def456',
					ticket_number: '94461180000001',
				}),
			reply: CHECKED_IN,
			method: 'POST',
			url: `${E}/participants/ticketNumber/94461180000001/check-in`,
			event: 'sympla.participants.checkInByTicketNumber',
			payload: { event_id: 'abc123def456' },
		},
		{
			name: 'participants.checkInByQrCode',
			run: (ctx) => checkInByQrCode(ctx, { event_id: 'abc123def456', ...QR }),
			reply: CHECKED_IN,
			method: 'POST',
			url: `${E}/qrcode/check-in`,
			body: QR,
			event: 'sympla.participants.checkInByQrCode',
			payload: { event_id: 'abc123def456' },
		},
	];

	it.each(cases)('$name sends $method $url', async (c) => {
		mockRequest.mockResolvedValue(c.reply);
		const result = await c.run(context('test-key'));
		expect(result).toEqual(c.reply);
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.sympla.com.br');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({ s_token: 'test-key' });
		expect(options?.method).toBe(c.method);
		expect(options?.url).toBe(c.url);
		if (c.query !== undefined) {
			expect(options?.query).toEqual(c.query);
		}
		if (c.body === undefined) {
			expect(options?.body).toBeUndefined();
		} else {
			expect(options?.body).toEqual(c.body);
			expect(options?.mediaType).toBe('application/json');
		}
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			c.event,
			c.payload,
			'completed',
		);
		// Neither the key nor any email or ticket number goes into the event payload.
		const logged = JSON.stringify(mockLog.mock.calls.map((call) => call[2]));
		expect(logged).not.toMatch(/test-key|@|94461180000001/);
		// Core's own 429 retries stay on: no rate-limit override is passed.
		expect(mockRequest.mock.calls.at(-1)?.[2]).toBeUndefined();
	});

	it.each(cases)('$name throws AuthMissingError without a key', async (c) => {
		await expect(c.run(context(''))).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('inputs', () => {
	it('encodes ids so they cannot add path segments', async () => {
		mockRequest.mockResolvedValue({ data: ORDER });
		await getOrder(context('k'), { event_id: 'a/../b', order_id: 'c?d' });
		expect(lastCall().options?.url).toBe(
			'/public/v1.6.0/events/a%2F..%2Fb/orders/c%3Fd',
		);
	});

	it('rejects bad page sizes, emails and QR signatures before calling the API', async () => {
		await expect(
			listEvents(context('k'), { page_size: 201 }),
		).rejects.toThrow();
		await expect(
			listParticipants(context('k'), { event_id: 'e', page_size: 501 }),
		).rejects.toThrow();
		await expect(
			listOrders(context('k'), { event_id: 'e', buyer_email: 'nope' }),
		).rejects.toThrow();
		await expect(
			checkInByQrCode(context('k'), {
				event_id: 'e',
				...QR,
				signature: 'short',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends no query parameters the caller left out', async () => {
		mockRequest.mockResolvedValue({ data: [], ...PAGE });
		await listEvents(context('k'), {});
		expect(lastCall().options?.query).toEqual({});
	});
});

describe('responses', () => {
	it('rejects events whose id or name has the wrong type', async () => {
		mockRequest.mockResolvedValue({ data: [{ id: {}, name: 17 }], ...PAGE });
		await expect(listEvents(context('k'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a list reply without a data array', async () => {
		mockRequest.mockResolvedValue({ pagination: {} });
		await expect(listEvents(context('k'), {})).rejects.toThrow();
	});

	it('accepts an event wrapped in data, and a check-in list as an array', async () => {
		mockRequest.mockResolvedValue({ data: EVENT });
		await expect(
			getEvent(context('k'), { event_id: 'abc123def456' }),
		).resolves.toEqual({
			data: EVENT,
		});
		const reply = {
			data: [
				{ ...PARTICIPANT, custom_form: [{ id: 1, name: 'CPF', value: 'x' }] },
			],
			...PAGE,
		};
		mockRequest.mockResolvedValue(reply);
		await expect(
			listParticipants(context('k'), { event_id: 'e' }),
		).resolves.toEqual(reply);
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/public/v1.6.0/events' },
			{
				url: 'https://api.sympla.com.br/public/v1.6.0/events',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Unauthorized', message: 'Invalid Token!' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listEvents(context('k'), {})).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('stored events', () => {
	it('stores each event id and name', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			data: [EVENT, { id: 77, name: 'Numeric id' }],
			...PAGE,
		});
		await listEvents(context('test-key', { upsert }), {});
		expect(upsert).toHaveBeenCalledWith('abc123def456', {
			id: 'abc123def456',
			name: 'Workshop',
		});
		expect(upsert).toHaveBeenCalledWith('77', { id: '77', name: 'Numeric id' });
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('stores the event from events.get, bare or wrapped', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ data: EVENT });
		await getEvent(context('k', { upsert }), { event_id: 'abc123def456' });
		expect(upsert).toHaveBeenCalledWith('abc123def456', {
			id: 'abc123def456',
			name: 'Workshop',
		});
	});

	it('leaves a stored event alone when a narrow fields read has no name', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const find = jest
			.fn()
			.mockResolvedValue({ data: { id: 'abc123def456', name: 'Old' } });
		mockRequest.mockResolvedValue({ data: [{ id: 'abc123def456' }], ...PAGE });
		await listEvents(context('k', { upsert, find }), { fields: 'id' });
		expect(upsert).not.toHaveBeenCalled();
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		const reply = { data: [EVENT], ...PAGE };
		mockRequest.mockResolvedValue(reply);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(listEvents(context('k', { upsert }), {})).resolves.toEqual(
			reply,
		);
		warn.mockRestore();
	});
});
