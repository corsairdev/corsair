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
import {
	Allowlist,
	Analytics,
	Auth,
	Denylist,
	Logs,
	ParentalControl,
	Privacy,
	Profiles,
	Rewrites,
	Security,
	Settings,
	Setup,
} from './endpoints';
import type {
	NextDNSEndpointInputs,
	NextDNSEndpointOutputs,
} from './endpoints/types';
import {
	NextDNSEndpointInputSchemas,
	NextDNSEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NextDNSSchema } from './schema';

export type NextDNSPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNextDNSPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nextDNSEndpointsNested>;
};

export type NextDNSContext = CorsairPluginContext<
	typeof NextDNSSchema,
	NextDNSPluginOptions
>;

export type NextDNSKeyBuilderContext = KeyBuilderContext<NextDNSPluginOptions>;

export type NextDNSBoundEndpoints = BindEndpoints<
	typeof nextDNSEndpointsNested
>;

type NextDNSEndpoint<K extends keyof NextDNSEndpointOutputs> = CorsairEndpoint<
	NextDNSContext,
	NextDNSEndpointInputs[K],
	NextDNSEndpointOutputs[K]
>;

export type NextDNSEndpoints = {
	profilesList: NextDNSEndpoint<'profiles.list'>;
	profilesGet: NextDNSEndpoint<'profiles.get'>;
	profilesCreate: NextDNSEndpoint<'profiles.create'>;
	profilesUpdate: NextDNSEndpoint<'profiles.update'>;
	profilesDelete: NextDNSEndpoint<'profiles.delete'>;
	profilesRename: NextDNSEndpoint<'profiles.rename'>;

	settingsGet: NextDNSEndpoint<'settings.get'>;
	settingsUpdate: NextDNSEndpoint<'settings.update'>;
	settingsGetBlockPage: NextDNSEndpoint<'settings.getBlockPage'>;
	settingsUpdateBlockPage: NextDNSEndpoint<'settings.updateBlockPage'>;
	settingsGetLogs: NextDNSEndpoint<'settings.getLogs'>;
	settingsUpdateLogs: NextDNSEndpoint<'settings.updateLogs'>;
	settingsGetPerformance: NextDNSEndpoint<'settings.getPerformance'>;
	settingsUpdatePerformance: NextDNSEndpoint<'settings.updatePerformance'>;
	settingsLogClientIps: NextDNSEndpoint<'settings.logClientIps'>;
	settingsLogDomains: NextDNSEndpoint<'settings.logDomains'>;

	securityGet: NextDNSEndpoint<'security.get'>;
	securityUpdate: NextDNSEndpoint<'security.update'>;
	securityGetTlds: NextDNSEndpoint<'security.getTlds'>;
	securityAddBlockedTld: NextDNSEndpoint<'security.addBlockedTld'>;
	securityRemoveBlockedTld: NextDNSEndpoint<'security.removeBlockedTld'>;
	securityReplaceTlds: NextDNSEndpoint<'security.replaceTlds'>;

	privacyGet: NextDNSEndpoint<'privacy.get'>;
	privacyUpdate: NextDNSEndpoint<'privacy.update'>;
	privacyAddBlocklist: NextDNSEndpoint<'privacy.addBlocklist'>;
	privacyDeleteBlocklist: NextDNSEndpoint<'privacy.deleteBlocklist'>;
	privacyReplaceBlocklists: NextDNSEndpoint<'privacy.replaceBlocklists'>;
	privacyAddNative: NextDNSEndpoint<'privacy.addNative'>;
	privacyDeleteNative: NextDNSEndpoint<'privacy.deleteNative'>;
	privacyReplaceNatives: NextDNSEndpoint<'privacy.replaceNatives'>;

	parentalControlGet: NextDNSEndpoint<'parentalControl.get'>;
	parentalControlUpdate: NextDNSEndpoint<'parentalControl.update'>;
	parentalControlGetCategories: NextDNSEndpoint<'parentalControl.getCategories'>;
	parentalControlAddCategory: NextDNSEndpoint<'parentalControl.addCategory'>;
	parentalControlDeleteCategory: NextDNSEndpoint<'parentalControl.deleteCategory'>;
	parentalControlUpdateCategory: NextDNSEndpoint<'parentalControl.updateCategory'>;
	parentalControlReplaceCategories: NextDNSEndpoint<'parentalControl.replaceCategories'>;
	parentalControlGetServices: NextDNSEndpoint<'parentalControl.getServices'>;
	parentalControlAddService: NextDNSEndpoint<'parentalControl.addService'>;
	parentalControlDeleteService: NextDNSEndpoint<'parentalControl.deleteService'>;
	parentalControlUpdateService: NextDNSEndpoint<'parentalControl.updateService'>;
	parentalControlReplaceServices: NextDNSEndpoint<'parentalControl.replaceServices'>;

	denylistList: NextDNSEndpoint<'denylist.list'>;
	denylistAdd: NextDNSEndpoint<'denylist.add'>;
	denylistRemove: NextDNSEndpoint<'denylist.remove'>;
	denylistUpdate: NextDNSEndpoint<'denylist.update'>;
	denylistReplace: NextDNSEndpoint<'denylist.replace'>;

	allowlistGet: NextDNSEndpoint<'allowlist.get'>;
	allowlistAdd: NextDNSEndpoint<'allowlist.add'>;
	allowlistDelete: NextDNSEndpoint<'allowlist.delete'>;
	allowlistUpdate: NextDNSEndpoint<'allowlist.update'>;
	allowlistReplace: NextDNSEndpoint<'allowlist.replace'>;

	rewritesGet: NextDNSEndpoint<'rewrites.get'>;
	rewritesAdd: NextDNSEndpoint<'rewrites.add'>;
	rewritesDelete: NextDNSEndpoint<'rewrites.delete'>;

	analyticsStatus: NextDNSEndpoint<'analytics.status'>;
	analyticsDomains: NextDNSEndpoint<'analytics.domains'>;
	analyticsReasons: NextDNSEndpoint<'analytics.reasons'>;
	analyticsIps: NextDNSEndpoint<'analytics.ips'>;
	analyticsDevices: NextDNSEndpoint<'analytics.devices'>;
	analyticsProtocols: NextDNSEndpoint<'analytics.protocols'>;
	analyticsQueryTypes: NextDNSEndpoint<'analytics.queryTypes'>;
	analyticsIpVersions: NextDNSEndpoint<'analytics.ipVersions'>;
	analyticsDnssec: NextDNSEndpoint<'analytics.dnssec'>;
	analyticsEncryption: NextDNSEndpoint<'analytics.encryption'>;
	analyticsDestinations: NextDNSEndpoint<'analytics.destinations'>;

	logsGet: NextDNSEndpoint<'logs.get'>;
	logsDownload: NextDNSEndpoint<'logs.download'>;
	logsClear: NextDNSEndpoint<'logs.clear'>;

	setupUpdateLinkedIp: NextDNSEndpoint<'setup.updateLinkedIp'>;

	authLogin: NextDNSEndpoint<'auth.login'>;
};

