import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { SensiboContext } from './context';
import {
	AcStates,
	ClimateReact,
	Devices,
	DoorSensors,
	Events,
	Measurements,
	Schedules,
	Timer,
} from './endpoints';
import * as T from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SensiboSchema } from './schema';

export type { SensiboContext };

export type SensiboPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSensiboPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sensiboEndpointsNested>;
};

export type SensiboKeyBuilderContext = KeyBuilderContext<SensiboPluginOptions>;

const sensiboEndpointsNested = {
	devices: Devices,
	acStates: AcStates,
	measurements: Measurements,
	events: Events,
	doorSensors: DoorSensors,
	climateReact: ClimateReact,
	timer: Timer,
	schedules: Schedules,
} as const;

const sensiboWebhooksNested = {} as const;

export type SensiboBoundEndpoints = BindEndpoints<
	typeof sensiboEndpointsNested
>;

export const sensiboEndpointSchemas = {
	'devices.list': {
		input: T.ListDevicesInputSchema,
		output: T.ListDevicesResponseSchema,
	},
	'devices.get': {
		input: T.GetDeviceInputSchema,
		output: T.GetDeviceResponseSchema,
	},
	'acStates.list': {
		input: T.ListAcStatesInputSchema,
		output: T.ListAcStatesResponseSchema,
	},
	'acStates.set': {
		input: T.SetAcStateInputSchema,
		output: T.SetAcStateResponseSchema,
	},
	'acStates.setProperty': {
		input: T.SetAcStatePropertyInputSchema,
		output: T.SetAcStatePropertyResponseSchema,
	},
	'measurements.history': {
		input: T.GetHistoricalMeasurementsInputSchema,
		output: T.GetHistoricalMeasurementsResponseSchema,
	},
	'events.list': {
		input: T.ListDeviceEventsInputSchema,
		output: T.ListDeviceEventsResponseSchema,
	},
	'doorSensors.listEvents': {
		input: T.ListDoorSensorEventsInputSchema,
		output: T.ListDoorSensorEventsResponseSchema,
	},
	'climateReact.get': {
		input: T.GetClimateReactInputSchema,
		output: T.GetClimateReactResponseSchema,
	},
	'climateReact.setEnabled': {
		input: T.SetClimateReactEnabledInputSchema,
		output: T.SetClimateReactEnabledResponseSchema,
	},
	'climateReact.configure': {
		input: T.ConfigureClimateReactInputSchema,
		output: T.ConfigureClimateReactResponseSchema,
	},
	'timer.get': {
		input: T.GetTimerInputSchema,
		output: T.GetTimerResponseSchema,
	},
	'timer.set': {
		input: T.SetTimerInputSchema,
		output: T.SetTimerResponseSchema,
	},
	'timer.delete': {
		input: T.DeleteTimerInputSchema,
		output: T.DeleteTimerResponseSchema,
	},
	'schedules.list': {
		input: T.ListSchedulesInputSchema,
		output: T.ListSchedulesResponseSchema,
	},
	'schedules.get': {
		input: T.GetScheduleInputSchema,
		output: T.GetScheduleResponseSchema,
	},
	'schedules.create': {
		input: T.CreateScheduleInputSchema,
		output: T.CreateScheduleResponseSchema,
	},
	'schedules.setEnabled': {
		input: T.SetScheduleEnabledInputSchema,
		output: T.SetScheduleEnabledResponseSchema,
	},
	'schedules.delete': {
		input: T.DeleteScheduleInputSchema,
		output: T.DeleteScheduleResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sensiboEndpointsNested
>;

const sensiboEndpointMeta = {
	'devices.list': {
		riskLevel: 'read',
		description:
			'List the Sensibo pods (AC controllers) on the account. Pass fields="*" for full pod details.',
	},
	'devices.get': {
		riskLevel: 'read',
		description:
			'Get one pod: room, AC state, measurements and remote capabilities.',
	},
	'acStates.list': {
		riskLevel: 'read',
		description:
			'List the current and recent AC states of a pod, newest first.',
	},
	'acStates.set': {
		riskLevel: 'write',
		description:
			'Set the AC state of a pod (on/off, mode, fan level, target temperature, swing).',
	},
	'acStates.setProperty': {
		riskLevel: 'write',
		description:
			'Change one property of the AC state of a pod, such as on or targetTemperature.',
	},
	'measurements.history': {
		riskLevel: 'read',
		description:
			'Get the temperature and humidity readings of a pod for the last few days.',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'List the events of a pod: AC state changes, schedule and Climate React changes, motion and geofence events.',
	},
	'doorSensors.listEvents': {
		riskLevel: 'read',
		description: 'List the open and close events of a door sensor.',
	},
	'climateReact.get': {
		riskLevel: 'read',
		description: 'Get the Climate React (smart mode) settings of a pod.',
	},
	'climateReact.setEnabled': {
		riskLevel: 'write',
		description: 'Turn Climate React on or off for a pod.',
	},
	'climateReact.configure': {
		riskLevel: 'write',
		description:
			'Set the Climate React thresholds and the AC states it applies; replaces the current Climate React settings.',
	},
	'timer.get': {
		riskLevel: 'read',
		description: 'Get the timer set on a pod, if any.',
	},
	'timer.set': {
		riskLevel: 'write',
		description:
			'Set a timer that applies an AC state a number of minutes from now; replaces any current timer.',
	},
	'timer.delete': {
		riskLevel: 'destructive',
		description: 'Delete the timer on a pod.',
	},
	'schedules.list': {
		riskLevel: 'read',
		description: 'List the schedules of a pod.',
	},
	'schedules.get': {
		riskLevel: 'read',
		description: 'Get one schedule of a pod.',
	},
	'schedules.create': {
		riskLevel: 'write',
		description:
			'Create a schedule that applies an AC state at a local time, once or on chosen weekdays.',
	},
	'schedules.setEnabled': {
		riskLevel: 'write',
		description: 'Enable or pause one schedule of a pod.',
	},
	'schedules.delete': {
		riskLevel: 'destructive',
		description: 'Delete one schedule of a pod.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sensiboEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const sensiboAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSensiboPlugin<T extends SensiboPluginOptions> = CorsairPlugin<
	'sensibo',
	typeof SensiboSchema,
	typeof sensiboEndpointsNested,
	typeof sensiboWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSensiboPlugin = BaseSensiboPlugin<SensiboPluginOptions>;

export type ExternalSensiboPlugin<T extends SensiboPluginOptions> =
	BaseSensiboPlugin<T>;

export function sensibo<const T extends SensiboPluginOptions>(
	incomingOptions: SensiboPluginOptions & T = {} as SensiboPluginOptions & T,
): ExternalSensiboPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'sensibo',
		authConfig: sensiboAuthConfig,
		schema: SensiboSchema,
		options,
		hooks: options.hooks,
		endpoints: sensiboEndpointsNested,
		webhooks: sensiboWebhooksNested,
		endpointMeta: sensiboEndpointMeta,
		endpointSchemas: sensiboEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SensiboKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('sensibo', 'api_key');
				}
				return key;
			}

			return '';
		},
	} satisfies InternalSensiboPlugin;
}
