import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	listAcStates,
	setAcState,
	setAcStateProperty,
} from './endpoints/ac-states';
import {
	configureClimateReact,
	getClimateReact,
	setClimateReactEnabled,
} from './endpoints/climate-react';
import { getDevice, listDevices } from './endpoints/devices';
import {
	getHistoricalMeasurements,
	listDeviceEvents,
	listDoorSensorEvents,
} from './endpoints/measurements';
import {
	createSchedule,
	deleteSchedule,
	getSchedule,
	listSchedules,
	setScheduleEnabled,
} from './endpoints/schedules';
import { deleteTimer, getTimer, setTimer } from './endpoints/timer';
import type { SensiboContext } from './index';

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

type Stored = { data: { id: string; roomName?: string } };

function context(
	key: string,
	db?: {
		upsert?: jest.Mock;
		find?: jest.Mock;
	},
): SensiboContext {
	return {
		key,
		db: db
			? {
					pods: {
						upsertByEntityId: db.upsert ?? jest.fn(),
						findByEntityId:
							db.find ?? jest.fn().mockResolvedValue(null as Stored | null),
					},
				}
			: undefined,
	} as unknown as SensiboContext;
}

function lastCall() {
	const config = mockRequest.mock.calls.at(-1)?.[0];
	const options = mockRequest.mock.calls.at(-1)?.[1];
	return { config, options };
}

const ok = (result: unknown) => ({ status: 'success', result });
const AC = { on: true, mode: 'cool', fanLevel: 'auto', targetTemperature: 22 };

beforeEach(() => {
	jest.clearAllMocks();
});