const nextDNSEndpointsNested = {
	profiles: {
		list: Profiles.list,
		get: Profiles.get,
		create: Profiles.create,
		update: Profiles.update,
		delete: Profiles.deleteProfile,
		rename: Profiles.rename,
	},
	settings: {
		get: Settings.get,
		update: Settings.update,
		getBlockPage: Settings.getBlockPage,
		updateBlockPage: Settings.updateBlockPage,
		getLogs: Settings.getLogs,
		updateLogs: Settings.updateLogs,
		getPerformance: Settings.getPerformance,
		updatePerformance: Settings.updatePerformance,
		logClientIps: Settings.logClientIps,
		logDomains: Settings.logDomains,
	},
	security: {
		get: Security.get,
		update: Security.update,
		getTlds: Security.getTlds,
		addBlockedTld: Security.addBlockedTld,
		removeBlockedTld: Security.removeBlockedTld,
		replaceTlds: Security.replaceTlds,
	},
	privacy: {
		get: Privacy.get,
		update: Privacy.update,
		addBlocklist: Privacy.addBlocklist,
		deleteBlocklist: Privacy.deleteBlocklist,
		replaceBlocklists: Privacy.replaceBlocklists,
		addNative: Privacy.addNative,
		deleteNative: Privacy.deleteNative,
		replaceNatives: Privacy.replaceNatives,
	},
	parentalControl: {
		get: ParentalControl.get,
		update: ParentalControl.update,
		getCategories: ParentalControl.getCategories,
		addCategory: ParentalControl.addCategory,
		deleteCategory: ParentalControl.deleteCategory,
		updateCategory: ParentalControl.updateCategory,
		replaceCategories: ParentalControl.replaceCategories,
		getServices: ParentalControl.getServices,
		addService: ParentalControl.addService,
		deleteService: ParentalControl.deleteService,
		updateService: ParentalControl.updateService,
		replaceServices: ParentalControl.replaceServices,
	},
	denylist: {
		list: Denylist.list,
		add: Denylist.add,
		remove: Denylist.remove,
		update: Denylist.update,
		replace: Denylist.replace,
	},
	allowlist: {
		get: Allowlist.get,
		add: Allowlist.add,
		delete: Allowlist.deleteEntry,
		update: Allowlist.update,
		replace: Allowlist.replace,
	},
	rewrites: {
		get: Rewrites.get,
		add: Rewrites.add,
		delete: Rewrites.deleteRewrite,
	},
	analytics: {
		status: Analytics.status,
		domains: Analytics.domains,
		reasons: Analytics.reasons,
		ips: Analytics.ips,
		devices: Analytics.devices,
		protocols: Analytics.protocols,
		queryTypes: Analytics.queryTypes,
		ipVersions: Analytics.ipVersions,
		dnssec: Analytics.dnssec,
		encryption: Analytics.encryption,
		destinations: Analytics.destinations,
	},
	logs: {
		get: Logs.get,
		download: Logs.download,
		clear: Logs.clear,
	},
	setup: {
		updateLinkedIp: Setup.updateLinkedIp,
	},
	auth: {
		login: Auth.login,
	},
} as const;

