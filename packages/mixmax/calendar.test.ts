import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const APPOINTMENT_LINK = {
	userId: 'user-1',
	name: 'ada',
};

const MEETING_TYPE = {
	_id: 'mt-1',
	userId: 'user-1',
	name: '30 minute meeting',
	link: '30min',
	durationMin: 30,
	type: 'Personal',
	calendarIds: ['cal-1'],
	daysFromNow: { start: 0, end: 60, unit: 'days' },
	day0: { enabled: false, timeslots: [] },
	day1: {
		enabled: true,
		timeslots: [{ startTime: '09:00', endTime: '17:00' }],
	},
	day2: {
		enabled: true,
		timeslots: [{ startTime: '09:00', endTime: '17:00' }],
	},
	day3: {
		enabled: true,
		timeslots: [{ startTime: '09:00', endTime: '17:00' }],
	},
	day4: {
		enabled: true,
		timeslots: [{ startTime: '09:00', endTime: '17:00' }],
	},
	day5: { enabled: false, timeslots: [] },
	day6: { enabled: false, timeslots: [] },
	buffer: 0,
	minNoticeDuration: { value: 60, unit: 'minutes' },
	preventDoubleBooking: ['cal-2'],
	defaults: { title: 'Meet with me' },
	defaultGuests: [],
	customFields: [],
	roundRobinQueue: [],
	includeMessagePermaLink: true,
	guestsCanModifyInvites: false,
	roomsAndResources: [],
	anyRoomInBuilding: [],
	integrations: {},
	reducedInterval: false,
	ruleIds: ['rule-1'],
	createdAt: '2026-10-14T15:00:00.000Z',
	updatedAt: '2026-10-14T15:00:00.000Z',
};

const MEETING_INVITE = {
	_id: 'invite-1',
	userId: 'user-1',
	creationDate: 1792560000000,
	title: 'Intro call',
	description: 'Say hello',
	location: 'Zoom',
	timezone: 'America/Los_Angeles',
	lng: 'en',
	calendarId: 'cal-1',
	calendarName: 'Work',
	timeslots: [
		{
			start: 1792560000000,
			end: 1792561800000,
			events: [{ id: 'event-1' }],
		},
	],
	guestsCanModify: false,
	allowDoubleBookings: false,
	additionalGuests: [],
	roomsAndResources: [],
	anyRoomInBuilding: {},
	includeMessagePermaLink: true,
};

