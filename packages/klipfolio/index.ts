import type {
	AuthTypes,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext as KeyBuilderContextBase,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createClient,
	createClientSettings,
	deleteClient,
	deleteClientProperties,
	deleteClientShareRight,
	enableDirectBillingClient,
	extendTrialClient,
	listClients,
	retrieveClient,
	retrieveClientFeatures,
	retrieveClientProperties,
	retrieveClientResources,
	retrieveClientSettings,
	retrieveClientShareRights,
	setClientShareRights,
	updateClient,
	updateClientFeatures,
	updateClientProperties,
	updateClientResources,
} from './endpoints/clients';
import {
	createDatasource,
	createDatasourceInstances,
	deleteDatasource,
	deleteDatasourceInstances,
	deleteDatasourceInstancesProperties,
	deleteDatasourceProperties,
	deleteDatasourceShareRight,
	deleteInstancesDatasource,
	disableDatasource,
	enableDatasource,
	importDatasource,
	listDatasourceInstances,
	listDatasources,
	refreshDatasource,
	refreshDatasourceInstances,
	retrieveDatasource,
	retrieveDatasourceInstances,
	retrieveDatasourceInstancesData,
	retrieveDatasourceInstancesProperties,
	retrieveDatasourceProperties,
	retrieveDatasourceShareRights,
	setDatasourceShareRights,
	updateDatasource,
	updateDatasourceInstancesData,
	updateDatasourceInstancesProperties,
	updateDatasourceProperties,
} from './endpoints/datasources';
import {
	addGroupDefaultTabs,
	createGroup,
	deleteGroup,
	deleteGroupDefaultTab,
	deleteGroupUser,
	listGroups,
	retrieveGroup,
	retrieveGroupDefaultTab,
	retrieveGroupDefaultTabs,
	retrieveGroupUsers,
	updateGroup,
	updateGroupDefaultTab,
	updateGroupUser,
} from './endpoints/groups';
import {
	createKlip,
	createKlipAnnotations,
	deleteKlip,
	deleteKlipAnnotation,
	deleteKlipShareRights,
	importKlip,
	listKlips,
	retrieveKlip,
	retrieveKlipAnnotation,
	retrieveKlipAnnotations,
	retrieveKlipClientInstances,
	retrieveKlipSchema,
	retrieveKlipShareRights,
	setKlipShareRights,
	updateFromParentKlip,
	updateKlip,
	updateKlipAnnotation,
	updateKlipSchema,
} from './endpoints/klips';
import {
	createDashboardPublishedLinks,
	deleteDashboardPublishedLinks,
	listDashboardPublishedLinks,
	retrieveProfile,
	updateDashboardPublishedLinks,
} from './endpoints/misc';
import {
	createRole,
	deleteRole,
	deleteRolePermissions,
	deleteRoleUser,
	listRoles,
	retrieveRole,
	retrieveRolePermissions,
	retrieveRoleUsers,
	updateRole,
	updateRolePermissions,
	updateRoleUser,
} from './endpoints/roles';
import {
	createTab,
	deleteTab,
	deleteTabKlipInstance,
	deleteTabShareRight,
	importTab,
	listTabs,
	retrieveTab,
	retrieveTabKlipInstances,
	retrieveTabLayout,
	retrieveTabShareRights,
	setTabShareRights,
	updateTab,
	updateTabKlipInstances,
	updateTabLayout,
} from './endpoints/tabs';
import type {
	KlipfolioEndpointInputs,
	KlipfolioEndpointOutputs,
} from './endpoints/types';
import {
	KlipfolioEndpointInputSchemas,
	KlipfolioEndpointOutputSchemas,
} from './endpoints/types';
import {
	createUser,
	deleteUser,
	deleteUserGroup,
	deleteUserProperties,
	deleteUserRole,
	deleteUserTabInstance,
	listUsers,
	resendInviteUser,
	resetPasswordUser,
	retrieveUser,
	retrieveUserGroups,
	retrieveUserProperties,
	retrieveUserRoles,
	retrieveUserTabInstances,
	updateUser,
	updateUserGroup,
	updateUserProperties,
	updateUserRole,
	updateUserTabInstances,
} from './endpoints/users';
import { errorHandlers } from './error-handlers';
import { KlipfolioSchema } from './schema';

export type KlipfolioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKlipfolioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof klipfolioEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key';

export type KlipfolioContext = CorsairPluginContext<
	typeof KlipfolioSchema,
	KlipfolioPluginOptions
>;

export type KlipfolioKeyBuilderContext =
	KeyBuilderContextBase<KlipfolioPluginOptions>;

export const klipfolioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKlipfolioPlugin<T extends KlipfolioPluginOptions> =
	CorsairPlugin<
		'klipfolio',
		typeof KlipfolioSchema,
		typeof klipfolioEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalKlipfolioPlugin =
	BaseKlipfolioPlugin<KlipfolioPluginOptions>;

export type ExternalKlipfolioPlugin<T extends KlipfolioPluginOptions> =
	BaseKlipfolioPlugin<T>;

export type KlipfolioEndpoints = {
	[K in keyof KlipfolioEndpointInputs]: CorsairEndpoint<
		KlipfolioContext,
		KlipfolioEndpointInputs[K],
		KlipfolioEndpointOutputs[K]
	>;
};

