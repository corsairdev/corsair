import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Device, Serial } from './endpoints';
import type {
	BoltIotEndpointInputs,
	BoltIotEndpointOutputs,
} from './endpoints/types';
import {
	BoltIotEndpointInputSchemas,
	BoltIotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoltIotSchema } from './schema';

export type BoltIotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBoltIotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boltIotEndpointsNested>;
};

export type BoltIotContext = CorsairPluginContext<
	typeof BoltIotSchema,
	BoltIotPluginOptions
>;

export type BoltIotKeyBuilderContext = KeyBuilderContext<BoltIotPluginOptions>;

export type BoltIotBoundEndpoints = BindEndpoints<
	typeof boltIotEndpointsNested
>;

type BoltIotEndpoint<K extends keyof BoltIotEndpointOutputs> = CorsairEndpoint<
	BoltIotContext,
	BoltIotEndpointInputs[K],
	BoltIotEndpointOutputs[K]
>;

export type BoltIotEndpoints = {
	checkDeviceStatus: BoltIotEndpoint<'checkDeviceStatus'>;
	analogRead: BoltIotEndpoint<'analogRead'>;
	digitalWrite: BoltIotEndpoint<'digitalWrite'>;
	digitalRead: BoltIotEndpoint<'digitalRead'>;
	serialRead: BoltIotEndpoint<'serialRead'>;
	serialWrite: BoltIotEndpoint<'serialWrite'>;
	serialWriteRead: BoltIotEndpoint<'serialWriteRead'>;
};

const boltIotEndpointsNested = {
	device: {
		checkStatus: Device.checkStatus,
		analogRead: Device.analogRead,
		digitalWrite: Device.digitalWrite,
		digitalRead: Device.digitalRead,
	},
	serial: {
		read: Serial.read,
		write: Serial.write,
		writeRead: Serial.writeRead,
	},
} as const;

export const boltIotEndpointSchemas = {
	'device.checkStatus': {
		input: BoltIotEndpointInputSchemas.checkDeviceStatus,
		output: BoltIotEndpointOutputSchemas.checkDeviceStatus,
	},
	'device.analogRead': {
		input: BoltIotEndpointInputSchemas.analogRead,
		output: BoltIotEndpointOutputSchemas.analogRead,
	},
	'device.digitalWrite': {
		input: BoltIotEndpointInputSchemas.digitalWrite,
		output: BoltIotEndpointOutputSchemas.digitalWrite,
	},
	'device.digitalRead': {
		input: BoltIotEndpointInputSchemas.digitalRead,
		output: BoltIotEndpointOutputSchemas.digitalRead,
	},
	'serial.read': {
		input: BoltIotEndpointInputSchemas.serialRead,
		output: BoltIotEndpointOutputSchemas.serialRead,
	},
	'serial.write': {
		input: BoltIotEndpointInputSchemas.serialWrite,
		output: BoltIotEndpointOutputSchemas.serialWrite,
	},
	'serial.writeRead': {
		input: BoltIotEndpointInputSchemas.serialWriteRead,
		output: BoltIotEndpointOutputSchemas.serialWriteRead,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof boltIotEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const boltIotEndpointMeta = {
	'device.checkStatus': {
		riskLevel: 'read',
		description: 'Check whether a specified Bolt device is online',
	},
	'device.analogRead': {
		riskLevel: 'read',
		description:
			'Read the analog value (0-1023) from a specified pin on a Bolt device',
	},
	'device.digitalWrite': {
		riskLevel: 'write',
		description: 'Set a digital pin HIGH or LOW on a specified Bolt device',
	},
	'device.digitalRead': {
		riskLevel: 'read',
		description: 'Read the status of a digital pin on a specified Bolt device',
	},
	'serial.read': {
		riskLevel: 'read',
		description: 'Read incoming serial data from a Bolt device UART',
	},
	'serial.write': {
		riskLevel: 'write',
		description: 'Send ASCII serial data to a Bolt device over UART',
	},
	'serial.writeRead': {
		riskLevel: 'write',
		description: 'Send serial data and read reply immediately on a Bolt device',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boltIotEndpointsNested>;

export const boltIotAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoltIotPlugin<T extends BoltIotPluginOptions> = CorsairPlugin<
	'boltiot',
	typeof BoltIotSchema,
	typeof boltIotEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBoltIotPlugin = BaseBoltIotPlugin<BoltIotPluginOptions>;

export type ExternalBoltIotPlugin<T extends BoltIotPluginOptions> =
	BaseBoltIotPlugin<T>;

export function boltiot<const T extends BoltIotPluginOptions>(
	incomingOptions: BoltIotPluginOptions & T = {} as BoltIotPluginOptions & T,
): ExternalBoltIotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boltiot',
		authConfig: boltIotAuthConfig,
		schema: BoltIotSchema,
		options: options,
		hooks: options.hooks,
		endpoints: boltIotEndpointsNested,
		webhooks: {},
		endpointMeta: boltIotEndpointMeta,
		endpointSchemas: boltIotEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoltIotKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('boltiot', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('boltiot', 'api_key');
		},
	} satisfies InternalBoltIotPlugin;
}

export {
	BoltIotAPIError,
	BoltIotRateLimitError,
	makeBoltIotRequest,
} from './client';
export type {
	AnalogReadInput,
	AnalogReadOutput,
	BoltIotEndpointInputs,
	BoltIotEndpointOutputs,
	CheckDeviceStatusInput,
	CheckDeviceStatusOutput,
	DigitalReadInput,
	DigitalReadOutput,
	DigitalWriteInput,
	DigitalWriteOutput,
	SerialReadInput,
	SerialReadOutput,
	SerialWriteInput,
	SerialWriteOutput,
	SerialWriteReadInput,
	SerialWriteReadOutput,
} from './endpoints/types';
