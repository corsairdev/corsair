import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Databases,
	Devices,
	Limits,
	Questions,
	Scans,
	Services,
	Uploads,
	Users,
} from './endpoints';
import type {
	CodereadrEndpointInputs,
	CodereadrEndpointOutputs,
} from './endpoints/types';
import {
	CodereadrEndpointInputSchemas,
	CodereadrEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CodereadrSchema } from './schema';

export type CodereadrPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCodereadrPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codereadrEndpointsNested>;
};

export type CodereadrContext = CorsairPluginContext<
	typeof CodereadrSchema,
	CodereadrPluginOptions
>;

export type CodereadrKeyBuilderContext =
	KeyBuilderContext<CodereadrPluginOptions>;

export type CodereadrBoundEndpoints = BindEndpoints<
	typeof codereadrEndpointsNested
>;

type CodereadrEndpoint<K extends keyof CodereadrEndpointOutputs> =
	CorsairEndpoint<
		CodereadrContext,
		CodereadrEndpointInputs[K],
		CodereadrEndpointOutputs[K]
	>;

export type CodereadrEndpoints = {
	scansList: CodereadrEndpoint<'scansList'>;
	scansDelete: CodereadrEndpoint<'scansDelete'>;
	servicesList: CodereadrEndpoint<'servicesList'>;
	servicesCreate: CodereadrEndpoint<'servicesCreate'>;
	servicesUpdate: CodereadrEndpoint<'servicesUpdate'>;
	servicesDelete: CodereadrEndpoint<'servicesDelete'>;
	databasesList: CodereadrEndpoint<'databasesList'>;
	databasesCreate: CodereadrEndpoint<'databasesCreate'>;
	databasesUpdate: CodereadrEndpoint<'databasesUpdate'>;
	databasesDelete: CodereadrEndpoint<'databasesDelete'>;
	databasesClear: CodereadrEndpoint<'databasesClear'>;
	databasesShowValues: CodereadrEndpoint<'databasesShowValues'>;
	databasesUpsertValue: CodereadrEndpoint<'databasesUpsertValue'>;
	databasesUpsertValues: CodereadrEndpoint<'databasesUpsertValues'>;
	usersList: CodereadrEndpoint<'usersList'>;
	usersCreate: CodereadrEndpoint<'usersCreate'>;
	usersUpdate: CodereadrEndpoint<'usersUpdate'>;
	usersDelete: CodereadrEndpoint<'usersDelete'>;
	questionsList: CodereadrEndpoint<'questionsList'>;
	questionsCreate: CodereadrEndpoint<'questionsCreate'>;
	devicesList: CodereadrEndpoint<'devicesList'>;
	devicesUpdate: CodereadrEndpoint<'devicesUpdate'>;
	uploadsList: CodereadrEndpoint<'uploadsList'>;
	limitsRetrieve: CodereadrEndpoint<'limitsRetrieve'>;
};

const codereadrEndpointsNested = {
	scans: {
		list: Scans.list,
		delete: Scans.remove,
	},
	services: {
		list: Services.list,
		create: Services.create,
		update: Services.update,
		delete: Services.remove,
	},
	databases: {
		list: Databases.list,
		create: Databases.create,
		update: Databases.update,
		delete: Databases.remove,
		clear: Databases.clear,
		showValues: Databases.showValues,
		upsertValue: Databases.upsertValue,
		upsertValues: Databases.upsertValues,
	},
	users: {
		list: Users.list,
		create: Users.create,
		update: Users.update,
		delete: Users.remove,
	},
	questions: {
		list: Questions.list,
		create: Questions.create,
	},
	devices: {
		list: Devices.list,
		update: Devices.update,
	},
	uploads: {
		list: Uploads.list,
	},
	limits: {
		retrieve: Limits.retrieve,
	},
} as const;

