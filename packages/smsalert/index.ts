import type {
	BindEndpoints,
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
import { endpoints } from './endpoints';
import {
	SmsalertEndpointInputSchemas as inputs,
	SmsalertEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SmsalertSchema } from './schema';

export type SmsalertPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSmsalertPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type SmsalertContext = CorsairPluginContext<
	typeof SmsalertSchema,
	SmsalertPluginOptions
>;
export type SmsalertKeyBuilderContext =
	KeyBuilderContext<SmsalertPluginOptions>;
export type SmsalertBoundEndpoints = BindEndpoints<typeof endpoints>;

const schema = <K extends keyof typeof inputs>(name: K) => ({
	input: inputs[name],
	output: outputs[name],
});
export const smsalertEndpointSchemas = {
	'account.profile': schema('profile'),
	'account.register': schema('register'),
	'account.forgotPassword': schema('forgotPassword'),
	'account.changePassword': schema('changePassword'),
	'account.updateProfile': schema('updateProfile'),
	'account.balance': schema('balance'),
	'account.senders': schema('senders'),
	'groups.list': schema('listGroups'),
	'groups.create': schema('createGroup'),
	'groups.delete': schema('deleteGroup'),
	'groups.update': schema('updateGroup'),
	'groups.send': schema('sendGroup'),
	'contacts.list': schema('listContacts'),
	'contacts.create': schema('createContact'),
	'contacts.update': schema('updateContact'),
	'contacts.delete': schema('deleteContact'),
	'templates.list': schema('listTemplates'),
	'templates.create': schema('createTemplate'),
	'templates.update': schema('updateTemplate'),
	'templates.delete': schema('deleteTemplate'),
	'messages.send': schema('sendSms'),
	'schedules.update': schema('updateSchedule'),
	'schedules.cancel': schema('cancelSchedule'),
	'reports.sent': schema('sentReport'),
	'reports.delivery': schema('deliveryReport'),
	'otp.generate': schema('generateOtp'),
	'otp.validate': schema('validateOtp'),
	'shortUrls.create': schema('createShortUrl'),
	'shortUrls.delete': schema('deleteShortUrl'),
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

const smsalertEndpointMeta = {
	'account.profile': {
		riskLevel: 'read',
		description: 'Get the account profile',
	},
	'account.register': {
		riskLevel: 'write',
		description: 'Register an SMS Alert account',
	},
	'account.forgotPassword': {
		riskLevel: 'write',
		description: 'Request a password reset',
	},
	'account.changePassword': {
		riskLevel: 'write',
		description: 'Change the account password',
	},
	'account.updateProfile': {
		riskLevel: 'write',
		description: 'Update the account profile',
	},
	'account.balance': {
		riskLevel: 'read',
		description: 'Get available SMS credits',
	},
	'account.senders': { riskLevel: 'read', description: 'List sender IDs' },
	'groups.list': { riskLevel: 'read', description: 'List contact groups' },
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a contact group',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact group',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a contact group',
	},
	'groups.send': {
		riskLevel: 'write',
		description: 'Send SMS to contact groups',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts in a group',
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'templates.list': { riskLevel: 'read', description: 'List SMS templates' },
	'templates.create': {
		riskLevel: 'write',
		description: 'Create an SMS template',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update an SMS template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an SMS template',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send or schedule an SMS, optionally requesting delivery callbacks',
	},
	'schedules.update': {
		riskLevel: 'write',
		description: 'Change a scheduled campaign',
	},
	'schedules.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a scheduled campaign',
	},
	'reports.sent': { riskLevel: 'read', description: 'List sent SMS campaigns' },
	'reports.delivery': {
		riskLevel: 'read',
		description: 'Get delivery reports for a batch',
	},
	'otp.generate': {
		riskLevel: 'write',
		description: 'Generate and send an OTP',
	},
	'otp.validate': { riskLevel: 'write', description: 'Validate an OTP' },
	'shortUrls.create': { riskLevel: 'write', description: 'Create a short URL' },
	'shortUrls.delete': {
		riskLevel: 'destructive',
		description: 'Delete a short URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export const smsalertAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseSmsalertPlugin<T extends SmsalertPluginOptions> = CorsairPlugin<
	'smsalert',
	typeof SmsalertSchema,
	typeof endpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalSmsalertPlugin = BaseSmsalertPlugin<SmsalertPluginOptions>;
export type ExternalSmsalertPlugin<T extends SmsalertPluginOptions> =
	BaseSmsalertPlugin<T>;

export function smsalert(): ExternalSmsalertPlugin<{}>;
export function smsalert<const T extends SmsalertPluginOptions>(
	incomingOptions: SmsalertPluginOptions & T,
): ExternalSmsalertPlugin<T>;
export function smsalert(
	incomingOptions: SmsalertPluginOptions = {},
): InternalSmsalertPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'smsalert',
		authConfig: smsalertAuthConfig,
		schema: SmsalertSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: smsalertEndpointMeta,
		endpointSchemas: smsalertEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SmsalertKeyBuilderContext, source) => {
			if (
				ctx.meteredOperationId === 'account.register' ||
				ctx.meteredOperationId === 'account.forgotPassword'
			)
				return '';
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key')
				return (await ctx.keys.get_api_key()) ?? '';
			if (source === 'endpoint')
				throw new AuthMissingError('smsalert', 'api_key');
			return '';
		},
	} satisfies InternalSmsalertPlugin;
}
export { SmsalertError } from './client';
export type {
	SmsalertEndpointInputs,
	SmsalertEndpointOutputs,
} from './endpoints/types';
