import { z } from 'zod';

// ── Shared input pieces ──────────────────────────────────────────────────────

const DeviceId = z
	.string()
	.min(1)
	.describe('Pod (device) id from devices.list.');

const Fields = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Comma-separated pod fields to return, or "*" for all. Sensibo returns only ids when it is omitted.',
	);

/**
 * An AC state to apply. Sensibo accepts a partial state (for example only
 * `on`), and the valid modes, fan levels and swing values come from the pod's
 * `remoteCapabilities`, so they stay free strings.
 */
const AcStateFields = z.object({
	on: z.boolean().optional().describe('true turns the AC on, false off.'),
	mode: z
		.string()
		.min(1)
		.optional()
		.describe(
			'One of the modes in remoteCapabilities, e.g. cool, heat, fan, auto, dry.',
		),
	fanLevel: z
		.string()
		.min(1)
		.optional()
		.describe(
			'One of the fan levels in remoteCapabilities, e.g. low, medium, high, auto.',
		),
	targetTemperature: z
		.number()
		.int()
		.optional()
		.describe('Target temperature.'),
	temperatureUnit: z
		.enum(['C', 'F'])
		.optional()
		.describe('C for Celsius or F for Fahrenheit.'),
	swing: z
		.string()
		.min(1)
		.optional()
		.describe(
			'One of the swing states in remoteCapabilities, e.g. stopped, rangeFull.',
		),
	horizontalSwing: z
		.string()
		.min(1)
		.optional()
		.describe('One of the horizontal swing states in remoteCapabilities.'),
	light: z
		.string()
		.min(1)
		.optional()
		.describe('Display light, e.g. on, off, dim, when the remote supports it.'),
});

export const AcStateInputSchema = AcStateFields.refine(
	(state) => Object.keys(state).length > 0,
	{ message: 'acState needs at least one property' },
);

/**
 * A complete AC state, for timers and schedules. Their reference object
 * requires on, mode, fanLevel and targetTemperature; only a direct
 * acStates.set is documented with a partial state.
 */
export const FullAcStateInputSchema = AcStateFields.required({
	on: true,
	mode: true,
	fanLevel: true,
	targetTemperature: true,
});

export type AcStateInput = z.infer<typeof AcStateInputSchema>;

// ── Shared response pieces (lenient: Sensibo adds fields and sends nulls) ─────

/** Sensibo wraps every v1 and v2 response as `{ status, result }`. */
function envelope<T extends z.ZodTypeAny>(result: T) {
	return z
		.object({
			status: z.string(),
			result,
		})
		.passthrough();
}

const AcStateOutputSchema = z
	.object({
		on: z.boolean().nullable().optional(),
		mode: z.string().nullable().optional(),
		fanLevel: z.string().nullable().optional(),
		targetTemperature: z.number().nullable().optional(),
		temperatureUnit: z.string().nullable().optional(),
		swing: z.string().nullable().optional(),
		horizontalSwing: z.string().nullable().optional(),
		light: z.string().nullable().optional(),
	})
	.passthrough();

