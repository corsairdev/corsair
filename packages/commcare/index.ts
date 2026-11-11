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
import { Cases, Device, Directory, Forms, Groups, Users } from './endpoints';
import type {
	CommCareEndpointInputs,
	CommCareEndpointOutputs,
} from './endpoints/types';
import {
	CommCareEndpointInputSchemas,
	CommCareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CommCareSchema } from './schema';

export type CommCarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCommCarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof commCareEndpointsNested>;
};

export type CommCareContext = CorsairPluginContext<
	typeof CommCareSchema,
	CommCarePluginOptions
>;

export type CommCareKeyBuilderContext =
	KeyBuilderContext<CommCarePluginOptions>;

export type CommCareBoundEndpoints = BindEndpoints<
	typeof commCareEndpointsNested
>;

type CommCareEndpoint<K extends keyof CommCareEndpointOutputs> =
	CorsairEndpoint<
		CommCareContext,
		CommCareEndpointInputs[K],
		CommCareEndpointOutputs[K]
	>;

export type CommCareEndpoints = {
	formsList: CommCareEndpoint<'formsList'>;
	formsGet: CommCareEndpoint<'formsGet'>;
	formsBulkAction: CommCareEndpoint<'formsBulkAction'>;
	formsBulkActionStatus: CommCareEndpoint<'formsBulkActionStatus'>;
	casesList: CommCareEndpoint<'casesList'>;
	casesGet: CommCareEndpoint<'casesGet'>;
	casesBulkFetch: CommCareEndpoint<'casesBulkFetch'>;
	casesGetByExternalId: CommCareEndpoint<'casesGetByExternalId'>;
	usersList: CommCareEndpoint<'usersList'>;
	usersGet: CommCareEndpoint<'usersGet'>;
	usersCreate: CommCareEndpoint<'usersCreate'>;
	usersUpdate: CommCareEndpoint<'usersUpdate'>;
	usersDelete: CommCareEndpoint<'usersDelete'>;
	usersSendPasswordReset: CommCareEndpoint<'usersSendPasswordReset'>;
	groupsList: CommCareEndpoint<'groupsList'>;
	groupsGet: CommCareEndpoint<'groupsGet'>;
	groupsCreate: CommCareEndpoint<'groupsCreate'>;
	groupsUpdate: CommCareEndpoint<'groupsUpdate'>;
	webUsersList: CommCareEndpoint<'webUsersList'>;
	locationsList: CommCareEndpoint<'locationsList'>;
	locationsGet: CommCareEndpoint<'locationsGet'>;
	locationTypesList: CommCareEndpoint<'locationTypesList'>;
	locationTypesGet: CommCareEndpoint<'locationTypesGet'>;
	fixturesList: CommCareEndpoint<'fixturesList'>;
	fixturesGetItem: CommCareEndpoint<'fixturesGetItem'>;
	lookupTablesList: CommCareEndpoint<'lookupTablesList'>;
	lookupTablesGet: CommCareEndpoint<'lookupTablesGet'>;
	reportsList: CommCareEndpoint<'reportsList'>;
	reportsGetData: CommCareEndpoint<'reportsGetData'>;
	otaRestore: CommCareEndpoint<'otaRestore'>;
	submissionsSubmit: CommCareEndpoint<'submissionsSubmit'>;
	detExportsList: CommCareEndpoint<'detExportsList'>;
};

const commCareEndpointsNested = {
	forms: {
		list: Forms.list,
		get: Forms.get,
		bulkAction: Forms.bulkAction,
		bulkActionStatus: Forms.bulkActionStatus,
	},
	cases: {
		list: Cases.list,
		get: Cases.get,
		bulkFetch: Cases.bulkFetch,
		getByExternalId: Cases.getByExternalId,
	},
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		update: Users.update,
		delete: Users.delete,
		sendPasswordReset: Users.sendPasswordReset,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
		create: Groups.create,
		update: Groups.update,
	},
	webUsers: {
		list: Directory.listWebUsers,
	},
	locations: {
		list: Directory.listLocations,
		get: Directory.getLocation,
	},
	locationTypes: {
		list: Directory.listLocationTypes,
		get: Directory.getLocationType,
	},
	fixtures: {
		list: Directory.listFixtures,
		getItem: Directory.getFixtureItem,
	},
	lookupTables: {
		list: Directory.listLookupTables,
		get: Directory.getLookupTable,
	},
	reports: {
		list: Directory.listReports,
		getData: Directory.getReportData,
	},
	ota: {
		restore: Device.restore,
	},
	submissions: {
		submit: Device.submit,
	},
	detExports: {
		list: Directory.listDetExports,
	},
} as const;