// Binds every Klipfolio endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withKlipfolioSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				klipfolioEndpointSchemas[
					operation as keyof typeof klipfolioEndpointSchemas
				];
			if (!schema) {
				throw new Error(`Missing Klipfolio endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withKlipfolioSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const klipfolioEndpointsNested = {
	clients: {
		listClients: listClients,
		retrieveClient: retrieveClient,
		createClient: createClient,
		updateClient: updateClient,
		deleteClient: deleteClient,
		enableDirectBillingClient: enableDirectBillingClient,
		extendTrialClient: extendTrialClient,
		retrieveClientFeatures: retrieveClientFeatures,
		updateClientFeatures: updateClientFeatures,
		retrieveClientProperties: retrieveClientProperties,
		updateClientProperties: updateClientProperties,
		deleteClientProperties: deleteClientProperties,
		retrieveClientResources: retrieveClientResources,
		updateClientResources: updateClientResources,
		retrieveClientSettings: retrieveClientSettings,
		createClientSettings: createClientSettings,
		retrieveClientShareRights: retrieveClientShareRights,
		setClientShareRights: setClientShareRights,
		deleteClientShareRight: deleteClientShareRight,
	},
	datasources: {
		listDatasources: listDatasources,
		retrieveDatasource: retrieveDatasource,
		createDatasource: createDatasource,
		updateDatasource: updateDatasource,
		deleteDatasource: deleteDatasource,
		enableDatasource: enableDatasource,
		disableDatasource: disableDatasource,
		importDatasource: importDatasource,
		deleteInstancesDatasource: deleteInstancesDatasource,
		retrieveDatasourceProperties: retrieveDatasourceProperties,
		updateDatasourceProperties: updateDatasourceProperties,
		deleteDatasourceProperties: deleteDatasourceProperties,
		retrieveDatasourceShareRights: retrieveDatasourceShareRights,
		setDatasourceShareRights: setDatasourceShareRights,
		deleteDatasourceShareRight: deleteDatasourceShareRight,
		listDatasourceInstances: listDatasourceInstances,
		retrieveDatasourceInstances: retrieveDatasourceInstances,
		createDatasourceInstances: createDatasourceInstances,
		deleteDatasourceInstances: deleteDatasourceInstances,
		retrieveDatasourceInstancesData: retrieveDatasourceInstancesData,
		updateDatasourceInstancesData: updateDatasourceInstancesData,
		refreshDatasourceInstances: refreshDatasourceInstances,
		refreshDatasource: refreshDatasource,
		retrieveDatasourceInstancesProperties:
			retrieveDatasourceInstancesProperties,
		updateDatasourceInstancesProperties: updateDatasourceInstancesProperties,
		deleteDatasourceInstancesProperties: deleteDatasourceInstancesProperties,
	},
	groups: {
		listGroups: listGroups,
		retrieveGroup: retrieveGroup,
		createGroup: createGroup,
		updateGroup: updateGroup,
		deleteGroup: deleteGroup,
		retrieveGroupDefaultTabs: retrieveGroupDefaultTabs,
		retrieveGroupDefaultTab: retrieveGroupDefaultTab,
		addGroupDefaultTabs: addGroupDefaultTabs,
		updateGroupDefaultTab: updateGroupDefaultTab,
		deleteGroupDefaultTab: deleteGroupDefaultTab,
		retrieveGroupUsers: retrieveGroupUsers,
		updateGroupUser: updateGroupUser,
		deleteGroupUser: deleteGroupUser,
	},
	klips: {
		listKlips: listKlips,
		retrieveKlip: retrieveKlip,
		retrieveKlipClientInstances: retrieveKlipClientInstances,
		createKlip: createKlip,
		updateKlip: updateKlip,
		deleteKlip: deleteKlip,
		retrieveKlipAnnotations: retrieveKlipAnnotations,
		retrieveKlipAnnotation: retrieveKlipAnnotation,
		createKlipAnnotations: createKlipAnnotations,
		updateKlipAnnotation: updateKlipAnnotation,
		deleteKlipAnnotation: deleteKlipAnnotation,
		updateFromParentKlip: updateFromParentKlip,
		retrieveKlipSchema: retrieveKlipSchema,
		updateKlipSchema: updateKlipSchema,
		retrieveKlipShareRights: retrieveKlipShareRights,
		setKlipShareRights: setKlipShareRights,
		deleteKlipShareRights: deleteKlipShareRights,
		importKlip: importKlip,
	},
	misc: {
		retrieveProfile: retrieveProfile,
		createDashboardPublishedLinks: createDashboardPublishedLinks,
		listDashboardPublishedLinks: listDashboardPublishedLinks,
		updateDashboardPublishedLinks: updateDashboardPublishedLinks,
		deleteDashboardPublishedLinks: deleteDashboardPublishedLinks,
	},
	roles: {
		listRoles: listRoles,
		retrieveRole: retrieveRole,
		updateRole: updateRole,
		createRole: createRole,
		deleteRole: deleteRole,
		retrieveRoleUsers: retrieveRoleUsers,
		updateRoleUser: updateRoleUser,
		deleteRoleUser: deleteRoleUser,
		retrieveRolePermissions: retrieveRolePermissions,
		updateRolePermissions: updateRolePermissions,
		deleteRolePermissions: deleteRolePermissions,
	},
	tabs: {
		listTabs: listTabs,
		retrieveTab: retrieveTab,
		createTab: createTab,
		updateTab: updateTab,
		deleteTab: deleteTab,
		retrieveTabKlipInstances: retrieveTabKlipInstances,
		updateTabKlipInstances: updateTabKlipInstances,
		deleteTabKlipInstance: deleteTabKlipInstance,
		retrieveTabLayout: retrieveTabLayout,
		updateTabLayout: updateTabLayout,
		retrieveTabShareRights: retrieveTabShareRights,
		setTabShareRights: setTabShareRights,
		deleteTabShareRight: deleteTabShareRight,
		importTab: importTab,
	},
	users: {
		listUsers: listUsers,
		retrieveUser: retrieveUser,
		createUser: createUser,
		updateUser: updateUser,
		deleteUser: deleteUser,
		retrieveUserGroups: retrieveUserGroups,
		updateUserGroup: updateUserGroup,
		deleteUserGroup: deleteUserGroup,
		resendInviteUser: resendInviteUser,
		resetPasswordUser: resetPasswordUser,
		retrieveUserProperties: retrieveUserProperties,
		updateUserProperties: updateUserProperties,
		deleteUserProperties: deleteUserProperties,
		retrieveUserRoles: retrieveUserRoles,
		updateUserRole: updateUserRole,
		deleteUserRole: deleteUserRole,
		retrieveUserTabInstances: retrieveUserTabInstances,
		updateUserTabInstances: updateUserTabInstances,
		deleteUserTabInstance: deleteUserTabInstance,
	},
} as const;

export const klipfolioEndpointMeta = {
	'clients.listClients': {
		riskLevel: 'read',
		description: 'List Clients on Klipfolio',
	},
	'clients.retrieveClient': {
		riskLevel: 'read',
		description: 'Get Client on Klipfolio',
	},
	'clients.createClient': {
		riskLevel: 'write',
		description: 'Create Client on Klipfolio',
	},
	'clients.updateClient': {
		riskLevel: 'write',
		description: 'Update Client on Klipfolio',
	},
	'clients.deleteClient': {
		riskLevel: 'destructive',
		description: 'Delete Client on Klipfolio',
	},
	'clients.enableDirectBillingClient': {
		riskLevel: 'write',
		description: 'Enable Direct Billing on Klipfolio',
	},
	'clients.extendTrialClient': {
		riskLevel: 'write',
		description: 'Extend Trial on Klipfolio',
	},
	'clients.retrieveClientFeatures': {
		riskLevel: 'read',
		description: 'Get Client Features on Klipfolio',
	},
	'clients.updateClientFeatures': {
		riskLevel: 'write',
		description: 'Update Client Features on Klipfolio',
	},
	'clients.retrieveClientProperties': {
		riskLevel: 'read',
		description: 'Get Client Properties on Klipfolio',
	},
	'clients.updateClientProperties': {
		riskLevel: 'write',
		description: 'Update Client Properties on Klipfolio',
	},
	'clients.deleteClientProperties': {
		riskLevel: 'destructive',
		description: 'Delete Client Property on Klipfolio',
	},
	'clients.retrieveClientResources': {
		riskLevel: 'read',
		description: 'Get Client Resources on Klipfolio',
	},
	'clients.updateClientResources': {
		riskLevel: 'write',
		description: 'Update Client Resources on Klipfolio',
	},
	'clients.retrieveClientSettings': {
		riskLevel: 'read',
		description: 'Get Client Settings on Klipfolio',
	},
	'clients.createClientSettings': {
		riskLevel: 'write',
		description: 'Set Client Settings on Klipfolio',
	},
	'clients.retrieveClientShareRights': {
		riskLevel: 'read',
		description: 'Get Client Share Rights on Klipfolio',
	},
	'clients.setClientShareRights': {
		riskLevel: 'write',
		description: 'Update Client Share Rights on Klipfolio',
	},
	'clients.deleteClientShareRight': {
		riskLevel: 'destructive',
		description: 'Revoke Group Access to Client on Klipfolio',
	},
	'datasources.listDatasources': {
		riskLevel: 'read',
		description: 'List Data Sources on Klipfolio',
	},
	'datasources.retrieveDatasource': {
		riskLevel: 'read',
		description: 'Get Data Source on Klipfolio',
	},
	'datasources.createDatasource': {
		riskLevel: 'write',
		description: 'Create Data Source on Klipfolio',
	},
	'datasources.updateDatasource': {
		riskLevel: 'write',
		description: 'Update Data Source on Klipfolio',
	},
	'datasources.deleteDatasource': {
		riskLevel: 'destructive',
		description: 'Delete Data Source on Klipfolio',
	},
	'datasources.enableDatasource': {
		riskLevel: 'write',
		description: 'Enable a Data Source on Klipfolio',
	},
	'datasources.disableDatasource': {
		riskLevel: 'write',
		description: 'Disable a Data Source on Klipfolio',
	},
	'datasources.importDatasource': {
		riskLevel: 'write',
		description: 'Import a Data Source on Klipfolio',
	},
	'datasources.deleteInstancesDatasource': {
		riskLevel: 'destructive',
		description: 'Delete Instances on Klipfolio',
	},
	'datasources.retrieveDatasourceProperties': {
		riskLevel: 'read',
		description: 'Get Data Source Properties on Klipfolio',
	},
	'datasources.updateDatasourceProperties': {
		riskLevel: 'write',
		description: 'Create or Update Data Source Properties on Klipfolio',
	},
	'datasources.deleteDatasourceProperties': {
		riskLevel: 'destructive',
		description: 'Delete a Data Source Property on Klipfolio',
	},
	'datasources.retrieveDatasourceShareRights': {
		riskLevel: 'read',
		description: 'Get Data Source Share Rights on Klipfolio',
	},
	'datasources.setDatasourceShareRights': {
		riskLevel: 'write',
		description: 'Update Data Source Share Rights on Klipfolio',
	},
	'datasources.deleteDatasourceShareRight': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Share Right on Klipfolio',
	},
	'datasources.listDatasourceInstances': {
		riskLevel: 'read',
		description: 'List Data Source Instances on Klipfolio',
	},
	'datasources.retrieveDatasourceInstances': {
		riskLevel: 'read',
		description: 'Get Data Source Instance on Klipfolio',
	},
	'datasources.createDatasourceInstances': {
		riskLevel: 'write',
		description: 'Create Data Source Instance on Klipfolio',
	},
	'datasources.deleteDatasourceInstances': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Instance on Klipfolio',
	},
	'datasources.retrieveDatasourceInstancesData': {
		riskLevel: 'read',
		description: 'Get Data Source Instance Data on Klipfolio',
	},
	'datasources.updateDatasourceInstancesData': {
		riskLevel: 'write',
		description: 'Update Data Source Instance Data on Klipfolio',
	},
	'datasources.refreshDatasourceInstances': {
		riskLevel: 'write',
		description: 'Refresh a Data Source Instance on Klipfolio',
	},
	'datasources.refreshDatasource': {
		riskLevel: 'write',
		description: 'Refresh Multiple Data Sources on Klipfolio',
	},
	'datasources.retrieveDatasourceInstancesProperties': {
		riskLevel: 'read',
		description: 'Get Data Source Instance Properties on Klipfolio',
	},
	'datasources.updateDatasourceInstancesProperties': {
		riskLevel: 'write',
		description:
			'Create or Update Data Source Instance Properties on Klipfolio',
	},
	'datasources.deleteDatasourceInstancesProperties': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Instance Property on Klipfolio',
	},
	'groups.listGroups': {
		riskLevel: 'read',
		description: 'List Groups on Klipfolio',
	},
	'groups.retrieveGroup': {
		riskLevel: 'read',
		description: 'Get Group on Klipfolio',
	},
	'groups.createGroup': {
		riskLevel: 'write',
		description: 'Create Group on Klipfolio',
	},
	'groups.updateGroup': {
		riskLevel: 'write',
		description: 'Update Group on Klipfolio',
	},
	'groups.deleteGroup': {
		riskLevel: 'destructive',
		description: 'Delete Group on Klipfolio',
	},
	'groups.retrieveGroupDefaultTabs': {
		riskLevel: 'read',
		description: 'List Group Default Tabs on Klipfolio',
	},
	'groups.retrieveGroupDefaultTab': {
		riskLevel: 'read',
		description: 'Get Group Default Tab on Klipfolio',
	},
	'groups.addGroupDefaultTabs': {
		riskLevel: 'write',
		description: 'Add Dashboard to Group on Klipfolio',
	},
	'groups.updateGroupDefaultTab': {
		riskLevel: 'write',
		description: 'Update Group Default Tab on Klipfolio',
	},
	'groups.deleteGroupDefaultTab': {
		riskLevel: 'destructive',
		description: 'Delete Group Default Tab on Klipfolio',
	},
	'groups.retrieveGroupUsers': {
		riskLevel: 'read',
		description: 'List Users in Group on Klipfolio',
	},
	'groups.updateGroupUser': {
		riskLevel: 'write',
		description: 'Add User to Group on Klipfolio',
	},
	'groups.deleteGroupUser': {
		riskLevel: 'destructive',
		description: 'Delete User from Group on Klipfolio',
	},
	'klips.listKlips': {
		riskLevel: 'read',
		description: 'List Klips on Klipfolio',
	},
	'klips.retrieveKlip': {
		riskLevel: 'read',
		description: 'Get Klip on Klipfolio',
	},
	'klips.retrieveKlipClientInstances': {
		riskLevel: 'read',
		description: 'Get Klip Client Instances on Klipfolio',
	},
	'klips.createKlip': {
		riskLevel: 'write',
		description: 'Create Klip on Klipfolio',
	},
	'klips.updateKlip': {
		riskLevel: 'write',
		description: 'Update Klip on Klipfolio',
	},
	'klips.deleteKlip': {
		riskLevel: 'destructive',
		description: 'Delete Klip on Klipfolio',
	},
	'klips.retrieveKlipAnnotations': {
		riskLevel: 'read',
		description: 'List annotations on Klipfolio',
	},
	'klips.retrieveKlipAnnotation': {
		riskLevel: 'read',
		description: 'Get one annotation on Klipfolio',
	},
	'klips.createKlipAnnotations': {
		riskLevel: 'write',
		description: 'Create annotation on Klipfolio',
	},
	'klips.updateKlipAnnotation': {
		riskLevel: 'write',
		description: 'Update annotation on Klipfolio',
	},
	'klips.deleteKlipAnnotation': {
		riskLevel: 'destructive',
		description: 'Delete annotation on Klipfolio',
	},
	'klips.updateFromParentKlip': {
		riskLevel: 'write',
		description:
			'Update client instance from parent (update_from_parent) on Klipfolio',
	},
	'klips.retrieveKlipSchema': {
		riskLevel: 'read',
		description: 'Get Klip schema on Klipfolio',
	},
	'klips.updateKlipSchema': {
		riskLevel: 'write',
		description: 'Update Klip schema on Klipfolio',
	},
	'klips.retrieveKlipShareRights': {
		riskLevel: 'read',
		description: 'Get Klip share rights on Klipfolio',
	},
	'klips.setKlipShareRights': {
		riskLevel: 'write',
		description: 'Update Klip share rights on Klipfolio',
	},
	'klips.deleteKlipShareRights': {
		riskLevel: 'destructive',
		description: 'Delete Klip share rights on Klipfolio',
	},
	'klips.importKlip': {
		riskLevel: 'write',
		description: 'Import Klip to client account on Klipfolio',
	},
	'misc.retrieveProfile': {
		riskLevel: 'read',
		description: 'Get profile on Klipfolio',
	},
	'misc.createDashboardPublishedLinks': {
		riskLevel: 'write',
		description: 'Create published link on Klipfolio',
	},
	'misc.listDashboardPublishedLinks': {
		riskLevel: 'read',
		description: 'Get published link(s) on Klipfolio',
	},
	'misc.updateDashboardPublishedLinks': {
		riskLevel: 'write',
		description: 'Update published link on Klipfolio',
	},
	'misc.deleteDashboardPublishedLinks': {
		riskLevel: 'destructive',
		description: 'Delete published link on Klipfolio',
	},
	'roles.listRoles': {
		riskLevel: 'read',
		description: 'List roles on Klipfolio',
	},
	'roles.retrieveRole': {
		riskLevel: 'read',
		description: 'Get role on Klipfolio',
	},
	'roles.updateRole': {
		riskLevel: 'write',
		description: 'Update role on Klipfolio',
	},
	'roles.createRole': {
		riskLevel: 'write',
		description: 'Create role on Klipfolio',
	},
	'roles.deleteRole': {
		riskLevel: 'destructive',
		description: 'Delete role on Klipfolio',
	},
	'roles.retrieveRoleUsers': {
		riskLevel: 'read',
		description: 'List users for role on Klipfolio',
	},
	'roles.updateRoleUser': {
		riskLevel: 'write',
		description: 'Add user to role on Klipfolio',
	},
	'roles.deleteRoleUser': {
		riskLevel: 'destructive',
		description: 'Delete user from role on Klipfolio',
	},
	'roles.retrieveRolePermissions': {
		riskLevel: 'read',
		description: 'Get role permissions on Klipfolio',
	},
	'roles.updateRolePermissions': {
		riskLevel: 'write',
		description: 'Update role permissions on Klipfolio',
	},
	'roles.deleteRolePermissions': {
		riskLevel: 'destructive',
		description: 'Remove role permission on Klipfolio',
	},
	'tabs.listTabs': {
		riskLevel: 'read',
		description: 'List tabs on Klipfolio',
	},
	'tabs.retrieveTab': {
		riskLevel: 'read',
		description: 'Get tab on Klipfolio',
	},
	'tabs.createTab': {
		riskLevel: 'write',
		description: 'Create tab on Klipfolio',
	},
	'tabs.updateTab': {
		riskLevel: 'write',
		description: 'Update tab on Klipfolio',
	},
	'tabs.deleteTab': {
		riskLevel: 'destructive',
		description: 'Delete tab on Klipfolio',
	},
	'tabs.retrieveTabKlipInstances': {
		riskLevel: 'read',
		description: 'List Klip instances on tab on Klipfolio',
	},
	'tabs.updateTabKlipInstances': {
		riskLevel: 'write',
		description: 'Add Klip to tab on Klipfolio',
	},
	'tabs.deleteTabKlipInstance': {
		riskLevel: 'destructive',
		description: 'Delete Klip from tab on Klipfolio',
	},
	'tabs.retrieveTabLayout': {
		riskLevel: 'read',
		description: 'Get tab layout on Klipfolio',
	},
	'tabs.updateTabLayout': {
		riskLevel: 'write',
		description: 'Update tab layout on Klipfolio',
	},
	'tabs.retrieveTabShareRights': {
		riskLevel: 'read',
		description: 'Get tab share rights on Klipfolio',
	},
	'tabs.setTabShareRights': {
		riskLevel: 'write',
		description: 'Update tab share rights on Klipfolio',
	},
	'tabs.deleteTabShareRight': {
		riskLevel: 'destructive',
		description: 'Revoke group access to tab on Klipfolio',
	},
	'tabs.importTab': {
		riskLevel: 'write',
		description: 'Import tab to client account on Klipfolio',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'Get Users on Klipfolio',
	},
	'users.retrieveUser': {
		riskLevel: 'read',
		description: 'Get User by ID on Klipfolio',
	},
	'users.createUser': {
		riskLevel: 'write',
		description: 'Create User on Klipfolio',
	},
	'users.updateUser': {
		riskLevel: 'write',
		description: 'Update User on Klipfolio',
	},
	'users.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete User on Klipfolio',
	},
	'users.retrieveUserGroups': {
		riskLevel: 'read',
		description: 'Get user groups on Klipfolio',
	},
	'users.updateUserGroup': {
		riskLevel: 'write',
		description: 'Add user to group on Klipfolio',
	},
	'users.deleteUserGroup': {
		riskLevel: 'destructive',
		description: 'Delete user from group on Klipfolio',
	},
	'users.resendInviteUser': {
		riskLevel: 'write',
		description: 'Resend Invitation on Klipfolio',
	},
	'users.resetPasswordUser': {
		riskLevel: 'write',
		description: 'Reset Password on Klipfolio',
	},
	'users.retrieveUserProperties': {
		riskLevel: 'read',
		description: 'Get user properties on Klipfolio',
	},
	'users.updateUserProperties': {
		riskLevel: 'write',
		description: 'Update user properties on Klipfolio',
	},
	'users.deleteUserProperties': {
		riskLevel: 'destructive',
		description: 'Delete user property on Klipfolio',
	},
	'users.retrieveUserRoles': {
		riskLevel: 'read',
		description: 'Get user roles on Klipfolio',
	},
	'users.updateUserRole': {
		riskLevel: 'write',
		description: 'Assign user to role on Klipfolio',
	},
	'users.deleteUserRole': {
		riskLevel: 'destructive',
		description: 'Delete user from role on Klipfolio',
	},
	'users.retrieveUserTabInstances': {
		riskLevel: 'read',
		description: 'Get user tab instances on Klipfolio',
	},
	'users.updateUserTabInstances': {
		riskLevel: 'write',
		description: 'Add tabs to user on Klipfolio',
	},
	'users.deleteUserTabInstance': {
		riskLevel: 'destructive',
		description: 'Delete user tab instance on Klipfolio',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof klipfolioEndpointsNested
>;

export const klipfolioEndpointSchemas = {
	'clients.listClients': {
		input: KlipfolioEndpointInputSchemas.listClients,
		output: KlipfolioEndpointOutputSchemas.listClients,
	},
	'clients.retrieveClient': {
		input: KlipfolioEndpointInputSchemas.retrieveClient,
		output: KlipfolioEndpointOutputSchemas.retrieveClient,
	},
	'clients.createClient': {
		input: KlipfolioEndpointInputSchemas.createClient,
		output: KlipfolioEndpointOutputSchemas.createClient,
	},
	'clients.updateClient': {
		input: KlipfolioEndpointInputSchemas.updateClient,
		output: KlipfolioEndpointOutputSchemas.updateClient,
	},
	'clients.deleteClient': {
		input: KlipfolioEndpointInputSchemas.deleteClient,
		output: KlipfolioEndpointOutputSchemas.deleteClient,
	},
	'clients.enableDirectBillingClient': {
		input: KlipfolioEndpointInputSchemas.enableDirectBillingClient,
		output: KlipfolioEndpointOutputSchemas.enableDirectBillingClient,
	},
	'clients.extendTrialClient': {
		input: KlipfolioEndpointInputSchemas.extendTrialClient,
		output: KlipfolioEndpointOutputSchemas.extendTrialClient,
	},
	'clients.retrieveClientFeatures': {
		input: KlipfolioEndpointInputSchemas.retrieveClientFeatures,
		output: KlipfolioEndpointOutputSchemas.retrieveClientFeatures,
	},
	'clients.updateClientFeatures': {
		input: KlipfolioEndpointInputSchemas.updateClientFeatures,
		output: KlipfolioEndpointOutputSchemas.updateClientFeatures,
	},
	'clients.retrieveClientProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveClientProperties,
		output: KlipfolioEndpointOutputSchemas.retrieveClientProperties,
	},
	'clients.updateClientProperties': {
		input: KlipfolioEndpointInputSchemas.updateClientProperties,
		output: KlipfolioEndpointOutputSchemas.updateClientProperties,
	},
	'clients.deleteClientProperties': {
		input: KlipfolioEndpointInputSchemas.deleteClientProperties,
		output: KlipfolioEndpointOutputSchemas.deleteClientProperties,
	},
	'clients.retrieveClientResources': {
		input: KlipfolioEndpointInputSchemas.retrieveClientResources,
		output: KlipfolioEndpointOutputSchemas.retrieveClientResources,
	},
	'clients.updateClientResources': {
		input: KlipfolioEndpointInputSchemas.updateClientResources,
		output: KlipfolioEndpointOutputSchemas.updateClientResources,
	},
	'clients.retrieveClientSettings': {
		input: KlipfolioEndpointInputSchemas.retrieveClientSettings,
		output: KlipfolioEndpointOutputSchemas.retrieveClientSettings,
	},
	'clients.createClientSettings': {
		input: KlipfolioEndpointInputSchemas.createClientSettings,
		output: KlipfolioEndpointOutputSchemas.createClientSettings,
	},
	'clients.retrieveClientShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveClientShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveClientShareRights,
	},
	'clients.setClientShareRights': {
		input: KlipfolioEndpointInputSchemas.setClientShareRights,
		output: KlipfolioEndpointOutputSchemas.setClientShareRights,
	},
	'clients.deleteClientShareRight': {
		input: KlipfolioEndpointInputSchemas.deleteClientShareRight,
		output: KlipfolioEndpointOutputSchemas.deleteClientShareRight,
	},
	'datasources.listDatasources': {
		input: KlipfolioEndpointInputSchemas.listDatasources,
		output: KlipfolioEndpointOutputSchemas.listDatasources,
	},
	'datasources.retrieveDatasource': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasource,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasource,
	},
	'datasources.createDatasource': {
		input: KlipfolioEndpointInputSchemas.createDatasource,
		output: KlipfolioEndpointOutputSchemas.createDatasource,
	},
	'datasources.updateDatasource': {
		input: KlipfolioEndpointInputSchemas.updateDatasource,
		output: KlipfolioEndpointOutputSchemas.updateDatasource,
	},
	'datasources.deleteDatasource': {
		input: KlipfolioEndpointInputSchemas.deleteDatasource,
		output: KlipfolioEndpointOutputSchemas.deleteDatasource,
	},
	'datasources.enableDatasource': {
		input: KlipfolioEndpointInputSchemas.enableDatasource,
		output: KlipfolioEndpointOutputSchemas.enableDatasource,
	},
	'datasources.disableDatasource': {
		input: KlipfolioEndpointInputSchemas.disableDatasource,
		output: KlipfolioEndpointOutputSchemas.disableDatasource,
	},
	'datasources.importDatasource': {
		input: KlipfolioEndpointInputSchemas.importDatasource,
		output: KlipfolioEndpointOutputSchemas.importDatasource,
	},
	'datasources.deleteInstancesDatasource': {
		input: KlipfolioEndpointInputSchemas.deleteInstancesDatasource,
		output: KlipfolioEndpointOutputSchemas.deleteInstancesDatasource,
	},
	'datasources.retrieveDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceProperties,
	},
	'datasources.updateDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceProperties,
	},
	'datasources.deleteDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceProperties,
	},
	'datasources.retrieveDatasourceShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceShareRights,
	},
	'datasources.setDatasourceShareRights': {
		input: KlipfolioEndpointInputSchemas.setDatasourceShareRights,
		output: KlipfolioEndpointOutputSchemas.setDatasourceShareRights,
	},
	'datasources.deleteDatasourceShareRight': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceShareRight,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceShareRight,
	},
	'datasources.listDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.listDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.listDatasourceInstances,
	},
	'datasources.retrieveDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceInstances,
	},
	'datasources.createDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.createDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.createDatasourceInstances,
	},
	'datasources.deleteDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceInstances,
	},
	'datasources.retrieveDatasourceInstancesData': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstancesData,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceInstancesData,
	},
	'datasources.updateDatasourceInstancesData': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceInstancesData,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceInstancesData,
	},
	'datasources.refreshDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.refreshDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.refreshDatasourceInstances,
	},
	'datasources.refreshDatasource': {
		input: KlipfolioEndpointInputSchemas.refreshDatasource,
		output: KlipfolioEndpointOutputSchemas.refreshDatasource,
	},
	'datasources.retrieveDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstancesProperties,
		output:
			KlipfolioEndpointOutputSchemas.retrieveDatasourceInstancesProperties,
	},
	'datasources.updateDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceInstancesProperties,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceInstancesProperties,
	},
	'datasources.deleteDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceInstancesProperties,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceInstancesProperties,
	},
	'groups.listGroups': {
		input: KlipfolioEndpointInputSchemas.listGroups,
		output: KlipfolioEndpointOutputSchemas.listGroups,
	},
	'groups.retrieveGroup': {
		input: KlipfolioEndpointInputSchemas.retrieveGroup,
		output: KlipfolioEndpointOutputSchemas.retrieveGroup,
	},
	'groups.createGroup': {
		input: KlipfolioEndpointInputSchemas.createGroup,
		output: KlipfolioEndpointOutputSchemas.createGroup,
	},
	'groups.updateGroup': {
		input: KlipfolioEndpointInputSchemas.updateGroup,
		output: KlipfolioEndpointOutputSchemas.updateGroup,
	},
	'groups.deleteGroup': {
		input: KlipfolioEndpointInputSchemas.deleteGroup,
		output: KlipfolioEndpointOutputSchemas.deleteGroup,
	},
	'groups.retrieveGroupDefaultTabs': {
		input: KlipfolioEndpointInputSchemas.retrieveGroupDefaultTabs,
		output: KlipfolioEndpointOutputSchemas.retrieveGroupDefaultTabs,
	},
	'groups.retrieveGroupDefaultTab': {
		input: KlipfolioEndpointInputSchemas.retrieveGroupDefaultTab,
		output: KlipfolioEndpointOutputSchemas.retrieveGroupDefaultTab,
	},
	'groups.addGroupDefaultTabs': {
		input: KlipfolioEndpointInputSchemas.addGroupDefaultTabs,
		output: KlipfolioEndpointOutputSchemas.addGroupDefaultTabs,
	},
	'groups.updateGroupDefaultTab': {
		input: KlipfolioEndpointInputSchemas.updateGroupDefaultTab,
		output: KlipfolioEndpointOutputSchemas.updateGroupDefaultTab,
	},
	'groups.deleteGroupDefaultTab': {
		input: KlipfolioEndpointInputSchemas.deleteGroupDefaultTab,
		output: KlipfolioEndpointOutputSchemas.deleteGroupDefaultTab,
	},
	'groups.retrieveGroupUsers': {
		input: KlipfolioEndpointInputSchemas.retrieveGroupUsers,
		output: KlipfolioEndpointOutputSchemas.retrieveGroupUsers,
	},
	'groups.updateGroupUser': {
		input: KlipfolioEndpointInputSchemas.updateGroupUser,
		output: KlipfolioEndpointOutputSchemas.updateGroupUser,
	},
	'groups.deleteGroupUser': {
		input: KlipfolioEndpointInputSchemas.deleteGroupUser,
		output: KlipfolioEndpointOutputSchemas.deleteGroupUser,
	},
	'klips.listKlips': {
		input: KlipfolioEndpointInputSchemas.listKlips,
		output: KlipfolioEndpointOutputSchemas.listKlips,
	},
	'klips.retrieveKlip': {
		input: KlipfolioEndpointInputSchemas.retrieveKlip,
		output: KlipfolioEndpointOutputSchemas.retrieveKlip,
	},
	'klips.retrieveKlipClientInstances': {
		input: KlipfolioEndpointInputSchemas.retrieveKlipClientInstances,
		output: KlipfolioEndpointOutputSchemas.retrieveKlipClientInstances,
	},
	'klips.createKlip': {
		input: KlipfolioEndpointInputSchemas.createKlip,
		output: KlipfolioEndpointOutputSchemas.createKlip,
	},
	'klips.updateKlip': {
		input: KlipfolioEndpointInputSchemas.updateKlip,
		output: KlipfolioEndpointOutputSchemas.updateKlip,
	},
	'klips.deleteKlip': {
		input: KlipfolioEndpointInputSchemas.deleteKlip,
		output: KlipfolioEndpointOutputSchemas.deleteKlip,
	},
	'klips.retrieveKlipAnnotations': {
		input: KlipfolioEndpointInputSchemas.retrieveKlipAnnotations,
		output: KlipfolioEndpointOutputSchemas.retrieveKlipAnnotations,
	},
	'klips.retrieveKlipAnnotation': {
		input: KlipfolioEndpointInputSchemas.retrieveKlipAnnotation,
		output: KlipfolioEndpointOutputSchemas.retrieveKlipAnnotation,
	},
	'klips.createKlipAnnotations': {
		input: KlipfolioEndpointInputSchemas.createKlipAnnotations,
		output: KlipfolioEndpointOutputSchemas.createKlipAnnotations,
	},
	'klips.updateKlipAnnotation': {
		input: KlipfolioEndpointInputSchemas.updateKlipAnnotation,
		output: KlipfolioEndpointOutputSchemas.updateKlipAnnotation,
	},
	'klips.deleteKlipAnnotation': {
		input: KlipfolioEndpointInputSchemas.deleteKlipAnnotation,
		output: KlipfolioEndpointOutputSchemas.deleteKlipAnnotation,
	},
	'klips.updateFromParentKlip': {
		input: KlipfolioEndpointInputSchemas.updateFromParentKlip,
		output: KlipfolioEndpointOutputSchemas.updateFromParentKlip,
	},
	'klips.retrieveKlipSchema': {
		input: KlipfolioEndpointInputSchemas.retrieveKlipSchema,
		output: KlipfolioEndpointOutputSchemas.retrieveKlipSchema,
	},
	'klips.updateKlipSchema': {
		input: KlipfolioEndpointInputSchemas.updateKlipSchema,
		output: KlipfolioEndpointOutputSchemas.updateKlipSchema,
	},
	'klips.retrieveKlipShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveKlipShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveKlipShareRights,
	},
	'klips.setKlipShareRights': {
		input: KlipfolioEndpointInputSchemas.setKlipShareRights,
		output: KlipfolioEndpointOutputSchemas.setKlipShareRights,
	},
	'klips.deleteKlipShareRights': {
		input: KlipfolioEndpointInputSchemas.deleteKlipShareRights,
		output: KlipfolioEndpointOutputSchemas.deleteKlipShareRights,
	},
	'klips.importKlip': {
		input: KlipfolioEndpointInputSchemas.importKlip,
		output: KlipfolioEndpointOutputSchemas.importKlip,
	},
	'misc.retrieveProfile': {
		input: KlipfolioEndpointInputSchemas.retrieveProfile,
		output: KlipfolioEndpointOutputSchemas.retrieveProfile,
	},
	'misc.createDashboardPublishedLinks': {
		input: KlipfolioEndpointInputSchemas.createDashboardPublishedLinks,
		output: KlipfolioEndpointOutputSchemas.createDashboardPublishedLinks,
	},
	'misc.listDashboardPublishedLinks': {
		input: KlipfolioEndpointInputSchemas.listDashboardPublishedLinks,
		output: KlipfolioEndpointOutputSchemas.listDashboardPublishedLinks,
	},
	'misc.updateDashboardPublishedLinks': {
		input: KlipfolioEndpointInputSchemas.updateDashboardPublishedLinks,
		output: KlipfolioEndpointOutputSchemas.updateDashboardPublishedLinks,
	},
	'misc.deleteDashboardPublishedLinks': {
		input: KlipfolioEndpointInputSchemas.deleteDashboardPublishedLinks,
		output: KlipfolioEndpointOutputSchemas.deleteDashboardPublishedLinks,
	},
	'roles.listRoles': {
		input: KlipfolioEndpointInputSchemas.listRoles,
		output: KlipfolioEndpointOutputSchemas.listRoles,
	},
	'roles.retrieveRole': {
		input: KlipfolioEndpointInputSchemas.retrieveRole,
		output: KlipfolioEndpointOutputSchemas.retrieveRole,
	},
	'roles.updateRole': {
		input: KlipfolioEndpointInputSchemas.updateRole,
		output: KlipfolioEndpointOutputSchemas.updateRole,
	},
	'roles.createRole': {
		input: KlipfolioEndpointInputSchemas.createRole,
		output: KlipfolioEndpointOutputSchemas.createRole,
	},
	'roles.deleteRole': {
		input: KlipfolioEndpointInputSchemas.deleteRole,
		output: KlipfolioEndpointOutputSchemas.deleteRole,
	},
	'roles.retrieveRoleUsers': {
		input: KlipfolioEndpointInputSchemas.retrieveRoleUsers,
		output: KlipfolioEndpointOutputSchemas.retrieveRoleUsers,
	},
	'roles.updateRoleUser': {
		input: KlipfolioEndpointInputSchemas.updateRoleUser,
		output: KlipfolioEndpointOutputSchemas.updateRoleUser,
	},
	'roles.deleteRoleUser': {
		input: KlipfolioEndpointInputSchemas.deleteRoleUser,
		output: KlipfolioEndpointOutputSchemas.deleteRoleUser,
	},
	'roles.retrieveRolePermissions': {
		input: KlipfolioEndpointInputSchemas.retrieveRolePermissions,
		output: KlipfolioEndpointOutputSchemas.retrieveRolePermissions,
	},
	'roles.updateRolePermissions': {
		input: KlipfolioEndpointInputSchemas.updateRolePermissions,
		output: KlipfolioEndpointOutputSchemas.updateRolePermissions,
	},
	'roles.deleteRolePermissions': {
		input: KlipfolioEndpointInputSchemas.deleteRolePermissions,
		output: KlipfolioEndpointOutputSchemas.deleteRolePermissions,
	},
	'tabs.listTabs': {
		input: KlipfolioEndpointInputSchemas.listTabs,
		output: KlipfolioEndpointOutputSchemas.listTabs,
	},
	'tabs.retrieveTab': {
		input: KlipfolioEndpointInputSchemas.retrieveTab,
		output: KlipfolioEndpointOutputSchemas.retrieveTab,
	},
	'tabs.createTab': {
		input: KlipfolioEndpointInputSchemas.createTab,
		output: KlipfolioEndpointOutputSchemas.createTab,
	},
	'tabs.updateTab': {
		input: KlipfolioEndpointInputSchemas.updateTab,
		output: KlipfolioEndpointOutputSchemas.updateTab,
	},
	'tabs.deleteTab': {
		input: KlipfolioEndpointInputSchemas.deleteTab,
		output: KlipfolioEndpointOutputSchemas.deleteTab,
	},
	'tabs.retrieveTabKlipInstances': {
		input: KlipfolioEndpointInputSchemas.retrieveTabKlipInstances,
		output: KlipfolioEndpointOutputSchemas.retrieveTabKlipInstances,
	},
	'tabs.updateTabKlipInstances': {
		input: KlipfolioEndpointInputSchemas.updateTabKlipInstances,
		output: KlipfolioEndpointOutputSchemas.updateTabKlipInstances,
	},
	'tabs.deleteTabKlipInstance': {
		input: KlipfolioEndpointInputSchemas.deleteTabKlipInstance,
		output: KlipfolioEndpointOutputSchemas.deleteTabKlipInstance,
	},
	'tabs.retrieveTabLayout': {
		input: KlipfolioEndpointInputSchemas.retrieveTabLayout,
		output: KlipfolioEndpointOutputSchemas.retrieveTabLayout,
	},
	'tabs.updateTabLayout': {
		input: KlipfolioEndpointInputSchemas.updateTabLayout,
		output: KlipfolioEndpointOutputSchemas.updateTabLayout,
	},
	'tabs.retrieveTabShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveTabShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveTabShareRights,
	},
	'tabs.setTabShareRights': {
		input: KlipfolioEndpointInputSchemas.setTabShareRights,
		output: KlipfolioEndpointOutputSchemas.setTabShareRights,
	},
	'tabs.deleteTabShareRight': {
		input: KlipfolioEndpointInputSchemas.deleteTabShareRight,
		output: KlipfolioEndpointOutputSchemas.deleteTabShareRight,
	},
	'tabs.importTab': {
		input: KlipfolioEndpointInputSchemas.importTab,
		output: KlipfolioEndpointOutputSchemas.importTab,
	},
	'users.listUsers': {
		input: KlipfolioEndpointInputSchemas.listUsers,
		output: KlipfolioEndpointOutputSchemas.listUsers,
	},
	'users.retrieveUser': {
		input: KlipfolioEndpointInputSchemas.retrieveUser,
		output: KlipfolioEndpointOutputSchemas.retrieveUser,
	},
	'users.createUser': {
		input: KlipfolioEndpointInputSchemas.createUser,
		output: KlipfolioEndpointOutputSchemas.createUser,
	},
	'users.updateUser': {
		input: KlipfolioEndpointInputSchemas.updateUser,
		output: KlipfolioEndpointOutputSchemas.updateUser,
	},
	'users.deleteUser': {
		input: KlipfolioEndpointInputSchemas.deleteUser,
		output: KlipfolioEndpointOutputSchemas.deleteUser,
	},
	'users.retrieveUserGroups': {
		input: KlipfolioEndpointInputSchemas.retrieveUserGroups,
		output: KlipfolioEndpointOutputSchemas.retrieveUserGroups,
	},
	'users.updateUserGroup': {
		input: KlipfolioEndpointInputSchemas.updateUserGroup,
		output: KlipfolioEndpointOutputSchemas.updateUserGroup,
	},
	'users.deleteUserGroup': {
		input: KlipfolioEndpointInputSchemas.deleteUserGroup,
		output: KlipfolioEndpointOutputSchemas.deleteUserGroup,
	},
	'users.resendInviteUser': {
		input: KlipfolioEndpointInputSchemas.resendInviteUser,
		output: KlipfolioEndpointOutputSchemas.resendInviteUser,
	},
	'users.resetPasswordUser': {
		input: KlipfolioEndpointInputSchemas.resetPasswordUser,
		output: KlipfolioEndpointOutputSchemas.resetPasswordUser,
	},
	'users.retrieveUserProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveUserProperties,
		output: KlipfolioEndpointOutputSchemas.retrieveUserProperties,
	},
	'users.updateUserProperties': {
		input: KlipfolioEndpointInputSchemas.updateUserProperties,
		output: KlipfolioEndpointOutputSchemas.updateUserProperties,
	},
	'users.deleteUserProperties': {
		input: KlipfolioEndpointInputSchemas.deleteUserProperties,
		output: KlipfolioEndpointOutputSchemas.deleteUserProperties,
	},
	'users.retrieveUserRoles': {
		input: KlipfolioEndpointInputSchemas.retrieveUserRoles,
		output: KlipfolioEndpointOutputSchemas.retrieveUserRoles,
	},
	'users.updateUserRole': {
		input: KlipfolioEndpointInputSchemas.updateUserRole,
		output: KlipfolioEndpointOutputSchemas.updateUserRole,
	},
	'users.deleteUserRole': {
		input: KlipfolioEndpointInputSchemas.deleteUserRole,
		output: KlipfolioEndpointOutputSchemas.deleteUserRole,
	},
	'users.retrieveUserTabInstances': {
		input: KlipfolioEndpointInputSchemas.retrieveUserTabInstances,
		output: KlipfolioEndpointOutputSchemas.retrieveUserTabInstances,
	},
	'users.updateUserTabInstances': {
		input: KlipfolioEndpointInputSchemas.updateUserTabInstances,
		output: KlipfolioEndpointOutputSchemas.updateUserTabInstances,
	},
	'users.deleteUserTabInstance': {
		input: KlipfolioEndpointInputSchemas.deleteUserTabInstance,
		output: KlipfolioEndpointOutputSchemas.deleteUserTabInstance,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof klipfolioEndpointsNested
>;

const validatedKlipfolioEndpointsNested = withKlipfolioSchemas(
	klipfolioEndpointsNested,
);

export function klipfolio<const T extends KlipfolioPluginOptions>(
	incomingOptions: KlipfolioPluginOptions & T = {} as KlipfolioPluginOptions &
		T,
): ExternalKlipfolioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'klipfolio',
		authConfig: klipfolioAuthConfig,
		schema: KlipfolioSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedKlipfolioEndpointsNested,
		webhooks: {},
		endpointMeta: klipfolioEndpointMeta,
		endpointSchemas: klipfolioEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KlipfolioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('klipfolio', 'api_key');
		},
	} satisfies InternalKlipfolioPlugin;
}