export const PodSchema = z
	.object({
		id: z.string().optional(),
		room: z
			.object({
				uid: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		acState: AcStateOutputSchema.nullable().optional(),
		productModel: z.string().nullable().optional(),
		// Shape depends on the requested fields and the pod model.
		measurements: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();

export type SensiboPod = z.infer<typeof PodSchema>;

const AcStateChangeSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().nullable().optional(),
		reason: z.string().nullable().optional(),
		acState: AcStateOutputSchema.nullable().optional(),
		changedProperties: z.array(z.string()).nullable().optional(),
		failureReason: z.string().nullable().optional(),
	})
	.passthrough();

const MeasurementPointSchema = z
	.object({
		time: z.string().nullable().optional(),
		value: z.number().nullable().optional(),
	})
	.passthrough();

const DeviceEventSchema = z
	.object({
		event_id: z.number().nullable().optional(),
		timestamp: z.string().nullable().optional(),
		event_kind: z.string().nullable().optional(),
		event_description: z.string().nullable().optional(),
		// Event-specific payload; its keys vary by event_id.
		details: z.record(z.string(), z.unknown()).nullable().optional(),
		object_id: z.string().nullable().optional(),
		object_kind: z.string().nullable().optional(),
	})
	.passthrough();

const DoorSensorEventSchema = z
	.object({
		timestamp: z.string().nullable().optional(),
		// Documented as opened/closed; kept open so a new value does not throw.
		event: z.string().nullable().optional(),
	})
	.passthrough();

const ClimateReactSchema = z
	.object({
		enabled: z.boolean().nullable().optional(),
		type: z.string().nullable().optional(),
		lowTemperatureThreshold: z.number().nullable().optional(),
		lowTemperatureState: AcStateOutputSchema.nullable().optional(),
		highTemperatureThreshold: z.number().nullable().optional(),
		highTemperatureState: AcStateOutputSchema.nullable().optional(),
	})
	.passthrough();

const TimerSchema = z
	.object({
		id: z.string().nullable().optional(),
		isEnabled: z.boolean().nullable().optional(),
		acState: AcStateOutputSchema.nullable().optional(),
		targetTime: z.string().nullable().optional(),
		secondsRemaining: z.number().nullable().optional(),
	})
	.passthrough();

const ScheduleSchema = z
	.object({
		id: z.string().nullable().optional(),
		isEnabled: z.boolean().nullable().optional(),
		acState: AcStateOutputSchema.nullable().optional(),
		targetTimeLocal: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		recurringDays: z.array(z.string()).nullable().optional(),
		nextTime: z.string().nullable().optional(),
	})
	.passthrough();

// ── devices ─────────────────────────────────────────────────────────────────

export const ListDevicesInputSchema = z.object({ fields: Fields });
export const ListDevicesResponseSchema = envelope(z.array(PodSchema));

export const GetDeviceInputSchema = z.object({
	deviceId: DeviceId,
	fields: Fields,
});
export const GetDeviceResponseSchema = envelope(PodSchema);

// ── acStates ────────────────────────────────────────────────────────────────

export const ListAcStatesInputSchema = z.object({
	deviceId: DeviceId,
	limit: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe('How many recent states to return (1 to 20).'),
});
export const ListAcStatesResponseSchema = envelope(
	z.array(AcStateChangeSchema),
);

export const SetAcStateInputSchema = z.object({
	deviceId: DeviceId,
	acState: AcStateInputSchema,
});
export const SetAcStateResponseSchema = envelope(AcStateChangeSchema);

export const SetAcStatePropertyInputSchema = z.object({
	deviceId: DeviceId,
	property: z
		.enum([
			'on',
			'mode',
			'fanLevel',
			'targetTemperature',
			'temperatureUnit',
			'swing',
			'horizontalSwing',
			'light',
		])
		.describe('The one AC state property to change.'),
	newValue: z
		.union([z.string(), z.number(), z.boolean()])
		.describe('The new value, e.g. true for on, 22 for targetTemperature.'),
	currentAcState: AcStateInputSchema.optional().describe(
		'The current AC state, which Sensibo uses to fill in the other properties.',
	),
});
export const SetAcStatePropertyResponseSchema = envelope(AcStateChangeSchema);

// ── measurements / events ───────────────────────────────────────────────────

export const GetHistoricalMeasurementsInputSchema = z.object({
	deviceId: DeviceId,
	days: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Number of days back to return (Sensibo default 1).'),
});
export const GetHistoricalMeasurementsResponseSchema = envelope(
	z
		.object({
			temperature: z.array(MeasurementPointSchema).nullable().optional(),
			humidity: z.array(MeasurementPointSchema).nullable().optional(),
		})
		.passthrough(),
);

export const ListDeviceEventsInputSchema = z.object({
	deviceId: DeviceId,
	daysBackwards: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Number of days back to return (Sensibo default 1).'),
});
// The reference documents a bare array; the rest of the API uses the envelope.
export const ListDeviceEventsResponseSchema = z.union([
	envelope(z.array(DeviceEventSchema)),
	z.array(DeviceEventSchema),
]);

export const ListDoorSensorEventsInputSchema = z.object({
	sensorId: z.string().min(1).describe('Door sensor id (starts with ds_).'),
	days: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Number of days of history to analyse (Sensibo default 1).'),
});
export const ListDoorSensorEventsResponseSchema = z.union([
	envelope(z.array(DoorSensorEventSchema)),
	z.array(DoorSensorEventSchema),
]);

// ── climateReact ────────────────────────────────────────────────────────────

export const GetClimateReactInputSchema = z.object({ deviceId: DeviceId });
export const GetClimateReactResponseSchema = envelope(
	ClimateReactSchema.nullable(),
);

export const SetClimateReactEnabledInputSchema = z.object({
	deviceId: DeviceId,
	enabled: z
		.boolean()
		.describe('true enables Climate React, false disables it.'),
});
export const SetClimateReactEnabledResponseSchema = envelope(
	ClimateReactSchema.nullable().optional(),
);

export const ConfigureClimateReactInputSchema = z.object({
	deviceId: DeviceId,
	enabled: z.boolean().describe('Whether Climate React runs.'),
	type: z
		.string()
		.min(1)
		.optional()
		.describe(
			'What the thresholds measure, e.g. temperature, humidity, feelsLike.',
		),
	lowTemperatureThreshold: z
		.number()
		.describe('Low threshold that triggers lowTemperatureState.'),
	lowTemperatureState: AcStateInputSchema.describe(
		'AC state applied when the reading drops below the low threshold.',
	),
	highTemperatureThreshold: z
		.number()
		.describe('High threshold that triggers highTemperatureState.'),
	highTemperatureState: AcStateInputSchema.describe(
		'AC state applied when the reading rises above the high threshold.',
	),
});
export const ConfigureClimateReactResponseSchema = envelope(
	ClimateReactSchema.nullable().optional(),
);

// ── timer (v1) ──────────────────────────────────────────────────────────────

export const GetTimerInputSchema = z.object({ deviceId: DeviceId });
export const GetTimerResponseSchema = envelope(TimerSchema.nullable());

export const SetTimerInputSchema = z.object({
	deviceId: DeviceId,
	minutesFromNow: z
		.number()
		.int()
		.min(1)
		.describe('Minutes from now when the timer fires.'),
	acState: FullAcStateInputSchema.describe(
		'AC state applied when the timer fires (on, mode, fanLevel and targetTemperature required).',
	),
});
export const SetTimerResponseSchema = envelope(
	TimerSchema.nullable().optional(),
);

export const DeleteTimerInputSchema = z.object({ deviceId: DeviceId });
// Sensibo confirms with `{ status: "success" }`; the result is not documented.
export const DeleteTimerResponseSchema = envelope(z.unknown().optional());

// ── schedules (v1) ──────────────────────────────────────────────────────────

export const ListSchedulesInputSchema = z.object({ deviceId: DeviceId });
export const ListSchedulesResponseSchema = envelope(z.array(ScheduleSchema));

const ScheduleId = z
	.string()
	.min(1)
	.describe('Schedule id from schedules.list.');

export const GetScheduleInputSchema = z.object({
	deviceId: DeviceId,
	scheduleId: ScheduleId,
});
export const GetScheduleResponseSchema = envelope(ScheduleSchema);

export const CreateScheduleInputSchema = z.object({
	deviceId: DeviceId,
	targetTimeLocal: z
		.string()
		.regex(/^([01]\d|2[0-3]):[0-5]\d$/)
		.describe('Local time in 24-hour HH:MM, e.g. 22:15.'),
	timezone: z
		.string()
		.min(1)
		.describe('IANA timezone the time is in, e.g. Europe/Oslo.'),
	acState: FullAcStateInputSchema.describe(
		'AC state applied at that time (on, mode, fanLevel and targetTemperature required).',
	),
	recurOnDaysOfWeek: z
		.array(
			z.enum([
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
			]),
		)
		.describe('Days the schedule repeats on; an empty list runs it once.'),
});
export const CreateScheduleResponseSchema = envelope(
	ScheduleSchema.nullable().optional(),
);

export const SetScheduleEnabledInputSchema = z.object({
	deviceId: DeviceId,
	scheduleId: ScheduleId,
	isEnabled: z
		.boolean()
		.describe('true enables the schedule, false pauses it.'),
});
export const SetScheduleEnabledResponseSchema = envelope(
	ScheduleSchema.nullable().optional(),
);

export const DeleteScheduleInputSchema = z.object({
	deviceId: DeviceId,
	scheduleId: ScheduleId,
});
// Sensibo confirms with `{ status: "success" }`; the result is not documented.
export const DeleteScheduleResponseSchema = envelope(z.unknown().optional());

// ── Types ───────────────────────────────────────────────────────────────────

export type ListDevicesInput = z.infer<typeof ListDevicesInputSchema>;
export type ListDevicesResponse = z.infer<typeof ListDevicesResponseSchema>;
export type GetDeviceInput = z.infer<typeof GetDeviceInputSchema>;
export type GetDeviceResponse = z.infer<typeof GetDeviceResponseSchema>;
export type ListAcStatesInput = z.infer<typeof ListAcStatesInputSchema>;
export type ListAcStatesResponse = z.infer<typeof ListAcStatesResponseSchema>;
export type SetAcStateInput = z.infer<typeof SetAcStateInputSchema>;
export type SetAcStateResponse = z.infer<typeof SetAcStateResponseSchema>;
export type SetAcStatePropertyInput = z.infer<
	typeof SetAcStatePropertyInputSchema
>;
export type SetAcStatePropertyResponse = z.infer<
	typeof SetAcStatePropertyResponseSchema
>;
export type GetHistoricalMeasurementsInput = z.infer<
	typeof GetHistoricalMeasurementsInputSchema
>;
export type GetHistoricalMeasurementsResponse = z.infer<
	typeof GetHistoricalMeasurementsResponseSchema
>;
export type ListDeviceEventsInput = z.infer<typeof ListDeviceEventsInputSchema>;
export type ListDeviceEventsResponse = z.infer<
	typeof ListDeviceEventsResponseSchema
>;
export type ListDoorSensorEventsInput = z.infer<
	typeof ListDoorSensorEventsInputSchema
>;
export type ListDoorSensorEventsResponse = z.infer<
	typeof ListDoorSensorEventsResponseSchema
>;
export type GetClimateReactInput = z.infer<typeof GetClimateReactInputSchema>;
export type GetClimateReactResponse = z.infer<
	typeof GetClimateReactResponseSchema
>;
export type SetClimateReactEnabledInput = z.infer<
	typeof SetClimateReactEnabledInputSchema
>;
export type SetClimateReactEnabledResponse = z.infer<
	typeof SetClimateReactEnabledResponseSchema
>;
export type ConfigureClimateReactInput = z.infer<
	typeof ConfigureClimateReactInputSchema
>;
export type ConfigureClimateReactResponse = z.infer<
	typeof ConfigureClimateReactResponseSchema
>;
export type GetTimerInput = z.infer<typeof GetTimerInputSchema>;
export type GetTimerResponse = z.infer<typeof GetTimerResponseSchema>;
export type SetTimerInput = z.infer<typeof SetTimerInputSchema>;
export type SetTimerResponse = z.infer<typeof SetTimerResponseSchema>;
export type DeleteTimerInput = z.infer<typeof DeleteTimerInputSchema>;
export type DeleteTimerResponse = z.infer<typeof DeleteTimerResponseSchema>;
export type ListSchedulesInput = z.infer<typeof ListSchedulesInputSchema>;
export type ListSchedulesResponse = z.infer<typeof ListSchedulesResponseSchema>;
export type GetScheduleInput = z.infer<typeof GetScheduleInputSchema>;
export type GetScheduleResponse = z.infer<typeof GetScheduleResponseSchema>;
export type CreateScheduleInput = z.infer<typeof CreateScheduleInputSchema>;
export type CreateScheduleResponse = z.infer<
	typeof CreateScheduleResponseSchema
>;
export type SetScheduleEnabledInput = z.infer<
	typeof SetScheduleEnabledInputSchema
>;
export type SetScheduleEnabledResponse = z.infer<
	typeof SetScheduleEnabledResponseSchema
>;
export type DeleteScheduleInput = z.infer<typeof DeleteScheduleInputSchema>;
export type DeleteScheduleResponse = z.infer<
	typeof DeleteScheduleResponseSchema
>;

export const SensiboEndpointInputSchemas = {
	listDevices: ListDevicesInputSchema,
	getDevice: GetDeviceInputSchema,
	listAcStates: ListAcStatesInputSchema,
	setAcState: SetAcStateInputSchema,
	setAcStateProperty: SetAcStatePropertyInputSchema,
	getHistoricalMeasurements: GetHistoricalMeasurementsInputSchema,
	listDeviceEvents: ListDeviceEventsInputSchema,
	listDoorSensorEvents: ListDoorSensorEventsInputSchema,
	getClimateReact: GetClimateReactInputSchema,
	setClimateReactEnabled: SetClimateReactEnabledInputSchema,
	configureClimateReact: ConfigureClimateReactInputSchema,
	getTimer: GetTimerInputSchema,
	setTimer: SetTimerInputSchema,
	deleteTimer: DeleteTimerInputSchema,
	listSchedules: ListSchedulesInputSchema,
	getSchedule: GetScheduleInputSchema,
	createSchedule: CreateScheduleInputSchema,
	setScheduleEnabled: SetScheduleEnabledInputSchema,
	deleteSchedule: DeleteScheduleInputSchema,
} as const;

export const SensiboEndpointOutputSchemas = {
	listDevices: ListDevicesResponseSchema,
	getDevice: GetDeviceResponseSchema,
	listAcStates: ListAcStatesResponseSchema,
	setAcState: SetAcStateResponseSchema,
	setAcStateProperty: SetAcStatePropertyResponseSchema,
	getHistoricalMeasurements: GetHistoricalMeasurementsResponseSchema,
	listDeviceEvents: ListDeviceEventsResponseSchema,
	listDoorSensorEvents: ListDoorSensorEventsResponseSchema,
	getClimateReact: GetClimateReactResponseSchema,
	setClimateReactEnabled: SetClimateReactEnabledResponseSchema,
	configureClimateReact: ConfigureClimateReactResponseSchema,
	getTimer: GetTimerResponseSchema,
	setTimer: SetTimerResponseSchema,
	deleteTimer: DeleteTimerResponseSchema,
	listSchedules: ListSchedulesResponseSchema,
	getSchedule: GetScheduleResponseSchema,
	createSchedule: CreateScheduleResponseSchema,
	setScheduleEnabled: SetScheduleEnabledResponseSchema,
	deleteSchedule: DeleteScheduleResponseSchema,
} as const;
