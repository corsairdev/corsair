import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Attendees,
	Breaks,
	Content,
	Groups,
	Halls,
	Labels,
	Partners,
	Registrations,
	Reviews,
	Sessions,
	Speakers,
} from './endpoints';
import type { EventeeContext } from './index';
import { eventee, eventeeEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeEventeeRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeEventeeRequest);
const mockedLog = jest.mocked(logEventFromContext);
type Context = Parameters<typeof Content.get>[0];

function makeContext(): Context {
	const context: EventeeContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('event-test'),
		key: 'event-test-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('event-test-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const row = { id: 1 };
const invitation = {
	url: 'https://app.eventee.co/event/example',
	qr_code: 'https://files.eventee.co/qr/example.png',
};
const program = {
	halls: [],
	days: [],
	lectures: [],
	workshops: [],
	pauses: [],
	speakers: [],
	tracks: [],
};

const operationCases = [
	{
		id: 'content.get',
		invoke: (ctx: Context) =>
			Content.get(ctx, { date: '2024-06-01', with_overlapping: false }),
		url: '/public/api/v1/content',
		// Eventee answers 422 to with_overlapping=false/true; it accepts 0/1.
		request: {
			method: 'GET',
			query: { date: '2024-06-01', with_overlapping: 0 },
		},
		response: program,
	},
	{
		id: 'contentReset.delete',
		invoke: (ctx: Context) => Content.deleteAll(ctx, {}),
		url: '/public/api/v1/test/content',
		request: { method: 'DELETE' },
		response: undefined,
	},
	{
		id: 'hall.post',
		invoke: (ctx: Context) =>
			Halls.create(ctx, { name: 'Main Stage', order: 0 }),
		url: '/public/api/v1/hall',
		request: { method: 'POST', body: { name: 'Main Stage', order: 0 } },
		response: row,
	},
	{
		id: 'hall.patch',
		invoke: (ctx: Context) =>
			Halls.update(ctx, { hall_id: 1, name: 'Main Stage' }),
		url: '/public/api/v1/hall/{hall_id}',
		request: {
			method: 'PATCH',
			path: { hall_id: 1 },
			body: { name: 'Main Stage' },
		},
		response: row,
	},
	{
		id: 'hall.delete',
		invoke: (ctx: Context) => Halls.delete(ctx, { hall_id: 1 }),
		url: '/public/api/v1/hall/{hall_id}',
		request: { method: 'DELETE', path: { hall_id: 1 } },
		response: undefined,
	},
	{
		id: 'session.post',
		invoke: (ctx: Context) =>
			Sessions.create(ctx, {
				name: 'Keynote',
				start: '2024-06-01 09:00:00',
				end: '2024-06-01 10:00:00',
				hall_id: 1,
				type: 0,
			}),
		url: '/public/api/v1/lecture',
		request: {
			method: 'POST',
			body: {
				name: 'Keynote',
				start: '2024-06-01 09:00:00',
				end: '2024-06-01 10:00:00',
				hall_id: 1,
				type: 0,
			},
		},
		response: row,
	},
	{
		id: 'session.patch',
		invoke: (ctx: Context) =>
			Sessions.update(ctx, {
				lecture_id: 1,
				name: 'Keynote',
				start: '2024-06-01 09:00:00',
				end: '2024-06-01 10:00:00',
			}),
		url: '/public/api/v1/lecture/{lecture_id}',
		request: {
			method: 'PATCH',
			path: { lecture_id: 1 },
			body: {
				name: 'Keynote',
				start: '2024-06-01 09:00:00',
				end: '2024-06-01 10:00:00',
			},
		},
		response: row,
	},
	{
		id: 'session.delete',
		invoke: (ctx: Context) => Sessions.delete(ctx, { lecture_id: 1 }),
		url: '/public/api/v1/lecture/{lecture_id}',
		request: { method: 'DELETE', path: { lecture_id: 1 } },
		response: undefined,
	},
	{
		id: 'pause.post',
		invoke: (ctx: Context) =>
			Breaks.create(ctx, {
				name: 'Coffee',
				start: '2024-06-01 10:00:00',
				end: '2024-06-01 10:30:00',
			}),
		url: '/public/api/v1/pause',
		request: {
			method: 'POST',
			body: {
				name: 'Coffee',
				start: '2024-06-01 10:00:00',
				end: '2024-06-01 10:30:00',
			},
		},
		response: row,
	},
	{
		id: 'pause.patch',
		invoke: (ctx: Context) =>
			Breaks.update(ctx, {
				pause_id: 1,
				name: 'Coffee',
				start: '2024-06-01 10:00:00',
				end: '2024-06-01 10:30:00',
			}),
		url: '/public/api/v1/pause/{pause_id}',
		request: {
			method: 'PATCH',
			path: { pause_id: 1 },
			body: {
				name: 'Coffee',
				start: '2024-06-01 10:00:00',
				end: '2024-06-01 10:30:00',
			},
		},
		response: row,
	},
	{
		id: 'pause.delete',
		invoke: (ctx: Context) => Breaks.delete(ctx, { pause_id: 1 }),
		url: '/public/api/v1/pause/{pause_id}',
		request: { method: 'DELETE', path: { pause_id: 1 } },
		response: undefined,
	},
	{
		id: 'speaker.post',
		invoke: (ctx: Context) =>
			Speakers.create(ctx, { name: 'Jane Doe', email: 'jane.doe@example.com' }),
		url: '/public/api/v1/speaker',
		request: {
			method: 'POST',
			body: { name: 'Jane Doe', email: 'jane.doe@example.com' },
		},
		response: row,
	},
	{
		id: 'speaker.patch',
		invoke: (ctx: Context) =>
			Speakers.update(ctx, { speakerTmp_id: 1, position: 'CTO' }),
		url: '/public/api/v1/speaker/{speakerTmp_id}',
		request: {
			method: 'PATCH',
			path: { speakerTmp_id: 1 },
			body: { position: 'CTO' },
		},
		response: row,
	},
	{
		id: 'speaker.delete',
		invoke: (ctx: Context) => Speakers.delete(ctx, { speakerTmp_id: 1 }),
		url: '/public/api/v1/speaker/{speakerTmp_id}',
		request: { method: 'DELETE', path: { speakerTmp_id: 1 } },
		response: undefined,
	},
	{
		id: 'label.post',
		invoke: (ctx: Context) =>
			Labels.create(ctx, { name: 'Technology', color: '#3B82F6' }),
		url: '/public/api/v1/label',
		request: { method: 'POST', body: { name: 'Technology', color: '#3B82F6' } },
		response: row,
	},
	{
		id: 'label.patch',
		invoke: (ctx: Context) =>
			Labels.update(ctx, { track_id: 1, name: 'Technology', color: '#3B82F6' }),
		url: '/public/api/v1/label/{track_id}',
		request: {
			method: 'PATCH',
			path: { track_id: 1 },
			body: { name: 'Technology', color: '#3B82F6' },
		},
		response: row,
	},
	{
		id: 'label.delete',
		invoke: (ctx: Context) => Labels.delete(ctx, { track_id: 1 }),
		url: '/public/api/v1/label/{track_id}',
		request: { method: 'DELETE', path: { track_id: 1 } },
		response: undefined,
	},
	{
		id: 'partner.post',
		invoke: (ctx: Context) =>
			Partners.create(ctx, {
				company: 'Acme',
				logo_url: 'https://acme.example.com/logo.png',
			}),
		url: '/public/api/v1/partner',
		request: {
			method: 'POST',
			body: { company: 'Acme', logo_url: 'https://acme.example.com/logo.png' },
		},
		response: row,
	},
	{
		id: 'partner.patch',
		invoke: (ctx: Context) =>
			Partners.update(ctx, { partner_id: 1, company: 'Acme' }),
		url: '/public/api/v1/partner/{partner_id}',
		request: {
			method: 'PATCH',
			path: { partner_id: 1 },
			body: { company: 'Acme' },
		},
		response: row,
	},
	{
		id: 'partner.delete',
		invoke: (ctx: Context) => Partners.delete(ctx, { partner_id: 1 }),
		url: '/public/api/v1/partner/{partner_id}',
		request: { method: 'DELETE', path: { partner_id: 1 } },
		response: undefined,
	},
	{
		id: 'partnerSections.patch',
		invoke: (ctx: Context) =>
			Partners.updateSections(ctx, {
				partner_id: 1,
				sections: [{ type: 0, title: 'About' }],
			}),
		url: '/public/api/v1/partner/{partner_id}/sections',
		request: {
			method: 'PATCH',
			path: { partner_id: 1 },
			body: { sections: [{ type: 0, title: 'About' }] },
		},
		response: row,
	},
	{
		id: 'partner.get',
		invoke: (ctx: Context) => Partners.list(ctx, {}),
		url: '/public/api/v1/partners',
		request: { method: 'GET' },
		response: [],
	},
	{
		id: 'attendeeInvite.put',
		invoke: (ctx: Context) =>
			Attendees.invite(ctx, { users: [{ email: 'jane.doe@example.com' }] }),
		url: '/public/api/v1/attendee/invite',
		request: {
			method: 'PUT',
			body: { users: [{ email: 'jane.doe@example.com' }] },
		},
		response: invitation,
	},
	{
		id: 'attendeeCheckIn.patch',
		invoke: (ctx: Context) =>
			Attendees.checkIn(ctx, { attendee_id: 1, checkin: true }),
		url: '/public/api/v1/attendee/{attendee_id}/checkin',
		request: {
			method: 'PATCH',
			path: { attendee_id: 1 },
			body: { checkin: true },
		},
		response: row,
	},
	{
		id: 'attendees.get',
		invoke: (ctx: Context) => Attendees.list(ctx, {}),
		url: '/public/api/v1/participants',
		request: { method: 'GET' },
		response: [],
	},
	{
		id: 'attendees.delete',
		invoke: (ctx: Context) =>
			Attendees.remove(ctx, { email: 'jane.doe@example.com' }),
		url: '/public/api/v1/attendee',
		// Eventee wants the email URL-encoded inside the query value, so the transport encodes it a second time.
		request: { method: 'DELETE', query: { email: 'jane.doe%40example.com' } },
		response: undefined,
	},
	{
		id: 'registrationInvite.put',
		invoke: (ctx: Context) =>
			Registrations.create(ctx, {
				registrations: [{ email: 'jane.doe@example.com' }],
			}),
		url: '/public/api/v1/registration/invite',
		request: {
			method: 'PUT',
			body: { registrations: [{ email: 'jane.doe@example.com' }] },
		},
		response: invitation,
	},
	{
		id: 'registrations.get',
		invoke: (ctx: Context) => Registrations.list(ctx, {}),
		url: '/public/api/v1/registrations',
		request: { method: 'GET' },
		response: [],
	},
	{
		id: 'registrations.delete',
		invoke: (ctx: Context) =>
			Registrations.remove(ctx, { email: 'jane.doe@example.com' }),
		url: '/public/api/v1/registration',
		// Eventee wants the email URL-encoded inside the query value, so the transport encodes it a second time.
		request: { method: 'DELETE', query: { email: 'jane.doe%40example.com' } },
		response: undefined,
	},
	{
		id: 'groups.get',
		invoke: (ctx: Context) => Groups.list(ctx, {}),
		url: '/public/api/v1/groups',
		request: { method: 'GET' },
		response: [],
	},
	{
		id: 'reviews.get',
		invoke: (ctx: Context) => Reviews.list(ctx, {}),
		url: '/public/api/v1/reviews',
		request: { method: 'GET' },
		response: [],
	},
];

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('Eventee REST operation routing', () => {
	it.each(operationCases)(
		'$id sends the documented request and parses its response',
		async (testCase) => {
			const ctx = makeContext();
			mockedRequest.mockResolvedValue(testCase.response);
			const result = await testCase.invoke(ctx);
			expect(result).toEqual(testCase.response);
			expect(mockedRequest).toHaveBeenCalledTimes(1);
			const [calledUrl, calledKey, requestOptions] =
				mockedRequest.mock.calls[0] ?? [];
			expect(calledUrl).toBe(
				testCase.url.replace('/public/api/v1/', '/public/api/{api-version}/'),
			);
			expect(calledKey).toBe(ctx.key);
			expect(requestOptions?.method).toBe(testCase.request.method);
			if ('path' in testCase.request)
				expect(requestOptions?.path).toEqual(testCase.request.path);
			if ('query' in testCase.request)
				expect(requestOptions?.query).toEqual(testCase.request.query);
			if (testCase.request.body !== undefined)
				expect(requestOptions?.body).toMatchObject(testCase.request.body);
			expect(mockedLog).toHaveBeenCalledWith(
				ctx,
				`eventee.${testCase.id}`,
				{},
				'completed',
			);
		},
	);

	it('rejects undocumented request fields before network I/O', async () => {
		const ctx = makeContext();
		const invalidInput = {
			name: 'Main Stage',
			callback_url: 'https://example.com',
		};
		await expect(Halls.create(ctx, invalidInput)).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLog).not.toHaveBeenCalled();
	});

	it('rejects mixed invite and registration batches with invalid emails before network I/O', async () => {
		const ctx = makeContext();

		await expect(
			Attendees.invite(ctx, {
				users: [
					{ email: 'valid.person@example.com' },
					{ email: 'not-an-email' },
				],
			}),
		).rejects.toThrow();
		await expect(
			Registrations.create(ctx, {
				registrations: [
					{ email: 'valid.person@example.com' },
					{ email: 'not-an-email' },
				],
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('does not log invitee PII and registers schemas for all operations', async () => {
		const ctx = makeContext();
		mockedRequest.mockResolvedValue(invitation);
		await Attendees.invite(ctx, {
			users: [{ email: 'private.person@example.com' }],
		});
		const logPayload = mockedLog.mock.calls[0]?.[2];
		expect(logPayload).toEqual({});
		expect(JSON.stringify(logPayload)).not.toContain(
			'private.person@example.com',
		);
		expect(Object.keys(eventeeEndpointSchemas)).toHaveLength(31);
		const plugin = eventee({});
		expect(plugin.webhooks).toEqual({});
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('marks operations that delete provider data as destructive', () => {
		const meta = eventee({}).endpointMeta;
		// Sections left out of the list are deleted, along with their images and files.
		expect(meta?.['partnerSections.patch']?.riskLevel).toBe('destructive');
		expect(meta?.['contentReset.delete']?.riskLevel).toBe('destructive');
		expect(meta?.['partner.patch']?.riskLevel).toBe('write');
	});

	it('marks invitations that can email people as destructive', () => {
		const meta = eventee({}).endpointMeta;
		// `send_email: true` makes Eventee email each invited person.
		expect(meta?.['attendeeInvite.put']?.riskLevel).toBe('destructive');
		expect(meta?.['registrationInvite.put']?.riskLevel).toBe('destructive');
	});
});