export const commCareEndpointSchemas = {
	'forms.list': {
		input: CommCareEndpointInputSchemas.formsList,
		output: CommCareEndpointOutputSchemas.formsList,
	},
	'forms.get': {
		input: CommCareEndpointInputSchemas.formsGet,
		output: CommCareEndpointOutputSchemas.formsGet,
	},
	'forms.bulkAction': {
		input: CommCareEndpointInputSchemas.formsBulkAction,
		output: CommCareEndpointOutputSchemas.formsBulkAction,
	},
	'forms.bulkActionStatus': {
		input: CommCareEndpointInputSchemas.formsBulkActionStatus,
		output: CommCareEndpointOutputSchemas.formsBulkActionStatus,
	},
	'cases.list': {
		input: CommCareEndpointInputSchemas.casesList,
		output: CommCareEndpointOutputSchemas.casesList,
	},
	'cases.get': {
		input: CommCareEndpointInputSchemas.casesGet,
		output: CommCareEndpointOutputSchemas.casesGet,
	},
	'cases.bulkFetch': {
		input: CommCareEndpointInputSchemas.casesBulkFetch,
		output: CommCareEndpointOutputSchemas.casesBulkFetch,
	},
	'cases.getByExternalId': {
		input: CommCareEndpointInputSchemas.casesGetByExternalId,
		output: CommCareEndpointOutputSchemas.casesGetByExternalId,
	},
	'users.list': {
		input: CommCareEndpointInputSchemas.usersList,
		output: CommCareEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: CommCareEndpointInputSchemas.usersGet,
		output: CommCareEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: CommCareEndpointInputSchemas.usersCreate,
		output: CommCareEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: CommCareEndpointInputSchemas.usersUpdate,
		output: CommCareEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: CommCareEndpointInputSchemas.usersDelete,
		output: CommCareEndpointOutputSchemas.usersDelete,
	},
	'users.sendPasswordReset': {
		input: CommCareEndpointInputSchemas.usersSendPasswordReset,
		output: CommCareEndpointOutputSchemas.usersSendPasswordReset,
	},
	'groups.list': {
		input: CommCareEndpointInputSchemas.groupsList,
		output: CommCareEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: CommCareEndpointInputSchemas.groupsGet,
		output: CommCareEndpointOutputSchemas.groupsGet,
	},
	'groups.create': {
		input: CommCareEndpointInputSchemas.groupsCreate,
		output: CommCareEndpointOutputSchemas.groupsCreate,
	},
	'groups.update': {
		input: CommCareEndpointInputSchemas.groupsUpdate,
		output: CommCareEndpointOutputSchemas.groupsUpdate,
	},
	'webUsers.list': {
		input: CommCareEndpointInputSchemas.webUsersList,
		output: CommCareEndpointOutputSchemas.webUsersList,
	},
	'locations.list': {
		input: CommCareEndpointInputSchemas.locationsList,
		output: CommCareEndpointOutputSchemas.locationsList,
	},
	'locations.get': {
		input: CommCareEndpointInputSchemas.locationsGet,
		output: CommCareEndpointOutputSchemas.locationsGet,
	},
	'locationTypes.list': {
		input: CommCareEndpointInputSchemas.locationTypesList,
		output: CommCareEndpointOutputSchemas.locationTypesList,
	},
	'locationTypes.get': {
		input: CommCareEndpointInputSchemas.locationTypesGet,
		output: CommCareEndpointOutputSchemas.locationTypesGet,
	},
	'fixtures.list': {
		input: CommCareEndpointInputSchemas.fixturesList,
		output: CommCareEndpointOutputSchemas.fixturesList,
	},
	'fixtures.getItem': {
		input: CommCareEndpointInputSchemas.fixturesGetItem,
		output: CommCareEndpointOutputSchemas.fixturesGetItem,
	},
	'lookupTables.list': {
		input: CommCareEndpointInputSchemas.lookupTablesList,
		output: CommCareEndpointOutputSchemas.lookupTablesList,
	},
	'lookupTables.get': {
		input: CommCareEndpointInputSchemas.lookupTablesGet,
		output: CommCareEndpointOutputSchemas.lookupTablesGet,
	},
	'reports.list': {
		input: CommCareEndpointInputSchemas.reportsList,
		output: CommCareEndpointOutputSchemas.reportsList,
	},
	'reports.getData': {
		input: CommCareEndpointInputSchemas.reportsGetData,
		output: CommCareEndpointOutputSchemas.reportsGetData,
	},
	'ota.restore': {
		input: CommCareEndpointInputSchemas.otaRestore,
		output: CommCareEndpointOutputSchemas.otaRestore,
	},
	'submissions.submit': {
		input: CommCareEndpointInputSchemas.submissionsSubmit,
		output: CommCareEndpointOutputSchemas.submissionsSubmit,
	},
	'detExports.list': {
		input: CommCareEndpointInputSchemas.detExportsList,
		output: CommCareEndpointOutputSchemas.detExportsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof commCareEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// The bulk form action runs on CommCare after submit returns: `status`
// starts at pending and the docs name `failed` ("it is possible for it to
// be marked failed"). `complete` is the finished value. jobs.test.ts keeps
// this in step.
const BULK_ACTION_JOB = {
	idPath: 'id',
	status: {
		op: 'forms.bulkActionStatus',
		idArg: 'actionId',
		statusPath: 'status',
		done: ['complete'],
		failed: ['failed'],
	},
} as const;

const commCareEndpointMeta = {
	'forms.list': {
		riskLevel: 'read',
		description:
			'List submitted forms with paging and time-window or xmlns filters',
	},
	'forms.get': {
		riskLevel: 'read',
		description:
			'Read one submitted form, including its XForm content and metadata',
	},
	'forms.bulkAction': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive, unarchive, or permanently delete up to 5000 forms in one background job (delete needs the forms archived first); follow with forms.bulkActionStatus until status is complete or failed',
		job: BULK_ACTION_JOB,
	},
	'forms.bulkActionStatus': {
		riskLevel: 'read',
		description:
			'Where a bulk form action stands: pending, complete, or failed, with processed and succeeded counts',
	},
	'cases.list': {
		riskLevel: 'read',
		description:
			'List cases (Case Data API v2) with cursor paging and filters for case type, owner, name, closed state and indices',
	},
	'cases.get': {
		riskLevel: 'read',
		description: 'Read one case with its properties and indices',
	},
	'cases.bulkFetch': {
		riskLevel: 'read',
		description:
			'Fetch many cases by ID in one call, optionally limited to specific fields and properties',
	},
	'cases.getByExternalId': {
		riskLevel: 'read',
		description:
			'Look up a case by the external id the application assigned it',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the mobile workers in the project with paging',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Read one mobile worker: username, names, email, phones and user data',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a mobile worker account with an initial password',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Change a mobile worker: names, email, phone number or custom user data',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a mobile worker account',
	},
	'users.sendPasswordReset': {
		riskLevel: 'write',
		description: 'Email a password reset link to the mobile worker',
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List the reporting and case-sharing groups in the project with their members',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Read one group: name, reporting flag and member user ids',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a group, optionally with an initial member list',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Rename a group, toggle reporting, or replace its member list',
	},
	'webUsers.list': {
		riskLevel: 'read',
		description:
			'List the web users (dashboard accounts) in the project with their roles',
	},
	'locations.list': {
		riskLevel: 'read',
		description:
			'List project locations with site code, name and location type filters',
	},
	'locations.get': {
		riskLevel: 'read',
		description: 'Read one location with its type and parent',
	},
	'locationTypes.list': {
		riskLevel: 'read',
		description: 'List the location types defined in the project',
	},
	'locationTypes.get': {
		riskLevel: 'read',
		description: 'Read one location type by id',
	},
	'fixtures.list': {
		riskLevel: 'read',
		description:
			'List lookup-table fixture items, optionally filtered by fixture type',
	},
	'fixtures.getItem': {
		riskLevel: 'read',
		description: 'Read one fixture item by id',
	},
	'lookupTables.list': {
		riskLevel: 'read',
		description: 'List the lookup tables defined in the project',
	},
	'lookupTables.get': {
		riskLevel: 'read',
		description: 'Read one lookup table with its field definitions',
	},
	'reports.list': {
		riskLevel: 'read',
		description:
			'List the configurable reports defined in the project, with their ids',
	},
	'reports.getData': {
		riskLevel: 'read',
		description:
			'Run a configurable report and read its rows, with offset, limit (max 50) and the report filter parameters',
	},
	'ota.restore': {
		riskLevel: 'read',
		description:
			'Pull the OTA restore XML (user registration plus case blocks) for the API key owner in the domain; large payloads. HQ accepts the ApiKey header here and restores the account that owns the key',
	},
	'submissions.submit': {
		riskLevel: 'write',
		description:
			'Submit a complete XForm XML document to the OpenRosa receiver. Fails when HQ received the form but did not process it (nature submit_error or processing_failure); otherwise answers the message and its nature',
	},
	'detExports.list': {
		riskLevel: 'read',
		description: 'List the Data Export Tool export instances in the project',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof commCareEndpointsNested>;

export type BaseCommCarePlugin<T extends CommCarePluginOptions> = CorsairPlugin<
	'commcare',
	typeof CommCareSchema,
	typeof commCareEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalCommCarePlugin = BaseCommCarePlugin<CommCarePluginOptions>;

export type ExternalCommCarePlugin<T extends CommCarePluginOptions> =
	BaseCommCarePlugin<T>;

export function commcare<const T extends CommCarePluginOptions>(
	incomingOptions: CommCarePluginOptions & T = {} as CommCarePluginOptions & T,
): ExternalCommCarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'commcare',
		schema: CommCareSchema,
		options: options,
		hooks: options.hooks,
		endpoints: commCareEndpointsNested,
		webhooks: {},
		endpointMeta: commCareEndpointMeta,
		endpointSchemas: commCareEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CommCareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('commcare', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCommCarePlugin;
}

export { CommCareAPIError } from './client';

export type {
	CasesBulkFetchInput,
	CasesGetByExternalIdInput,
	CasesGetInput,
	CasesListInput,
	CommCareBulkAction,
	CommCareCase,
	CommCareDetExport,
	CommCareEndpointInputs,
	CommCareEndpointOutputs,
	CommCareForm,
	CommCareGroup,
	CommCareLocation,
	CommCareLocationType,
	CommCareLookupTable,
	CommCareReport,
	CommCareReportData,
	CommCareUser,
	DetExportsListInput,
	FixturesGetItemInput,
	FixturesListInput,
	FormsBulkActionInput,
	FormsBulkActionStatusInput,
	FormsGetInput,
	FormsListInput,
	GroupsCreateInput,
	GroupsGetInput,
	GroupsListInput,
	GroupsUpdateInput,
	LocationsGetInput,
	LocationsListInput,
	LocationTypesGetInput,
	LocationTypesListInput,
	LookupTablesGetInput,
	LookupTablesListInput,
	OtaRestoreInput,
	ReportsGetDataInput,
	ReportsListInput,
	SubmissionsSubmitInput,
	UsersCreateInput,
	UsersDeleteInput,
	UsersGetInput,
	UsersListInput,
	UsersSendPasswordResetInput,
	UsersUpdateInput,
	WebUsersListInput,
} from './endpoints/types';