export const codereadrEndpointSchemas = {
	'scans.list': {
		input: CodereadrEndpointInputSchemas.scansList,
		output: CodereadrEndpointOutputSchemas.scansList,
	},
	'scans.delete': {
		input: CodereadrEndpointInputSchemas.scansDelete,
		output: CodereadrEndpointOutputSchemas.scansDelete,
	},
	'services.list': {
		input: CodereadrEndpointInputSchemas.servicesList,
		output: CodereadrEndpointOutputSchemas.servicesList,
	},
	'services.create': {
		input: CodereadrEndpointInputSchemas.servicesCreate,
		output: CodereadrEndpointOutputSchemas.servicesCreate,
	},
	'services.update': {
		input: CodereadrEndpointInputSchemas.servicesUpdate,
		output: CodereadrEndpointOutputSchemas.servicesUpdate,
	},
	'services.delete': {
		input: CodereadrEndpointInputSchemas.servicesDelete,
		output: CodereadrEndpointOutputSchemas.servicesDelete,
	},
	'databases.list': {
		input: CodereadrEndpointInputSchemas.databasesList,
		output: CodereadrEndpointOutputSchemas.databasesList,
	},
	'databases.create': {
		input: CodereadrEndpointInputSchemas.databasesCreate,
		output: CodereadrEndpointOutputSchemas.databasesCreate,
	},
	'databases.update': {
		input: CodereadrEndpointInputSchemas.databasesUpdate,
		output: CodereadrEndpointOutputSchemas.databasesUpdate,
	},
	'databases.delete': {
		input: CodereadrEndpointInputSchemas.databasesDelete,
		output: CodereadrEndpointOutputSchemas.databasesDelete,
	},
	'databases.clear': {
		input: CodereadrEndpointInputSchemas.databasesClear,
		output: CodereadrEndpointOutputSchemas.databasesClear,
	},
	'databases.showValues': {
		input: CodereadrEndpointInputSchemas.databasesShowValues,
		output: CodereadrEndpointOutputSchemas.databasesShowValues,
	},
	'databases.upsertValue': {
		input: CodereadrEndpointInputSchemas.databasesUpsertValue,
		output: CodereadrEndpointOutputSchemas.databasesUpsertValue,
	},
	'databases.upsertValues': {
		input: CodereadrEndpointInputSchemas.databasesUpsertValues,
		output: CodereadrEndpointOutputSchemas.databasesUpsertValues,
	},
	'users.list': {
		input: CodereadrEndpointInputSchemas.usersList,
		output: CodereadrEndpointOutputSchemas.usersList,
	},
	'users.create': {
		input: CodereadrEndpointInputSchemas.usersCreate,
		output: CodereadrEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: CodereadrEndpointInputSchemas.usersUpdate,
		output: CodereadrEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: CodereadrEndpointInputSchemas.usersDelete,
		output: CodereadrEndpointOutputSchemas.usersDelete,
	},
	'questions.list': {
		input: CodereadrEndpointInputSchemas.questionsList,
		output: CodereadrEndpointOutputSchemas.questionsList,
	},
	'questions.create': {
		input: CodereadrEndpointInputSchemas.questionsCreate,
		output: CodereadrEndpointOutputSchemas.questionsCreate,
	},
	'devices.list': {
		input: CodereadrEndpointInputSchemas.devicesList,
		output: CodereadrEndpointOutputSchemas.devicesList,
	},
	'devices.update': {
		input: CodereadrEndpointInputSchemas.devicesUpdate,
		output: CodereadrEndpointOutputSchemas.devicesUpdate,
	},
	'uploads.list': {
		input: CodereadrEndpointInputSchemas.uploadsList,
		output: CodereadrEndpointOutputSchemas.uploadsList,
	},
	'limits.retrieve': {
		input: CodereadrEndpointInputSchemas.limitsRetrieve,
		output: CodereadrEndpointOutputSchemas.limitsRetrieve,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof codereadrEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const codereadrEndpointMeta = {
	'scans.list': {
		riskLevel: 'read',
		description:
			'Search and page through scan records with filters on date, service, device, user, status, barcode value and scan properties, returning each scan with its answers',
	},
	'scans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete one or more scan records; deleted scans cannot be restored',
	},
	'services.list': {
		riskLevel: 'read',
		description:
			'List services with their validation method, postback URL, linked database and authorized users and questions',
	},
	'services.create': {
		riskLevel: 'write',
		description:
			'Create a service: how scans are validated (record, database, postback, webview) plus scan behaviour such as symbologies, auto-sync and scanner configuration',
	},
	'services.update': {
		riskLevel: 'write',
		description:
			'Update a service; omitted variables keep their current value, except symbologies, which reset to the default set when left out',
	},
	'services.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete one or more services, or every service with `all`; deleted services cannot be restored',
	},
	'databases.list': {
		riskLevel: 'read',
		description:
			'List validation databases with their stored value count and linked services, optionally at a lighter info level',
	},
	'databases.create': {
		riskLevel: 'write',
		description:
			'Create a database for validating barcode values; case sensitivity is fixed at creation',
	},
	'databases.update': {
		riskLevel: 'write',
		description:
			'Rename a validation database; its stored barcode values and linked services are unchanged',
	},
	'databases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a database and every value in it; refused while a service still uses it',
	},
	'databases.clear': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete every value in a database while keeping the database itself; the values cannot be restored',
	},
	'databases.showValues': {
		riskLevel: 'read',
		description:
			'Search and page through the barcode values stored in a database, with exact and partial match filters and a validity filter',
	},
	'databases.upsertValue': {
		riskLevel: 'write',
		description:
			'Insert or update one barcode value with its response text and validity, without checking whether it already exists',
	},
	'databases.upsertValues': {
		riskLevel: 'write',
		description:
			'Insert or update up to 100 barcode values in one request, each with its own database, response text, validity and trim setting',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List app users with their authorized services, device limit and creation date',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Create an app user; an email address sends an invitation and requires the user to accept it before signing in',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Update an app user: rename, change the password, or set the device limit',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete app users, or every app user with `all`; the account owner cannot be deleted',
	},
	'questions.list': {
		riskLevel: 'read',
		description:
			'List data collection questions with their type and answer options',
	},
	'questions.create': {
		riskLevel: 'write',
		description:
			'Create a data collection question, shown to the app user before or after a scan; choice types need answer options added separately',
	},
	'devices.list': {
		riskLevel: 'read',
		description:
			'List the devices that have activated the app, with their UDID',
	},
	'devices.update': {
		riskLevel: 'write',
		description:
			'Rename a device, which changes how the device appears in scan records and the account device list',
	},
	'uploads.list': {
		riskLevel: 'read',
		description:
			'List scan uploads from devices, with the device, service, user, status and scan count for each',
	},
	'limits.retrieve': {
		riskLevel: 'read',
		description:
			'Read the account API request limits remaining for the current minute and day',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof codereadrEndpointsNested
>;

export type BaseCodereadrPlugin<T extends CodereadrPluginOptions> =
	CorsairPlugin<
		'codereadr',
		typeof CodereadrSchema,
		typeof codereadrEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCodereadrPlugin =
	BaseCodereadrPlugin<CodereadrPluginOptions>;

export type ExternalCodereadrPlugin<T extends CodereadrPluginOptions> =
	BaseCodereadrPlugin<T>;

export function codereadr<const T extends CodereadrPluginOptions>(
	incomingOptions: CodereadrPluginOptions & T = {} as CodereadrPluginOptions &
		T,
): ExternalCodereadrPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'codereadr',
		schema: CodereadrSchema,
		options: options,
		hooks: options.hooks,
		endpoints: codereadrEndpointsNested,
		webhooks: {},
		endpointMeta: codereadrEndpointMeta,
		endpointSchemas: codereadrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CodereadrKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('codereadr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCodereadrPlugin;
}

export { CodereadrAPIError, parseCodereadrXml } from './client';

export type {
	CodereadrDatabase,
	CodereadrDatabaseValue,
	CodereadrDatabaseValueWrite,
	CodereadrDevice,
	CodereadrEndpointInputs,
	CodereadrEndpointOutputs,
	CodereadrQuestion,
	CodereadrScan,
	CodereadrScanAnswer,
	CodereadrService,
	CodereadrUpload,
	CodereadrUser,
	DatabasesCreateInput,
	DatabasesCreateResponse,
	DatabasesListInput,
	DatabasesListResponse,
	DatabasesShowValuesInput,
	DatabasesShowValuesResponse,
	DatabasesUpdateInput,
	DatabasesUpdateResponse,
	DatabasesUpsertValueInput,
	DatabasesUpsertValuesInput,
	DatabaseTargetInput,
	DatabaseTargetResponse,
	DevicesListInput,
	DevicesListResponse,
	DevicesUpdateInput,
	DevicesUpdateResponse,
	LimitsRetrieveInput,
	LimitsRetrieveResponse,
	QuestionsCreateInput,
	QuestionsCreateResponse,
	QuestionsListInput,
	QuestionsListResponse,
	ScansDeleteInput,
	ScansDeleteResponse,
	ScansListInput,
	ScansListResponse,
	ServicesCreateInput,
	ServicesCreateResponse,
	ServicesDeleteInput,
	ServicesDeleteResponse,
	ServicesListInput,
	ServicesListResponse,
	ServicesUpdateInput,
	ServicesUpdateResponse,
	UploadsListInput,
	UploadsListResponse,
	UsersCreateInput,
	UsersCreateResponse,
	UsersDeleteInput,
	UsersDeleteResponse,
	UsersListInput,
	UsersListResponse,
	UsersUpdateInput,
	UsersUpdateResponse,
} from './endpoints/types';
