import type {
	CorsairPlugin,
	KeyBuilderContext,
	PluginAuthConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	Counters,
	Data,
	Files,
	Hive,
	Messaging,
	Permissions,
	Users,
} from './endpoints';
import type { BackendlessPluginOptions } from './endpoints/types';
import {
	BackendlessAuthConfig,
	BackendlessEndpointInputSchemas,
	BackendlessEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BackendlessSchema } from './schema';

export {
	BackendlessAPIError,
	BackendlessClient,
	redactSecrets,
} from './client';
export type { BackendlessPluginOptions } from './endpoints/types';

export const backendlessEndpoints = {
	files: {
		copy: Files.copy,
		move: Files.move,
		delete: Files.delete,
		createDirectory: Files.createDirectory,
		deleteDirectory: Files.deleteDirectory,
		list: Files.list,
		count: Files.count,
	},
	data: { retrieve: Data.retrieve },
	hive: {
		create: Hive.create,
		values: Hive.values,
		keyItems: Hive.keyItems,
		mapPut: Hive.mapPut,
	},
	counters: { get: Counters.get, set: Counters.set, reset: Counters.reset },
	users: {
		register: Users.register,
		login: Users.login,
		logout: Users.logout,
		passwordRecovery: Users.passwordRecovery,
		update: Users.update,
		delete: Users.delete,
		find: Users.find,
		validateToken: Users.validateToken,
	},
	permissions: { grant: Permissions.grant, revoke: Permissions.revoke },
	messaging: { publish: Messaging.publish },
} as const;

export type BackendlessEndpoints = typeof backendlessEndpoints;
const backendlessWebhooksNested = {} as const;

export const backendlessEndpointSchemas = {
	'files.copy': {
		input: BackendlessEndpointInputSchemas.filesCopy,
		output: BackendlessEndpointOutputSchemas.filesCopy,
	},
	'files.move': {
		input: BackendlessEndpointInputSchemas.filesMove,
		output: BackendlessEndpointOutputSchemas.filesMove,
	},
	'files.delete': {
		input: BackendlessEndpointInputSchemas.filesDelete,
		output: BackendlessEndpointOutputSchemas.filesDelete,
	},
	'files.createDirectory': {
		input: BackendlessEndpointInputSchemas.filesCreateDirectory,
		output: BackendlessEndpointOutputSchemas.filesCreateDirectory,
	},
	'files.deleteDirectory': {
		input: BackendlessEndpointInputSchemas.filesDeleteDirectory,
		output: BackendlessEndpointOutputSchemas.filesDeleteDirectory,
	},
	'files.list': {
		input: BackendlessEndpointInputSchemas.filesList,
		output: BackendlessEndpointOutputSchemas.filesList,
	},
	'files.count': {
		input: BackendlessEndpointInputSchemas.filesCount,
		output: BackendlessEndpointOutputSchemas.filesCount,
	},
	'data.retrieve': {
		input: BackendlessEndpointInputSchemas.dataRetrieve,
		output: BackendlessEndpointOutputSchemas.dataRetrieve,
	},
	'hive.create': {
		input: BackendlessEndpointInputSchemas.hiveCreate,
		output: BackendlessEndpointOutputSchemas.hiveCreate,
	},
	'hive.values': {
		input: BackendlessEndpointInputSchemas.hiveValues,
		output: BackendlessEndpointOutputSchemas.hiveValues,
	},
	'hive.keyItems': {
		input: BackendlessEndpointInputSchemas.hiveKeyItems,
		output: BackendlessEndpointOutputSchemas.hiveKeyItems,
	},
	'hive.mapPut': {
		input: BackendlessEndpointInputSchemas.hiveMapPut,
		output: BackendlessEndpointOutputSchemas.hiveMapPut,
	},
	'counters.get': {
		input: BackendlessEndpointInputSchemas.counterGet,
		output: BackendlessEndpointOutputSchemas.counterGet,
	},
	'counters.set': {
		input: BackendlessEndpointInputSchemas.counterSet,
		output: BackendlessEndpointOutputSchemas.counterSet,
	},
	'counters.reset': {
		input: BackendlessEndpointInputSchemas.counterReset,
		output: BackendlessEndpointOutputSchemas.counterReset,
	},
	'users.register': {
		input: BackendlessEndpointInputSchemas.userRegistration,
		output: BackendlessEndpointOutputSchemas.userRegistration,
	},
	'users.login': {
		input: BackendlessEndpointInputSchemas.userLogin,
		output: BackendlessEndpointOutputSchemas.userLogin,
	},
	'users.logout': {
		input: BackendlessEndpointInputSchemas.userLogout,
		output: BackendlessEndpointOutputSchemas.userLogout,
	},
	'users.passwordRecovery': {
		input: BackendlessEndpointInputSchemas.userPasswordRecovery,
		output: BackendlessEndpointOutputSchemas.userPasswordRecovery,
	},
	'users.update': {
		input: BackendlessEndpointInputSchemas.userUpdate,
		output: BackendlessEndpointOutputSchemas.userUpdate,
	},
	'users.delete': {
		input: BackendlessEndpointInputSchemas.userDelete,
		output: BackendlessEndpointOutputSchemas.userDelete,
	},
	'users.find': {
		input: BackendlessEndpointInputSchemas.userFind,
		output: BackendlessEndpointOutputSchemas.userFind,
	},
	'users.validateToken': {
		input: BackendlessEndpointInputSchemas.userValidateToken,
		output: BackendlessEndpointOutputSchemas.userValidateToken,
	},
	'permissions.grant': {
		input: BackendlessEndpointInputSchemas.permission,
		output: BackendlessEndpointOutputSchemas.permission,
	},
	'permissions.revoke': {
		input: BackendlessEndpointInputSchemas.permission,
		output: BackendlessEndpointOutputSchemas.permission,
	},
	'messaging.publish': {
		input: BackendlessEndpointInputSchemas.messagePublish,
		output: BackendlessEndpointOutputSchemas.messagePublish,
	},
} as const;