describe('wire format of every operation', () => {
	type Case = {
		name: string;
		run: (ctx: SensiboContext) => Promise<unknown>;
		reply: unknown;
		method: string;
		url: string;
		query?: Record<string, unknown>;
		body?: unknown;
		event: string;
	};

	const cases: Case[] = [
		{
			name: 'devices.list',
			run: (ctx) => listDevices(ctx, { fields: '*' }),
			reply: ok([{ id: 'pod1', room: { uid: 'r1', name: 'Den' } }]),
			method: 'GET',
			url: '/api/v2/users/me/pods',
			query: { fields: '*' },
			event: 'sensibo.devices.list',
		},
		{
			name: 'devices.get',
			run: (ctx) => getDevice(ctx, { deviceId: 'pod1', fields: 'id,room' }),
			reply: ok({ id: 'pod1', room: { name: 'Den' } }),
			method: 'GET',
			url: '/api/v2/pods/pod1',
			query: { fields: 'id,room' },
			event: 'sensibo.devices.get',
		},
		{
			name: 'acStates.list',
			run: (ctx) => listAcStates(ctx, { deviceId: 'pod1', limit: 5 }),
			reply: ok([{ id: 's1', status: 'Success', acState: AC }]),
			method: 'GET',
			url: '/api/v2/pods/pod1/acStates',
			query: { limit: 5 },
			event: 'sensibo.acStates.list',
		},
		{
			name: 'acStates.set',
			run: (ctx) =>
				setAcState(ctx, { deviceId: 'pod1', acState: { on: false } }),
			reply: ok({
				id: 's2',
				status: 'Success',
				acState: { ...AC, on: false },
				changedProperties: ['on'],
				failureReason: null,
			}),
			method: 'POST',
			url: '/api/v2/pods/pod1/acStates',
			body: { acState: { on: false } },
			event: 'sensibo.acStates.set',
		},
		{
			name: 'acStates.setProperty',
			run: (ctx) =>
				setAcStateProperty(ctx, {
					deviceId: 'pod1',
					property: 'targetTemperature',
					newValue: 23,
					currentAcState: AC,
				}),
			reply: ok({
				id: 's3',
				status: 'Success',
				changedProperties: ['targetTemperature'],
			}),
			method: 'PATCH',
			url: '/api/v2/pods/pod1/acStates/targetTemperature',
			body: { newValue: 23, currentAcState: AC },
			event: 'sensibo.acStates.setProperty',
		},
		{
			name: 'measurements.history',
			run: (ctx) =>
				getHistoricalMeasurements(ctx, { deviceId: 'pod1', days: 2 }),
			reply: ok({
				temperature: [{ time: '2026-11-17T10:00:00Z', value: 22.5 }],
				humidity: [{ time: '2026-11-17T10:00:00Z', value: 48 }],
			}),
			method: 'GET',
			url: '/api/v2/pods/pod1/historicalMeasurements',
			query: { days: 2 },
			event: 'sensibo.measurements.history',
		},
		{
			name: 'events.list',
			run: (ctx) =>
				listDeviceEvents(ctx, { deviceId: 'pod1', daysBackwards: 3 }),
			reply: [
				{
					event_id: 1000000,
					timestamp: '2026-11-17T10:00:00Z',
					event_kind: 'ac_state_changed',
					details: {},
					object_id: 'pod1',
				},
			],
			method: 'GET',
			url: '/api/v2/pods/pod1/events',
			query: { days_backwards: 3 },
			event: 'sensibo.events.list',
		},
		{
			name: 'doorSensors.listEvents',
			run: (ctx) => listDoorSensorEvents(ctx, { sensorId: 'ds_1', days: 1 }),
			reply: ok([{ timestamp: '2026-11-17T10:00:00Z', event: 'opened' }]),
			method: 'GET',
			url: '/api/v2/doorSensors/ds_1/events',
			query: { days: 1 },
			event: 'sensibo.doorSensors.listEvents',
		},
		{
			name: 'climateReact.get',
			run: (ctx) => getClimateReact(ctx, { deviceId: 'pod1' }),
			reply: ok(null),
			method: 'GET',
			url: '/api/v2/pods/pod1/smartmode',
			event: 'sensibo.climateReact.get',
		},
		{
			name: 'climateReact.setEnabled',
			run: (ctx) =>
				setClimateReactEnabled(ctx, { deviceId: 'pod1', enabled: false }),
			reply: ok({ enabled: false }),
			method: 'PUT',
			url: '/api/v2/pods/pod1/smartmode',
			body: { enabled: false },
			event: 'sensibo.climateReact.setEnabled',
		},
		{
			name: 'climateReact.configure',
			run: (ctx) =>
				configureClimateReact(ctx, {
					deviceId: 'pod1',
					enabled: true,
					lowTemperatureThreshold: 22,
					lowTemperatureState: { on: false },
					highTemperatureThreshold: 25,
					highTemperatureState: { on: true, mode: 'cool' },
				}),
			reply: ok({ enabled: true, lowTemperatureThreshold: 22 }),
			method: 'POST',
			url: '/api/v2/pods/pod1/smartmode',
			body: {
				enabled: true,
				lowTemperatureThreshold: 22,
				lowTemperatureState: { on: false },
				highTemperatureThreshold: 25,
				highTemperatureState: { on: true, mode: 'cool' },
			},
			event: 'sensibo.climateReact.configure',
		},
		{
			name: 'timer.get',
			run: (ctx) => getTimer(ctx, { deviceId: 'pod1' }),
			reply: ok(null),
			method: 'GET',
			url: '/api/v1/pods/pod1/timer/',
			event: 'sensibo.timer.get',
		},
		{
			name: 'timer.set',
			run: (ctx) =>
				setTimer(ctx, {
					deviceId: 'pod1',
					minutesFromNow: 30,
					acState: { on: false },
				}),
			reply: ok({ id: 't1', isEnabled: true, acState: { on: false } }),
			method: 'PUT',
			url: '/api/v1/pods/pod1/timer/',
			body: { minutesFromNow: 30, acState: { on: false } },
			event: 'sensibo.timer.set',
		},
		{
			name: 'timer.delete',
			run: (ctx) => deleteTimer(ctx, { deviceId: 'pod1' }),
			reply: { status: 'success' },
			method: 'DELETE',
			url: '/api/v1/pods/pod1/timer/',
			event: 'sensibo.timer.delete',
		},
		{
			name: 'schedules.list',
			run: (ctx) => listSchedules(ctx, { deviceId: 'pod1' }),
			reply: ok([{ id: 'sc1', isEnabled: true, targetTimeLocal: '22:15' }]),
			method: 'GET',
			url: '/api/v1/pods/pod1/schedules/',
			event: 'sensibo.schedules.list',
		},
		{
			name: 'schedules.get',
			run: (ctx) => getSchedule(ctx, { deviceId: 'pod1', scheduleId: 'sc1' }),
			reply: ok({ id: 'sc1', isEnabled: true }),
			method: 'GET',
			url: '/api/v1/pods/pod1/schedules/sc1/',
			event: 'sensibo.schedules.get',
		},
		{
			name: 'schedules.create',
			run: (ctx) =>
				createSchedule(ctx, {
					deviceId: 'pod1',
					targetTimeLocal: '22:15',
					timezone: 'Europe/Oslo',
					acState: { on: false },
					recurOnDaysOfWeek: ['sunday', 'tuesday'],
				}),
			reply: ok({ id: 'sc2', isEnabled: true }),
			method: 'POST',
			url: '/api/v1/pods/pod1/schedules/',
			body: {
				targetTimeLocal: '22:15',
				timezone: 'Europe/Oslo',
				acState: { on: false },
				recurOnDaysOfWeek: ['sunday', 'tuesday'],
			},
			event: 'sensibo.schedules.create',
		},
		{
			name: 'schedules.setEnabled',
			run: (ctx) =>
				setScheduleEnabled(ctx, {
					deviceId: 'pod1',
					scheduleId: 'sc1',
					isEnabled: false,
				}),
			reply: ok({ id: 'sc1', isEnabled: false }),
			method: 'PUT',
			url: '/api/v1/pods/pod1/schedules/sc1/',
			body: { isEnabled: false },
			event: 'sensibo.schedules.setEnabled',
		},
		{
			name: 'schedules.delete',
			run: (ctx) =>
				deleteSchedule(ctx, { deviceId: 'pod1', scheduleId: 'sc1' }),
			reply: { status: 'success' },
			method: 'DELETE',
			url: '/api/v1/pods/pod1/schedules/sc1/',
			event: 'sensibo.schedules.delete',
		},
	];

	it.each(cases)('$name sends $method $url', async (c) => {
		mockRequest.mockResolvedValue(c.reply);
		const result = await c.run(context('test-key'));
		expect(result).toEqual(c.reply);
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://home.sensibo.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options?.method).toBe(c.method);
		expect(options?.url).toBe(c.url);
		expect(options?.query).toEqual({ apiKey: 'test-key', ...(c.query ?? {}) });
		if (c.body === undefined) {
			expect(options?.body).toBeUndefined();
		} else {
			expect(options?.body).toEqual(c.body);
			expect(options?.mediaType).toBe('application/json');
		}
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			c.event,
			expect.any(Object),
			'completed',
		);
		// The key never goes into the event payload.
		expect(
			JSON.stringify(mockLog.mock.calls.map((call) => call[2])),
		).not.toContain('test-key');
		// Core's own 429 retries stay on: no rate-limit override is passed.
		expect(mockRequest.mock.calls.at(-1)?.[2]).toBeUndefined();
	});

	it.each(cases)('$name throws AuthMissingError without a key', async (c) => {
		await expect(c.run(context(''))).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('input checks', () => {
	it('encodes ids so they cannot add path segments', async () => {
		mockRequest.mockResolvedValue(ok({ id: 'x' }));
		await getSchedule(context('k'), { deviceId: 'a/../b', scheduleId: 'c?d' });
		expect(lastCall().options?.url).toBe(
			'/api/v1/pods/a%2F..%2Fb/schedules/c%3Fd/',
		);
	});

	it('rejects an empty AC state', async () => {
		await expect(
			setAcState(context('k'), { deviceId: 'pod1', acState: {} }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a limit above 20 and a bad schedule time', async () => {
		await expect(
			listAcStates(context('k'), { deviceId: 'pod1', limit: 21 }),
		).rejects.toThrow();
		await expect(
			createSchedule(context('k'), {
				deviceId: 'pod1',
				targetTimeLocal: '25:00',
				timezone: 'UTC',
				acState: { on: true },
				recurOnDaysOfWeek: [],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty fields list before calling the API', async () => {
		await expect(listDevices(context('k'), { fields: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('omits the PATCH currentAcState when the caller does', async () => {
		mockRequest.mockResolvedValue(ok({ id: 's' }));
		await setAcStateProperty(context('k'), {
			deviceId: 'pod1',
			property: 'on',
			newValue: true,
		});
		expect(lastCall().options?.body).toEqual({ newValue: true });
	});
});

describe('responses', () => {
	it('accepts the enveloped events shape too', async () => {
		const reply = ok([{ event_id: 1020010, object_id: 'pod1' }]);
		mockRequest.mockResolvedValue(reply);
		await expect(
			listDeviceEvents(context('k'), { deviceId: 'pod1' }),
		).resolves.toEqual(reply);
	});

	it('rejects a response that has no result array', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });
		await expect(listDevices(context('k'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a pod whose id or room name has the wrong type', async () => {
		mockRequest.mockResolvedValue(ok([{ id: 42, room: { name: false } }]));
		await expect(listDevices(context('k'), {})).rejects.toThrow();
	});

	it('rejects a delete reply without a status', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			deleteTimer(context('k'), { deviceId: 'pod1' }),
		).rejects.toThrow();
	});

	it('lets an HTTP 404 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v2/pods/nope' },
			{
				url: 'https://home.sensibo.com/api/v2/pods/nope',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: 'No such device or device is not associated with user',
			},
			'Not Found',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getDevice(context('k'), { deviceId: 'nope' })).rejects.toBe(
			error,
		);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('stored pods', () => {
	it('stores each pod that has an id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(
			ok([{ id: 'pod-1', room: { name: 'Kitchen' } }, { room: {} }]),
		);
		const result = await listDevices(context('test-key', { upsert }), {});
		expect(result.result).toHaveLength(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('pod-1', {
			id: 'pod-1',
			roomName: 'Kitchen',
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('keeps the stored room name when a narrow fields list leaves the room out', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const find = jest
			.fn()
			.mockResolvedValue({ data: { id: 'pod-1', roomName: 'Kitchen' } });
		mockRequest.mockResolvedValue(ok([{ id: 'pod-1' }]));
		await listDevices(context('k', { upsert, find }), { fields: 'id' });
		expect(upsert).toHaveBeenCalledWith('pod-1', {
			id: 'pod-1',
			roomName: 'Kitchen',
		});
	});

	it('stores the pod from devices.get', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(ok({ room: { name: 'Den' } }));
		await getDevice(context('k', { upsert }), { deviceId: 'pod-9' });
		expect(upsert).toHaveBeenCalledWith('pod-9', {
			id: 'pod-9',
			roomName: 'Den',
		});
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		const reply = ok([{ id: 'pod-1' }]);
		mockRequest.mockResolvedValue(reply);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(listDevices(context('k', { upsert }), {})).resolves.toEqual(
			reply,
		);
		warn.mockRestore();
	});
});