describe('Mixmax calendar endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('appointmentLinks.list sends GET /v1/appointmentlinks with the required name', async () => {
		const taken = [{ name: 'ada' }];
		request.mockResolvedValue(taken);
		const result = await endpoints.appointmentLinks.list(ctx, { name: 'ada' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/appointmentlinks', {
			method: 'GET',
			query: {
				name: 'ada',
			},
		});
		expect(result).toEqual(taken);
	});

	it('appointmentLinks.getMe sends GET /v1/appointmentlinks/me', async () => {
		request.mockResolvedValue(APPOINTMENT_LINK);
		const result = await endpoints.appointmentLinks.getMe(ctx, {});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/appointmentlinks/me', {
			method: 'GET',
		});
		expect(result).toEqual(APPOINTMENT_LINK);
	});

	it('appointmentLinks.updateMe patches /v1/appointmentlinks/me with the new name', async () => {
		const result = await endpoints.appointmentLinks.updateMe(ctx, {
			name: 'ada-lovelace',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/appointmentlinks/me', {
			method: 'PATCH',
			body: {
				name: 'ada-lovelace',
			},
		});
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('meetingTypes.list sends GET /v1/meetingtypes with documented query params', async () => {
		const page = { results: [MEETING_TYPE], hasNext: false, next: 'cursor-1' };
		request.mockResolvedValue(page);
		const result = await endpoints.meetingTypes.list(ctx, {
			access: 'mine',
			limit: 20,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetingtypes', {
			method: 'GET',
			query: {
				access: 'mine',
				limit: 20,
				next: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('meetingTypes.create posts the full documented body', async () => {
		request.mockResolvedValue(MEETING_TYPE);
		const body = {
			userId: 'user-1',
			name: '30 minute meeting',
			link: '30min',
			durationMin: 30,
			type: 'Personal' as const,
			calendarIds: ['cal-1'],
			daysFromNow: { start: 0, end: 60, unit: 'days' },
			day0: { enabled: false, timeslots: [] },
			day1: {
				enabled: true,
				timeslots: [{ startTime: '09:00', endTime: '17:00' }],
			},
			day2: {
				enabled: true,
				timeslots: [{ startTime: '09:00', endTime: '17:00' }],
			},
			day3: {
				enabled: true,
				timeslots: [{ startTime: '09:00', endTime: '17:00' }],
			},
			day4: {
				enabled: true,
				timeslots: [{ startTime: '09:00', endTime: '17:00' }],
			},
			day5: { enabled: false, timeslots: [] },
			day6: { enabled: false, timeslots: [] },
			buffer: 0,
			preventDoubleBooking: ['cal-2'],
			defaults: { title: 'Meet with me' },
			defaultGuests: [],
			customFields: [],
			roundRobinQueue: [],
			includeMessagePermaLink: true,
			guestsCanModifyInvites: false,
			roomsAndResources: [],
			anyRoomInBuilding: [],
			integrations: {},
			reducedInterval: false,
			ruleIds: ['rule-1'],
		};
		const result = await endpoints.meetingTypes.create(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetingtypes', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(MEETING_TYPE);
	});

	it('meetingTypes.get sends GET /v1/meetingtypes/:id with the expand param', async () => {
		request.mockResolvedValue(MEETING_TYPE);
		const result = await endpoints.meetingTypes.get(ctx, {
			id: 'mt-1',
			expand: 'copies',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetingtypes/mt-1', {
			method: 'GET',
			query: {
				expand: 'copies',
			},
		});
		expect(result).toEqual(MEETING_TYPE);
	});

	it('meetingTypes.update patches /v1/meetingtypes/:id without the id in the body', async () => {
		const updated = {
			_id: 'mt-1',
			name: '45-minute intro',
			durationMin: 45,
			updatedAt: '2026-10-14T18:09:23.411Z',
		};
		request.mockResolvedValue(updated);
		const result = await endpoints.meetingTypes.update(ctx, {
			id: 'mt-1',
			name: '45-minute intro',
			durationMin: 45,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetingtypes/mt-1', {
			method: 'PATCH',
			body: {
				name: '45-minute intro',
				durationMin: 45,
			},
		});
		expect(result).toEqual(updated);
	});

	it('meetingTypes.delete sends DELETE /v1/meetingtypes/:id', async () => {
		const result = await endpoints.meetingTypes.delete(ctx, { id: 'mt-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetingtypes/mt-1', {
			method: 'DELETE',
		});
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('meetingInvites.list sends GET /v1/meetinginvites with documented query params', async () => {
		const page = { results: [MEETING_INVITE], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.meetingInvites.list(ctx, { limit: 50 });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetinginvites', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('meetingInvites.get sends GET /v1/meetinginvites/:id', async () => {
		request.mockResolvedValue(MEETING_INVITE);
		const result = await endpoints.meetingInvites.get(ctx, { id: 'invite-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetinginvites/invite-1', {
			method: 'GET',
		});
		expect(result).toEqual(MEETING_INVITE);
	});

	it('rejects missing names and ids before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.appointmentLinks.list(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.appointmentLinks.updateMe(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.meetingTypes.get(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.meetingTypes.update(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.meetingTypes.delete(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe meeting type ids before any request', async () => {
		await expect(
			endpoints.meetingTypes.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		await expect(
			endpoints.meetingTypes.delete(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});
});