export const backendlessEndpointMeta = {
	'files.copy': {
		riskLevel: 'write',
		description: 'Copy a Backendless file or directory.',
	},
	'files.move': {
		riskLevel: 'write',
		description: 'Move a Backendless file or directory.',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Backendless file.',
	},
	'files.createDirectory': {
		riskLevel: 'write',
		description: 'Create a Backendless directory.',
	},
	'files.deleteDirectory': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Backendless directory.',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List Backendless files and directories.',
	},
	'files.count': {
		riskLevel: 'read',
		description: 'Count Backendless files and directories.',
	},
	'data.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve Backendless database objects.',
	},
	'hive.create': {
		riskLevel: 'write',
		description: 'Create a Backendless Hive.',
	},
	'hive.values': {
		riskLevel: 'read',
		description: 'Retrieve values from a Backendless Hive map.',
	},
	'hive.keyItems': {
		riskLevel: 'read',
		description: 'Retrieve items from a Backendless Hive list.',
	},
	'hive.mapPut': {
		riskLevel: 'write',
		description: 'Insert or update a Backendless Hive map value.',
	},
	'counters.get': {
		riskLevel: 'read',
		description: 'Read a Backendless atomic counter.',
	},
	'counters.set': {
		riskLevel: 'write',
		description: 'Conditionally update a Backendless atomic counter.',
	},
	'counters.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset a Backendless atomic counter.',
	},
	'users.register': {
		riskLevel: 'write',
		description: 'Register a Backendless user.',
	},
	'users.login': {
		riskLevel: 'write',
		description: 'Log in to Backendless and return a user token.',
	},
	'users.logout': {
		riskLevel: 'write',
		description: 'Log out the current Backendless user session.',
	},
	'users.passwordRecovery': {
		riskLevel: 'write',
		description: 'Request Backendless password recovery.',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a Backendless user.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Backendless user.',
	},
	'users.find': {
		riskLevel: 'read',
		description: 'Find a Backendless user by object ID.',
	},
	'users.validateToken': {
		riskLevel: 'read',
		description: 'Validate a Backendless user token.',
	},
	'permissions.grant': {
		riskLevel: 'destructive',
		description: 'Grant a Backendless data permission; security-sensitive.',
	},
	'permissions.revoke': {
		riskLevel: 'destructive',
		description: 'Revoke a Backendless data permission; security-sensitive.',
	},
	'messaging.publish': {
		riskLevel: 'write',
		description: 'Publish a message to a Backendless channel.',
	},
} satisfies RequiredPluginEndpointMeta<typeof backendlessEndpoints>;

const defaultAuthType = 'api_key' as const;
export const backendlessAuthConfig =
	BackendlessAuthConfig satisfies PluginAuthConfig;

export type BackendlessKeyBuilderContext = KeyBuilderContext<
	BackendlessPluginOptions,
	typeof backendlessAuthConfig
>;
export type BaseBackendlessPlugin<
	T extends BackendlessPluginOptions = BackendlessPluginOptions,
> = CorsairPlugin<
	'backendless',
	typeof BackendlessSchema,
	typeof backendlessEndpoints,
	typeof backendlessWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof backendlessAuthConfig
>;

export function backendless<const T extends BackendlessPluginOptions>(
	incomingOptions: BackendlessPluginOptions &
		T = {} as BackendlessPluginOptions & T,
): BaseBackendlessPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as T & { authType: typeof defaultAuthType };
	return {
		id: 'backendless',
		schema: BackendlessSchema,
		options,
		endpoints: backendlessEndpoints,
		endpointMeta: backendlessEndpointMeta,
		endpointSchemas: backendlessEndpointSchemas,
		authConfig: backendlessAuthConfig,
		webhooks: backendlessWebhooksNested,
		errorHandlers: {
			...errorHandlers,
			...incomingOptions.errorHandlers,
		},
		keyBuilder: async (ctx: BackendlessKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key || options.restApiKey)
				return options.key ?? options.restApiKey ?? '';
			try {
				return (await ctx.keys?.get_api_key()) ?? '';
			} catch (error) {
				if (error instanceof Error && /no dek found/i.test(error.message))
					return '';
				throw error;
			}
		},
	} as BaseBackendlessPlugin<T>;
}
