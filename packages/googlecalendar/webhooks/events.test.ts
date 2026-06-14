import { makeCalendarRequest } from '../client';
import { onEventChanged } from './events';

jest.mock('../client', () => ({
	makeCalendarRequest: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockedMakeCalendarRequest = jest.mocked(makeCalendarRequest);

function pubSubPayload(data: Record<string, unknown>) {
	return {
		message: {
			data: Buffer.from(JSON.stringify(data)).toString('base64'),
		},
	};
}

function calendarEvent(id: string) {
	const now = new Date().toISOString();
	return {
		id,
		status: 'confirmed' as const,
		summary: `Event ${id}`,
		created: now,
		updated: now,
		start: { dateTime: now },
		end: { dateTime: now },
	};
}

function createCtx(overrides: Record<string, unknown> = {}) {
	return {
		key: 'token',
		keys: {
			get_calendar_sync_state: jest.fn().mockResolvedValue('{}'),
			set_calendar_sync_state: jest.fn().mockResolvedValue(undefined),
		},
		db: {
			events: {
				upsertByEntityId: jest
					.fn()
					.mockImplementation((id: string) =>
						Promise.resolve({ id: `db-${id}` }),
					),
				findIdByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
		...overrides,
	} as any;
}

describe('Google Calendar onEventChanged webhook sync tokens', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('processes a real change with no stored token instead of dropping it during bootstrap', async () => {
		const ctx = createCtx();
		mockedMakeCalendarRequest.mockResolvedValueOnce({
			items: [calendarEvent('event-1')],
			nextSyncToken: 'sync-1',
		});

		const result = await onEventChanged.handler(ctx, {
			payload: pubSubPayload({
				resourceUri: '/calendar/v3/calendars/primary/events',
				resourceState: 'exists',
			}),
		} as any);

		expect(result.success).toBe(true);
		expect(ctx.db.events.upsertByEntityId).toHaveBeenCalledWith(
			'event-1',
			expect.objectContaining({ id: 'event-1', calendarId: 'primary' }),
		);
		expect(ctx.keys.set_calendar_sync_state).toHaveBeenCalledWith(
			JSON.stringify({ primary: 'sync-1' }),
		);
	});

	it('does not advance the sync token when processing fails', async () => {
		const ctx = createCtx({
			keys: {
				get_calendar_sync_state: jest
					.fn()
					.mockResolvedValue(JSON.stringify({ primary: 'old-sync' })),
				set_calendar_sync_state: jest.fn().mockResolvedValue(undefined),
			},
		});
		ctx.db.events.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockedMakeCalendarRequest.mockResolvedValueOnce({
			items: [calendarEvent('event-1')],
			nextSyncToken: 'new-sync',
		});

		const result = await onEventChanged.handler(ctx, {
			payload: pubSubPayload({
				resourceUri: '/calendar/v3/calendars/primary/events',
				resourceState: 'exists',
			}),
		} as any);

		expect(result.success).toBe(false);
		expect(ctx.keys.set_calendar_sync_state).not.toHaveBeenCalled();
	});

	it('handles expired sync tokens reported via ApiError.status', async () => {
		const ctx = createCtx({
			keys: {
				get_calendar_sync_state: jest
					.fn()
					.mockResolvedValueOnce(JSON.stringify({ primary: 'expired-sync' }))
					.mockResolvedValueOnce(JSON.stringify({ primary: 'expired-sync' })),
				set_calendar_sync_state: jest.fn().mockResolvedValue(undefined),
			},
		});
		mockedMakeCalendarRequest
			.mockRejectedValueOnce(Object.assign(new Error('gone'), { status: 410 }))
			.mockResolvedValueOnce({
				items: [calendarEvent('event-1')],
				nextSyncToken: 'fresh-sync',
			});

		const result = await onEventChanged.handler(ctx, {
			payload: pubSubPayload({
				resourceUri: '/calendar/v3/calendars/primary/events',
				resourceState: 'exists',
			}),
		} as any);

		expect(result.success).toBe(true);
		expect(ctx.db.events.upsertByEntityId).toHaveBeenCalledWith(
			'event-1',
			expect.anything(),
		);
		expect(ctx.keys.set_calendar_sync_state).toHaveBeenNthCalledWith(
			1,
			JSON.stringify({}),
		);
		expect(ctx.keys.set_calendar_sync_state).toHaveBeenNthCalledWith(
			2,
			JSON.stringify({ primary: 'fresh-sync' }),
		);
	});
});