/** No webhook capability of any kind - confirmed from both the provider's docs and an independent client's source. */
const nextDNSWebhooksNested = {} as const;

export const nextDNSEndpointSchemas = {
	'profiles.list': {
		input: NextDNSEndpointInputSchemas['profiles.list'],
		output: NextDNSEndpointOutputSchemas['profiles.list'],
	},
	'profiles.get': {
		input: NextDNSEndpointInputSchemas['profiles.get'],
		output: NextDNSEndpointOutputSchemas['profiles.get'],
	},
	'profiles.create': {
		input: NextDNSEndpointInputSchemas['profiles.create'],
		output: NextDNSEndpointOutputSchemas['profiles.create'],
	},
	'profiles.update': {
		input: NextDNSEndpointInputSchemas['profiles.update'],
		output: NextDNSEndpointOutputSchemas['profiles.update'],
	},
	'profiles.delete': {
		input: NextDNSEndpointInputSchemas['profiles.delete'],
		output: NextDNSEndpointOutputSchemas['profiles.delete'],
	},
	'profiles.rename': {
		input: NextDNSEndpointInputSchemas['profiles.rename'],
		output: NextDNSEndpointOutputSchemas['profiles.rename'],
	},
	'settings.get': {
		input: NextDNSEndpointInputSchemas['settings.get'],
		output: NextDNSEndpointOutputSchemas['settings.get'],
	},
	'settings.update': {
		input: NextDNSEndpointInputSchemas['settings.update'],
		output: NextDNSEndpointOutputSchemas['settings.update'],
	},
	'settings.getBlockPage': {
		input: NextDNSEndpointInputSchemas['settings.getBlockPage'],
		output: NextDNSEndpointOutputSchemas['settings.getBlockPage'],
	},
	'settings.updateBlockPage': {
		input: NextDNSEndpointInputSchemas['settings.updateBlockPage'],
		output: NextDNSEndpointOutputSchemas['settings.updateBlockPage'],
	},
	'settings.getLogs': {
		input: NextDNSEndpointInputSchemas['settings.getLogs'],
		output: NextDNSEndpointOutputSchemas['settings.getLogs'],
	},
	'settings.updateLogs': {
		input: NextDNSEndpointInputSchemas['settings.updateLogs'],
		output: NextDNSEndpointOutputSchemas['settings.updateLogs'],
	},
	'settings.getPerformance': {
		input: NextDNSEndpointInputSchemas['settings.getPerformance'],
		output: NextDNSEndpointOutputSchemas['settings.getPerformance'],
	},
	'settings.updatePerformance': {
		input: NextDNSEndpointInputSchemas['settings.updatePerformance'],
		output: NextDNSEndpointOutputSchemas['settings.updatePerformance'],
	},
	'settings.logClientIps': {
		input: NextDNSEndpointInputSchemas['settings.logClientIps'],
		output: NextDNSEndpointOutputSchemas['settings.logClientIps'],
	},
	'settings.logDomains': {
		input: NextDNSEndpointInputSchemas['settings.logDomains'],
		output: NextDNSEndpointOutputSchemas['settings.logDomains'],
	},
	'security.get': {
		input: NextDNSEndpointInputSchemas['security.get'],
		output: NextDNSEndpointOutputSchemas['security.get'],
	},
	'security.update': {
		input: NextDNSEndpointInputSchemas['security.update'],
		output: NextDNSEndpointOutputSchemas['security.update'],
	},
	'security.getTlds': {
		input: NextDNSEndpointInputSchemas['security.getTlds'],
		output: NextDNSEndpointOutputSchemas['security.getTlds'],
	},
	'security.addBlockedTld': {
		input: NextDNSEndpointInputSchemas['security.addBlockedTld'],
		output: NextDNSEndpointOutputSchemas['security.addBlockedTld'],
	},
	'security.removeBlockedTld': {
		input: NextDNSEndpointInputSchemas['security.removeBlockedTld'],
		output: NextDNSEndpointOutputSchemas['security.removeBlockedTld'],
	},
	'security.replaceTlds': {
		input: NextDNSEndpointInputSchemas['security.replaceTlds'],
		output: NextDNSEndpointOutputSchemas['security.replaceTlds'],
	},
	'privacy.get': {
		input: NextDNSEndpointInputSchemas['privacy.get'],
		output: NextDNSEndpointOutputSchemas['privacy.get'],
	},
	'privacy.update': {
		input: NextDNSEndpointInputSchemas['privacy.update'],
		output: NextDNSEndpointOutputSchemas['privacy.update'],
	},
	'privacy.addBlocklist': {
		input: NextDNSEndpointInputSchemas['privacy.addBlocklist'],
		output: NextDNSEndpointOutputSchemas['privacy.addBlocklist'],
	},
	'privacy.deleteBlocklist': {
		input: NextDNSEndpointInputSchemas['privacy.deleteBlocklist'],
		output: NextDNSEndpointOutputSchemas['privacy.deleteBlocklist'],
	},
	'privacy.replaceBlocklists': {
		input: NextDNSEndpointInputSchemas['privacy.replaceBlocklists'],
		output: NextDNSEndpointOutputSchemas['privacy.replaceBlocklists'],
	},
	'privacy.addNative': {
		input: NextDNSEndpointInputSchemas['privacy.addNative'],
		output: NextDNSEndpointOutputSchemas['privacy.addNative'],
	},
	'privacy.deleteNative': {
		input: NextDNSEndpointInputSchemas['privacy.deleteNative'],
		output: NextDNSEndpointOutputSchemas['privacy.deleteNative'],
	},
	'privacy.replaceNatives': {
		input: NextDNSEndpointInputSchemas['privacy.replaceNatives'],
		output: NextDNSEndpointOutputSchemas['privacy.replaceNatives'],
	},
	'parentalControl.get': {
		input: NextDNSEndpointInputSchemas['parentalControl.get'],
		output: NextDNSEndpointOutputSchemas['parentalControl.get'],
	},
	'parentalControl.update': {
		input: NextDNSEndpointInputSchemas['parentalControl.update'],
		output: NextDNSEndpointOutputSchemas['parentalControl.update'],
	},
	'parentalControl.getCategories': {
		input: NextDNSEndpointInputSchemas['parentalControl.getCategories'],
		output: NextDNSEndpointOutputSchemas['parentalControl.getCategories'],
	},
	'parentalControl.addCategory': {
		input: NextDNSEndpointInputSchemas['parentalControl.addCategory'],
		output: NextDNSEndpointOutputSchemas['parentalControl.addCategory'],
	},
	'parentalControl.deleteCategory': {
		input: NextDNSEndpointInputSchemas['parentalControl.deleteCategory'],
		output: NextDNSEndpointOutputSchemas['parentalControl.deleteCategory'],
	},
	'parentalControl.updateCategory': {
		input: NextDNSEndpointInputSchemas['parentalControl.updateCategory'],
		output: NextDNSEndpointOutputSchemas['parentalControl.updateCategory'],
	},
	'parentalControl.replaceCategories': {
		input: NextDNSEndpointInputSchemas['parentalControl.replaceCategories'],
		output: NextDNSEndpointOutputSchemas['parentalControl.replaceCategories'],
	},
	'parentalControl.getServices': {
		input: NextDNSEndpointInputSchemas['parentalControl.getServices'],
		output: NextDNSEndpointOutputSchemas['parentalControl.getServices'],
	},
	'parentalControl.addService': {
		input: NextDNSEndpointInputSchemas['parentalControl.addService'],
		output: NextDNSEndpointOutputSchemas['parentalControl.addService'],
	},
	'parentalControl.deleteService': {
		input: NextDNSEndpointInputSchemas['parentalControl.deleteService'],
		output: NextDNSEndpointOutputSchemas['parentalControl.deleteService'],
	},
	'parentalControl.updateService': {
		input: NextDNSEndpointInputSchemas['parentalControl.updateService'],
		output: NextDNSEndpointOutputSchemas['parentalControl.updateService'],
	},
	'parentalControl.replaceServices': {
		input: NextDNSEndpointInputSchemas['parentalControl.replaceServices'],
		output: NextDNSEndpointOutputSchemas['parentalControl.replaceServices'],
	},
	'denylist.list': {
		input: NextDNSEndpointInputSchemas['denylist.list'],
		output: NextDNSEndpointOutputSchemas['denylist.list'],
	},
	'denylist.add': {
		input: NextDNSEndpointInputSchemas['denylist.add'],
		output: NextDNSEndpointOutputSchemas['denylist.add'],
	},
	'denylist.remove': {
		input: NextDNSEndpointInputSchemas['denylist.remove'],
		output: NextDNSEndpointOutputSchemas['denylist.remove'],
	},
	'denylist.update': {
		input: NextDNSEndpointInputSchemas['denylist.update'],
		output: NextDNSEndpointOutputSchemas['denylist.update'],
	},
	'denylist.replace': {
		input: NextDNSEndpointInputSchemas['denylist.replace'],
		output: NextDNSEndpointOutputSchemas['denylist.replace'],
	},
	'allowlist.get': {
		input: NextDNSEndpointInputSchemas['allowlist.get'],
		output: NextDNSEndpointOutputSchemas['allowlist.get'],
	},
	'allowlist.add': {
		input: NextDNSEndpointInputSchemas['allowlist.add'],
		output: NextDNSEndpointOutputSchemas['allowlist.add'],
	},
	'allowlist.delete': {
		input: NextDNSEndpointInputSchemas['allowlist.delete'],
		output: NextDNSEndpointOutputSchemas['allowlist.delete'],
	},
	'allowlist.update': {
		input: NextDNSEndpointInputSchemas['allowlist.update'],
		output: NextDNSEndpointOutputSchemas['allowlist.update'],
	},
	'allowlist.replace': {
		input: NextDNSEndpointInputSchemas['allowlist.replace'],
		output: NextDNSEndpointOutputSchemas['allowlist.replace'],
	},
	'rewrites.get': {
		input: NextDNSEndpointInputSchemas['rewrites.get'],
		output: NextDNSEndpointOutputSchemas['rewrites.get'],
	},
	'rewrites.add': {
		input: NextDNSEndpointInputSchemas['rewrites.add'],
		output: NextDNSEndpointOutputSchemas['rewrites.add'],
	},
	'rewrites.delete': {
		input: NextDNSEndpointInputSchemas['rewrites.delete'],
		output: NextDNSEndpointOutputSchemas['rewrites.delete'],
	},
	'analytics.status': {
		input: NextDNSEndpointInputSchemas['analytics.status'],
		output: NextDNSEndpointOutputSchemas['analytics.status'],
	},
	'analytics.domains': {
		input: NextDNSEndpointInputSchemas['analytics.domains'],
		output: NextDNSEndpointOutputSchemas['analytics.domains'],
	},
	'analytics.reasons': {
		input: NextDNSEndpointInputSchemas['analytics.reasons'],
		output: NextDNSEndpointOutputSchemas['analytics.reasons'],
	},
	'analytics.ips': {
		input: NextDNSEndpointInputSchemas['analytics.ips'],
		output: NextDNSEndpointOutputSchemas['analytics.ips'],
	},
	'analytics.devices': {
		input: NextDNSEndpointInputSchemas['analytics.devices'],
		output: NextDNSEndpointOutputSchemas['analytics.devices'],
	},
	'analytics.protocols': {
		input: NextDNSEndpointInputSchemas['analytics.protocols'],
		output: NextDNSEndpointOutputSchemas['analytics.protocols'],
	},
	'analytics.queryTypes': {
		input: NextDNSEndpointInputSchemas['analytics.queryTypes'],
		output: NextDNSEndpointOutputSchemas['analytics.queryTypes'],
	},
	'analytics.ipVersions': {
		input: NextDNSEndpointInputSchemas['analytics.ipVersions'],
		output: NextDNSEndpointOutputSchemas['analytics.ipVersions'],
	},
	'analytics.dnssec': {
		input: NextDNSEndpointInputSchemas['analytics.dnssec'],
		output: NextDNSEndpointOutputSchemas['analytics.dnssec'],
	},
	'analytics.encryption': {
		input: NextDNSEndpointInputSchemas['analytics.encryption'],
		output: NextDNSEndpointOutputSchemas['analytics.encryption'],
	},
	'analytics.destinations': {
		input: NextDNSEndpointInputSchemas['analytics.destinations'],
		output: NextDNSEndpointOutputSchemas['analytics.destinations'],
	},
	'logs.get': {
		input: NextDNSEndpointInputSchemas['logs.get'],
		output: NextDNSEndpointOutputSchemas['logs.get'],
	},
	'logs.download': {
		input: NextDNSEndpointInputSchemas['logs.download'],
		output: NextDNSEndpointOutputSchemas['logs.download'],
	},
	'logs.clear': {
		input: NextDNSEndpointInputSchemas['logs.clear'],
		output: NextDNSEndpointOutputSchemas['logs.clear'],
	},
	'setup.updateLinkedIp': {
		input: NextDNSEndpointInputSchemas['setup.updateLinkedIp'],
		output: NextDNSEndpointOutputSchemas['setup.updateLinkedIp'],
	},
	'auth.login': {
		input: NextDNSEndpointInputSchemas['auth.login'],
		output: NextDNSEndpointOutputSchemas['auth.login'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof nextDNSEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * `irreversible: true` marks the handful of operations the catalog itself
 * warns cannot be undone (deleting a profile, clearing logs). `destructive`
 * (without `irreversible`) marks full-replace (`PUT`) operations - a caller
 * who sends a partial list silently drops every entry not included, which
 * is a real way to lose configuration even though the entries could in
 * principle be re-added by hand.
 */
const nextDNSEndpointMeta = {
	'profiles.list': {
		riskLevel: 'read',
		description: 'List every profile the API key can see',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get full profile details including nested settings and lists',
	},
	'profiles.create': {
		riskLevel: 'write',
		description: 'Create a new profile',
	},
	'profiles.update': {
		riskLevel: 'write',
		description: 'Partially update a profile',
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a profile - cannot be undone',
	},
	'profiles.rename': { riskLevel: 'write', description: 'Rename a profile' },

	'settings.get': {
		riskLevel: 'read',
		description: 'Get all settings for a profile',
	},
	'settings.update': {
		riskLevel: 'write',
		description: 'Update multiple settings categories in one call',
	},
	'settings.getBlockPage': {
		riskLevel: 'read',
		description: 'Get block page settings',
	},
	'settings.updateBlockPage': {
		riskLevel: 'write',
		description: 'Enable or disable the branded block page',
	},
	'settings.getLogs': {
		riskLevel: 'read',
		description: 'Get logging settings',
	},
	'settings.updateLogs': {
		riskLevel: 'write',
		description: 'Update log retention, storage location, and privacy options',
	},
	'settings.getPerformance': {
		riskLevel: 'read',
		description:
			'Get performance settings (ECS, cache boost, CNAME flattening)',
	},
	'settings.updatePerformance': {
		riskLevel: 'write',
		description: 'Update performance optimization settings',
	},
	'settings.logClientIps': {
		riskLevel: 'write',
		description: 'Enable or disable logging of client IPs',
	},
	'settings.logDomains': {
		riskLevel: 'write',
		description: 'Enable or disable logging of queried domains',
	},

	'security.get': { riskLevel: 'read', description: 'Get security settings' },
	'security.update': {
		riskLevel: 'write',
		description: 'Update multiple security settings in one call',
	},
	'security.getTlds': {
		riskLevel: 'read',
		description: 'Get blocked top-level domains',
	},
	'security.addBlockedTld': {
		riskLevel: 'write',
		description: 'Add a top-level domain to the security blocklist',
	},
	'security.removeBlockedTld': {
		riskLevel: 'write',
		description: 'Remove a top-level domain from the security blocklist',
	},
	'security.replaceTlds': {
		riskLevel: 'destructive',
		description: 'Replace the entire blocked-TLD list',
	},

	'privacy.get': { riskLevel: 'read', description: 'Get privacy settings' },
	'privacy.update': {
		riskLevel: 'write',
		description: 'Update disguised-tracker and affiliate-link settings',
	},
	'privacy.addBlocklist': {
		riskLevel: 'write',
		description: 'Enable an additional privacy blocklist',
	},
	'privacy.deleteBlocklist': {
		riskLevel: 'write',
		description: 'Remove a privacy blocklist',
	},
	'privacy.replaceBlocklists': {
		riskLevel: 'destructive',
		description: 'Replace the entire set of enabled privacy blocklists',
	},
	'privacy.addNative': {
		riskLevel: 'write',
		description: 'Block a native tracking service from a specific vendor',
	},
	'privacy.deleteNative': {
		riskLevel: 'write',
		description: 'Unblock a native tracking service',
	},
	'privacy.replaceNatives': {
		riskLevel: 'destructive',
		description: 'Replace the entire set of blocked native trackers',
	},

	'parentalControl.get': {
		riskLevel: 'read',
		description: 'Get parental control settings',
	},
	'parentalControl.update': {
		riskLevel: 'write',
		description:
			'Update safe search, YouTube restricted mode, or bypass blocking',
	},
	'parentalControl.getCategories': {
		riskLevel: 'read',
		description: 'Get blocked/allowed content categories',
	},
	'parentalControl.addCategory': {
		riskLevel: 'write',
		description: 'Block or allow a content category',
	},
	'parentalControl.deleteCategory': {
		riskLevel: 'write',
		description: 'Remove a content category restriction',
	},
	'parentalControl.updateCategory': {
		riskLevel: 'write',
		description: 'Toggle a content category restriction',
	},
	'parentalControl.replaceCategories': {
		riskLevel: 'destructive',
		description: 'Replace the entire set of category restrictions',
	},
	'parentalControl.getServices': {
		riskLevel: 'read',
		description: 'Get blocked/allowed services',
	},
	'parentalControl.addService': {
		riskLevel: 'write',
		description: 'Block or allow a specific service',
	},
	'parentalControl.deleteService': {
		riskLevel: 'write',
		description: 'Remove a service restriction',
	},
	'parentalControl.updateService': {
		riskLevel: 'write',
		description: 'Toggle a service restriction',
	},
	'parentalControl.replaceServices': {
		riskLevel: 'destructive',
		description: 'Replace the entire set of service restrictions',
	},

	'denylist.list': { riskLevel: 'read', description: 'List blocked domains' },
	'denylist.add': { riskLevel: 'write', description: 'Block a domain' },
	'denylist.remove': { riskLevel: 'write', description: 'Unblock a domain' },
	'denylist.update': {
		riskLevel: 'write',
		description: 'Toggle a denylist entry active/inactive',
	},
	'denylist.replace': {
		riskLevel: 'destructive',
		description: 'Replace the entire denylist',
	},

	'allowlist.get': { riskLevel: 'read', description: 'List allowed domains' },
	'allowlist.add': { riskLevel: 'write', description: 'Allow a domain' },
	'allowlist.delete': {
		riskLevel: 'write',
		description: 'Remove a domain from the allowlist',
	},
	'allowlist.update': {
		riskLevel: 'write',
		description: 'Toggle an allowlist entry active/inactive',
	},
	'allowlist.replace': {
		riskLevel: 'destructive',
		description: 'Replace the entire allowlist',
	},

	'rewrites.get': { riskLevel: 'read', description: 'List DNS rewrite rules' },
	'rewrites.add': { riskLevel: 'write', description: 'Add a DNS rewrite rule' },
	'rewrites.delete': {
		riskLevel: 'write',
		description: 'Delete a DNS rewrite rule',
	},

	'analytics.status': {
		riskLevel: 'read',
		description: 'Get query-status analytics',
	},
	'analytics.domains': {
		riskLevel: 'read',
		description: 'Get per-domain analytics',
	},
	'analytics.reasons': {
		riskLevel: 'read',
		description: 'Get blocking-reason analytics',
	},
	'analytics.ips': {
		riskLevel: 'read',
		description: 'Get per-client-IP analytics',
	},
	'analytics.devices': {
		riskLevel: 'read',
		description: 'Get per-device analytics',
	},
	'analytics.protocols': {
		riskLevel: 'read',
		description: 'Get DNS protocol distribution analytics',
	},
	'analytics.queryTypes': {
		riskLevel: 'read',
		description: 'Get DNS query-type analytics',
	},
	'analytics.ipVersions': {
		riskLevel: 'read',
		description: 'Get IPv4/IPv6 distribution analytics',
	},
	'analytics.dnssec': {
		riskLevel: 'read',
		description: 'Get DNSSEC validation analytics',
	},
	'analytics.encryption': {
		riskLevel: 'read',
		description: 'Get encrypted-vs-plain DNS analytics',
	},
	'analytics.destinations': {
		riskLevel: 'read',
		description: 'Get query-destination analytics',
	},

	'logs.get': {
		riskLevel: 'read',
		description: 'Get raw or filtered DNS query logs',
	},
	'logs.download': {
		riskLevel: 'read',
		description: 'Download the CSV log export',
	},
	'logs.clear': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Clear all stored query logs - cannot be undone',
	},

	'setup.updateLinkedIp': {
		riskLevel: 'write',
		description:
			"Update the profile's Linked IP to the caller's current public IP",
	},

	'auth.login': {
		riskLevel: 'read',
		description: 'Verify the API key is valid',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nextDNSEndpointsNested>;

export const nextDNSAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseNextDNSPlugin<T extends NextDNSPluginOptions> = CorsairPlugin<
	'nextdns',
	typeof NextDNSSchema,
	typeof nextDNSEndpointsNested,
	typeof nextDNSWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalNextDNSPlugin = BaseNextDNSPlugin<NextDNSPluginOptions>;

export type ExternalNextDNSPlugin<T extends NextDNSPluginOptions> =
	BaseNextDNSPlugin<T>;

export function nextdns<const T extends NextDNSPluginOptions>(
	incomingOptions: NextDNSPluginOptions & T = {} as NextDNSPluginOptions & T,
): ExternalNextDNSPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nextdns',
		authConfig: nextDNSAuthConfig,
		schema: NextDNSSchema,
		options: options,
		hooks: options.hooks,
		endpoints: nextDNSEndpointsNested,
		webhooks: nextDNSWebhooksNested,
		endpointMeta: nextDNSEndpointMeta,
		endpointSchemas: nextDNSEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NextDNSKeyBuilderContext) => {
			if (options.key) return options.key;
			const res = await ctx.keys.get_api_key();
			return res ?? '';
		},
	} satisfies InternalNextDNSPlugin;
}

export type {
	NextDNSEndpointInputs,
	NextDNSEndpointOutputs,
} from './endpoints/types';
