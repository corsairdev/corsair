import { makeRecallaiContextRequest } from './client';
import {
	CreateCalendarInputSchema,
	createCalendar,
	createCalendarAccessToken,
	deleteCalendar,
	ListCalendarsInputSchema,
	listCalendars,
	retrieveCalendar,
	updateCalendar,
} from './endpoints/calendars';
import { recallaiTestContext } from './test-context';

jest.mock('./client', () => ({
	makeRecallaiContextRequest: jest.fn(),
}));

const calendarId = '550e8400-e29b-41d4-a716-446655440000';
const calendar = {
	id: calendarId,
	metadata: { tenant: 'acme' },
	oauth_client_id: 'client-id',
	oauth_client_secret: null,
	oauth_refresh_token: 'refresh-token',
	platform: 'google_calendar',
	oauth_email: 'owner@example.com',
	platform_email: 'owner@example.com',
	status: 'connected',
	status_changes: [
		{
			status: 'connected',
			created_at: '2026-01-01T00:00:00Z',
			reason: 'Connected successfully',
		},
	],
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
};
const auth = { Authorization: 'Token recall-key' };

describe('Recall.ai Calendar V2 endpoints', () => {
	const request = jest.mocked(makeRecallaiContextRequest);
	const ctx = recallaiTestContext;

	beforeEach(() => request.mockReset());

	it('lists calendars with documented filters, Token auth, and validated page output', async () => {
		const page = { next: 'cursor-next', previous: null, results: [calendar] };
		request.mockResolvedValue(page);

		await expect(
			listCalendars(ctx, {
				created_at__gte: '2026-01-01T00:00:00Z',
				cursor: 'cursor-1',
				email: 'owner@example.com',
				platform: 'google_calendar',
				status: 'connected',
			}),
		).resolves.toEqual(page);
		expect(request).toHaveBeenCalledWith(ctx, '/api/v2/calendars/', {
			method: 'GET',
			query: {
				created_at__gte: '2026-01-01T00:00:00Z',
				cursor: 'cursor-1',
				email: 'owner@example.com',
				platform: 'google_calendar',
				status: 'connected',
			},
			headers: auth,
		});
	});

	it('creates a calendar with the required provider fields and validates its response', async () => {
		request.mockResolvedValue(calendar);
		const input = {
			oauth_client_id: 'client-id',
			oauth_client_secret: null,
			oauth_refresh_token: 'refresh-token',
			platform: 'google_calendar' as const,
			metadata: { tenant: 'acme' },
		};

		await expect(createCalendar(ctx, input)).resolves.toEqual(calendar);
		expect(request).toHaveBeenCalledWith(ctx, '/api/v2/calendars/', {
			method: 'POST',
			body: input,
			headers: auth,
		});
	});

	it('retrieves a calendar by UUID and validates the response contract', async () => {
		request.mockResolvedValue(calendar);

		await expect(retrieveCalendar(ctx, { id: calendarId })).resolves.toEqual(
			calendar,
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/calendars/${calendarId}/`,
			{ method: 'GET', headers: auth },
		);
	});

	it('partially updates a calendar with PATCH and the documented body fields', async () => {
		request.mockResolvedValue(calendar);
		const input = {
			id: calendarId,
			metadata: { tenant: 'updated' },
			oauth_client_private_key: 'private-key',
		};

		await expect(updateCalendar(ctx, input)).resolves.toEqual(calendar);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/calendars/${calendarId}/`,
			{
				method: 'PATCH',
				body: {
					metadata: { tenant: 'updated' },
					oauth_client_private_key: 'private-key',
				},
				headers: auth,
			},
		);
	});

	it('deletes a calendar with the documented 204 empty response', async () => {
		request.mockResolvedValue(undefined);

		await expect(
			deleteCalendar(ctx, { id: calendarId }),
		).resolves.toBeUndefined();
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/calendars/${calendarId}/`,
			{ method: 'DELETE', headers: auth },
		);
	});

	it('gets a calendar OAuth access token and validates token expiry', async () => {
		const token = {
			token: 'oauth-access-token',
			expires_at: '2026-01-01T01:00:00Z',
		};
		request.mockResolvedValue(token);

		await expect(
			createCalendarAccessToken(ctx, { id: calendarId }),
		).resolves.toEqual(token);
		expect(request).toHaveBeenCalledWith(
			ctx,
			`/api/v2/calendars/${calendarId}/access-token/`,
			{ method: 'POST', headers: auth },
		);
	});

	it('rejects missing and malformed identifiers before transport', async () => {
		await expect(
			retrieveCalendar(ctx, { id: '../calendar' }),
		).rejects.toThrow();
		await expect(deleteCalendar(ctx, { id: '' })).rejects.toThrow();
		await expect(
			createCalendarAccessToken(ctx, { id: 'not-a-uuid' }),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects invalid filters, deprecated fields, and malformed provider responses', async () => {
		expect(() =>
			ListCalendarsInputSchema.parse({ platform: 'unsupported' }),
		).toThrow();
		expect(() =>
			CreateCalendarInputSchema.parse({
				oauth_refresh_token: 'refresh-token',
				platform: 'google_calendar',
			}),
		).toThrow();
		await expect(
			CreateCalendarInputSchema.parseAsync({
				oauth_client_id: 'client-id',
				oauth_refresh_token: 'refresh-token',
				platform: 'google_calendar',
				webhook_url: 'https://example.com/deprecated',
			}),
		).rejects.toThrow();
		request.mockResolvedValue({ id: 'not-a-uuid' });
		await expect(retrieveCalendar(ctx, { id: calendarId })).rejects.toThrow();
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('keeps list filters optional and the API platform/status enums constrained', () => {
		expect(ListCalendarsInputSchema.parse({})).toEqual({});
		expect(() =>
			ListCalendarsInputSchema.parse({ status: 'pending' }),
		).toThrow();
	});
});
