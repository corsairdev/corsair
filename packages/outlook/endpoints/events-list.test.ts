import { listEvents } from './events';
import { OutlookEndpointInputSchemas } from './types';

jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

const asked: { url: URL; headers: Headers }[] = [];
const originalFetch = global.fetch;

beforeEach(() => {
	global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
		const url = new URL(input instanceof Request ? input.url : String(input));
		asked.push({ url, headers: new Headers(init?.headers) });
		return Response.json({ value: [] });
	}) as typeof fetch;
});

afterEach(() => {
	global.fetch = originalFetch;
	asked.length = 0;
});

// unknown: the endpoint reads only ctx.key and ctx.db here.
const ctx = { key: 'test-token', db: {} } as any;

describe('outlook events.list', () => {
	it('sends timezone as the Prefer header, not a query parameter', async () => {
		await listEvents(ctx, { timezone: 'Pacific Standard Time' });
		expect(asked[0]?.headers.get('Prefer')).toBe(
			'outlook.timezone="Pacific Standard Time"',
		);
		expect(asked[0]?.url.searchParams.has('Prefer')).toBe(false);
	});

	it('expands recurring events through calendarView over the window', async () => {
		await listEvents(ctx, {
			expand_recurring_events: true,
			start_datetime: '2025-06-01T00:00:00Z',
			end_datetime: '2025-06-30T00:00:00Z',
			top: 50,
		});
		const { url } = asked[0] ?? {};
		expect(url?.pathname).toBe('/v1.0/me/calendarView');
		expect(url?.searchParams.get('startDateTime')).toBe('2025-06-01T00:00:00Z');
		expect(url?.searchParams.get('endDateTime')).toBe('2025-06-30T00:00:00Z');
		expect(url?.searchParams.get('$top')).toBe('50');
	});

	it('uses the calendar path with calendarView for a named calendar', async () => {
		await listEvents(ctx, {
			expand_recurring_events: true,
			calendar_id: 'cal1',
			start_datetime: '2025-06-01T00:00:00Z',
			end_datetime: '2025-06-30T00:00:00Z',
		});
		expect(asked[0]?.url.pathname).toBe('/v1.0/me/calendars/cal1/calendarView');
	});

	it('rejects expansion without a window', async () => {
		await expect(
			listEvents(ctx, { expand_recurring_events: true }),
		).rejects.toThrow(/start_datetime and end_datetime/);
		expect(asked).toHaveLength(0);
	});

	it.each([
		['a quote', 'UTC", X-Evil: 1'],
		['a line feed', 'UTC\nX-Evil: 1'],
		['a carriage return', 'UTC\rX-Evil: 1'],
	])('rejects a timezone with %s before any request', async (_n, timezone) => {
		expect(
			OutlookEndpointInputSchemas.eventsList.safeParse({ timezone }).success,
		).toBe(false);
		await expect(listEvents(ctx, { timezone })).rejects.toThrow();
		expect(asked).toHaveLength(0);
	});

	it.each(['Pacific Standard Time', 'America/Los_Angeles', 'UTC'])(
		'accepts the timezone %s',
		(timezone) => {
			expect(
				OutlookEndpointInputSchemas.eventsList.safeParse({ timezone }).success,
			).toBe(true);
		},
	);

	it('keeps the client headers when it adds Prefer', async () => {
		await listEvents(ctx, { timezone: 'UTC' });
		expect(asked[0]?.headers.get('Authorization')).toBe('Bearer test-token');
		expect(asked[0]?.headers.get('Content-Type')).toContain('application/json');
	});

	it('still lists /events when not expanding', async () => {
		await listEvents(ctx, { top: 5 });
		expect(asked[0]?.url.pathname).toBe('/v1.0/me/events');
	});

	it('drops $select from calendarView when it names createdDateTime', async () => {
		await listEvents(ctx, {
			expand_recurring_events: true,
			start_datetime: '2025-06-01T00:00:00Z',
			end_datetime: '2025-06-30T00:00:00Z',
			select: ['id', 'createdDateTime'],
		});
		expect(asked[0]?.url.searchParams.has('$select')).toBe(false);
	});

	it('keeps an ordinary $select on calendarView and on events', async () => {
		await listEvents(ctx, {
			expand_recurring_events: true,
			start_datetime: '2025-06-01T00:00:00Z',
			end_datetime: '2025-06-30T00:00:00Z',
			select: ['id', 'subject'],
		});
		await listEvents(ctx, { select: ['id', 'createdDateTime'] });
		expect(asked[0]?.url.searchParams.get('$select')).toBe('id,subject');
		expect(asked[1]?.url.searchParams.get('$select')).toBe(
			'id,createdDateTime',
		);
	});
});
