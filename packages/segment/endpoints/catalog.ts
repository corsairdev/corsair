// Generated with endpoints/operation-types.ts from Segment's OpenAPI spec:
// one entry per operation in segment-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { segmentSchemaEntry } from './openapi-schema';
import { createSegmentOperation as op } from './operations';

export const segmentEndpointsNested = {
	activations: {
		batchQuery: op('activations.batchQuery'),
		create: op('activations.create'),
		delete: op('activations.delete'),
		get: op('activations.get'),
		list: op('activations.list'),
		update: op('activations.update'),
	},
	audiences: {
		create: op('audiences.create'),
		createPreview: op('audiences.createPreview'),
		delete: op('audiences.delete'),
		destinations: {
			add: op('audiences.destinations.add'),
			list: op('audiences.destinations.list'),
			listSupported: op('audiences.destinations.listSupported'),
			remove: op('audiences.destinations.remove'),
			update: op('audiences.destinations.update'),
		},
		get: op('audiences.get'),
		getPreview: op('audiences.getPreview'),
		list: op('audiences.list'),
		listConsumers: op('audiences.listConsumers'),
		run: op('audiences.run'),
		schedules: {
			create: op('audiences.schedules.create'),
			delete: op('audiences.schedules.delete'),
			get: op('audiences.schedules.get'),
			list: op('audiences.schedules.list'),
			update: op('audiences.schedules.update'),
		},
		update: op('audiences.update'),
	},
	auditTrail: {
		list: op('auditTrail.list'),
	},
	catalog: {
		getDestination: op('catalog.getDestination'),
		getSource: op('catalog.getSource'),
		getWarehouse: op('catalog.getWarehouse'),
		listDestinations: op('catalog.listDestinations'),
		listSources: op('catalog.listSources'),
		listWarehouses: op('catalog.listWarehouses'),
	},
	computedTraits: {
		create: op('computedTraits.create'),
		delete: op('computedTraits.delete'),
		get: op('computedTraits.get'),
		list: op('computedTraits.list'),
		update: op('computedTraits.update'),
	},
	credentials: {
		create: op('credentials.create'),
		delete: op('credentials.delete'),
		get: op('credentials.get'),
		list: op('credentials.list'),
		listConsumers: op('credentials.listConsumers'),
		update: op('credentials.update'),
	},
	customerInsights: {
		createDownload: op('customerInsights.createDownload'),
	},
	dbt: {
		triggerModelSync: op('dbt.triggerModelSync'),
	},
	deliveryOverview: {
		getFailedDelivery: op('deliveryOverview.getFailedDelivery'),
		getFailedOnIngest: op('deliveryOverview.getFailedOnIngest'),
		getFilteredAtDestination: op('deliveryOverview.getFilteredAtDestination'),
		getFilteredAtSource: op('deliveryOverview.getFilteredAtSource'),
		getSuccessfulDelivery: op('deliveryOverview.getSuccessfulDelivery'),
		getSuccessfullyReceived: op('deliveryOverview.getSuccessfullyReceived'),
	},
	destinations: {
		create: op('destinations.create'),
		delete: op('destinations.delete'),
		filters: {
			create: op('destinations.filters.create'),
			delete: op('destinations.filters.delete'),
			get: op('destinations.filters.get'),
			list: op('destinations.filters.list'),
			preview: op('destinations.filters.preview'),
			update: op('destinations.filters.update'),
		},
		get: op('destinations.get'),
		getDeliveryMetrics: op('destinations.getDeliveryMetrics'),
		list: op('destinations.list'),
		subscriptions: {
			create: op('destinations.subscriptions.create'),
			delete: op('destinations.subscriptions.delete'),
			get: op('destinations.subscriptions.get'),
			list: op('destinations.subscriptions.list'),
			update: op('destinations.subscriptions.update'),
		},
		update: op('destinations.update'),
	},
	events: {
		getVolume: op('events.getVolume'),
	},
	filters: {
		create: op('filters.create'),
		delete: op('filters.delete'),
		get: op('filters.get'),
		list: op('filters.list'),
		update: op('filters.update'),
	},
	functions: {
		create: op('functions.create'),
		delete: op('functions.delete'),
		deploy: op('functions.deploy'),
		get: op('functions.get'),
		getVersion: op('functions.getVersion'),
		insertInstances: {
			create: op('functions.insertInstances.create'),
			delete: op('functions.insertInstances.delete'),
			get: op('functions.insertInstances.get'),
			list: op('functions.insertInstances.list'),
			update: op('functions.insertInstances.update'),
		},
		list: op('functions.list'),
		listVersions: op('functions.listVersions'),
		restoreVersion: op('functions.restoreVersion'),
		update: op('functions.update'),
	},
	invites: {
		create: op('invites.create'),
		delete: op('invites.delete'),
		list: op('invites.list'),
	},
	labels: {
		create: op('labels.create'),
		delete: op('labels.delete'),
		list: op('labels.list'),
	},
	livePlugins: {
		create: op('livePlugins.create'),
		deleteCode: op('livePlugins.deleteCode'),
		getLatest: op('livePlugins.getLatest'),
	},
	profilesSync: {
		create: op('profilesSync.create'),
		delete: op('profilesSync.delete'),
		list: op('profilesSync.list'),
		listSelectiveSyncs: op('profilesSync.listSelectiveSyncs'),
		update: op('profilesSync.update'),
		updateSelectiveSync: op('profilesSync.updateSelectiveSync'),
	},
	regulations: {
		create: op('regulations.create'),
		createForCloudSource: op('regulations.createForCloudSource'),
		createForSource: op('regulations.createForSource'),
		get: op('regulations.get'),
		list: op('regulations.list'),
		listForSource: op('regulations.listForSource'),
		listSuppressions: op('regulations.listSuppressions'),
	},
	reverseEtl: {
		models: {
			create: op('reverseEtl.models.create'),
			delete: op('reverseEtl.models.delete'),
			get: op('reverseEtl.models.get'),
			list: op('reverseEtl.models.list'),
			update: op('reverseEtl.models.update'),
		},
		syncs: {
			cancel: op('reverseEtl.syncs.cancel'),
			create: op('reverseEtl.syncs.create'),
			get: op('reverseEtl.syncs.get'),
			list: op('reverseEtl.syncs.list'),
		},
	},
	roles: {
		list: op('roles.list'),
	},
	sources: {
		addLabels: op('sources.addLabels'),
		create: op('sources.create'),
		createWriteKey: op('sources.createWriteKey'),
		delete: op('sources.delete'),
		get: op('sources.get'),
		getSchemaSettings: op('sources.getSchemaSettings'),
		list: op('sources.list'),
		listConnectedDestinations: op('sources.listConnectedDestinations'),
		listConnectedWarehouses: op('sources.listConnectedWarehouses'),
		removeWriteKey: op('sources.removeWriteKey'),
		replaceLabels: op('sources.replaceLabels'),
		update: op('sources.update'),
		updateSchemaSettings: op('sources.updateSchemaSettings'),
	},
	spaces: {
		get: op('spaces.get'),
		list: op('spaces.list'),
		schema: {
			listEntityPaths: op('spaces.schema.listEntityPaths'),
			listEntityProperties: op('spaces.schema.listEntityProperties'),
			listEntityPropertySampleValues: op(
				'spaces.schema.listEntityPropertySampleValues',
			),
			listEventProperties: op('spaces.schema.listEventProperties'),
			listEventPropertySampleValues: op(
				'spaces.schema.listEventPropertySampleValues',
			),
			listEvents: op('spaces.schema.listEvents'),
			listTraitSampleValues: op('spaces.schema.listTraitSampleValues'),
			listTraits: op('spaces.schema.listTraits'),
		},
	},
	testing: {
		echo: op('testing.echo'),
	},
	tracking: {
		alias: op('tracking.alias'),
		batch: op('tracking.batch'),
		group: op('tracking.group'),
		identify: op('tracking.identify'),
		page: op('tracking.page'),
		screen: op('tracking.screen'),
		track: op('tracking.track'),
	},
	trackingPlans: {
		addSource: op('trackingPlans.addSource'),
		create: op('trackingPlans.create'),
		delete: op('trackingPlans.delete'),
		get: op('trackingPlans.get'),
		list: op('trackingPlans.list'),
		listRules: op('trackingPlans.listRules'),
		listSources: op('trackingPlans.listSources'),
		removeRules: op('trackingPlans.removeRules'),
		removeSource: op('trackingPlans.removeSource'),
		replaceRules: op('trackingPlans.replaceRules'),
		update: op('trackingPlans.update'),
		updateRules: op('trackingPlans.updateRules'),
	},
	transformations: {
		create: op('transformations.create'),
		delete: op('transformations.delete'),
		get: op('transformations.get'),
		list: op('transformations.list'),
		update: op('transformations.update'),
	},
	usage: {
		getDailyApiCalls: op('usage.getDailyApiCalls'),
		getDailyApiCallsBySource: op('usage.getDailyApiCallsBySource'),
		getDailyMtu: op('usage.getDailyMtu'),
		getDailyMtuBySource: op('usage.getDailyMtuBySource'),
	},
	userGroups: {
		addPermissions: op('userGroups.addPermissions'),
		addUsers: op('userGroups.addUsers'),
		create: op('userGroups.create'),
		delete: op('userGroups.delete'),
		get: op('userGroups.get'),
		list: op('userGroups.list'),
		listInvites: op('userGroups.listInvites'),
		listUsers: op('userGroups.listUsers'),
		removeUsers: op('userGroups.removeUsers'),
		replacePermissions: op('userGroups.replacePermissions'),
		replaceUsers: op('userGroups.replaceUsers'),
		update: op('userGroups.update'),
	},
	users: {
		addPermissions: op('users.addPermissions'),
		delete: op('users.delete'),
		get: op('users.get'),
		list: op('users.list'),
		listGroups: op('users.listGroups'),
		replacePermissions: op('users.replacePermissions'),
	},
	warehouses: {
		addSourceConnection: op('warehouses.addSourceConnection'),
		create: op('warehouses.create'),
		delete: op('warehouses.delete'),
		get: op('warehouses.get'),
		getAdvancedSyncSchedule: op('warehouses.getAdvancedSyncSchedule'),
		getConnectionState: op('warehouses.getConnectionState'),
		list: op('warehouses.list'),
		listConnectedSources: op('warehouses.listConnectedSources'),
		listSelectiveSyncs: op('warehouses.listSelectiveSyncs'),
		listSourceSyncs: op('warehouses.listSourceSyncs'),
		listSyncs: op('warehouses.listSyncs'),
		removeSourceConnection: op('warehouses.removeSourceConnection'),
		replaceAdvancedSyncSchedule: op('warehouses.replaceAdvancedSyncSchedule'),
		update: op('warehouses.update'),
		updateSelectiveSync: op('warehouses.updateSelectiveSync'),
		validate: op('warehouses.validate'),
	},
	workspaces: {
		get: op('workspaces.get'),
	},
} as const;

export const segmentEndpointSchemas = {
	'activations.batchQuery': segmentSchemaEntry('activations.batchQuery'),
	'activations.create': segmentSchemaEntry('activations.create'),
	'activations.delete': segmentSchemaEntry('activations.delete'),
	'activations.get': segmentSchemaEntry('activations.get'),
	'activations.list': segmentSchemaEntry('activations.list'),
	'activations.update': segmentSchemaEntry('activations.update'),
	'audiences.create': segmentSchemaEntry('audiences.create'),
	'audiences.createPreview': segmentSchemaEntry('audiences.createPreview'),
	'audiences.delete': segmentSchemaEntry('audiences.delete'),
	'audiences.destinations.add': segmentSchemaEntry(
		'audiences.destinations.add',
	),
	'audiences.destinations.list': segmentSchemaEntry(
		'audiences.destinations.list',
	),
	'audiences.destinations.listSupported': segmentSchemaEntry(
		'audiences.destinations.listSupported',
	),
	'audiences.destinations.remove': segmentSchemaEntry(
		'audiences.destinations.remove',
	),
	'audiences.destinations.update': segmentSchemaEntry(
		'audiences.destinations.update',
	),
	'audiences.get': segmentSchemaEntry('audiences.get'),
	'audiences.getPreview': segmentSchemaEntry('audiences.getPreview'),
	'audiences.list': segmentSchemaEntry('audiences.list'),
	'audiences.listConsumers': segmentSchemaEntry('audiences.listConsumers'),
	'audiences.run': segmentSchemaEntry('audiences.run'),
	'audiences.schedules.create': segmentSchemaEntry(
		'audiences.schedules.create',
	),
	'audiences.schedules.delete': segmentSchemaEntry(
		'audiences.schedules.delete',
	),
	'audiences.schedules.get': segmentSchemaEntry('audiences.schedules.get'),
	'audiences.schedules.list': segmentSchemaEntry('audiences.schedules.list'),
	'audiences.schedules.update': segmentSchemaEntry(
		'audiences.schedules.update',
	),
	'audiences.update': segmentSchemaEntry('audiences.update'),
	'auditTrail.list': segmentSchemaEntry('auditTrail.list'),
	'catalog.getDestination': segmentSchemaEntry('catalog.getDestination'),
	'catalog.getSource': segmentSchemaEntry('catalog.getSource'),
	'catalog.getWarehouse': segmentSchemaEntry('catalog.getWarehouse'),
	'catalog.listDestinations': segmentSchemaEntry('catalog.listDestinations'),
	'catalog.listSources': segmentSchemaEntry('catalog.listSources'),
	'catalog.listWarehouses': segmentSchemaEntry('catalog.listWarehouses'),
	'computedTraits.create': segmentSchemaEntry('computedTraits.create'),
	'computedTraits.delete': segmentSchemaEntry('computedTraits.delete'),
	'computedTraits.get': segmentSchemaEntry('computedTraits.get'),
	'computedTraits.list': segmentSchemaEntry('computedTraits.list'),
	'computedTraits.update': segmentSchemaEntry('computedTraits.update'),
	'credentials.create': segmentSchemaEntry('credentials.create'),
	'credentials.delete': segmentSchemaEntry('credentials.delete'),
	'credentials.get': segmentSchemaEntry('credentials.get'),
	'credentials.list': segmentSchemaEntry('credentials.list'),
	'credentials.listConsumers': segmentSchemaEntry('credentials.listConsumers'),
	'credentials.update': segmentSchemaEntry('credentials.update'),
	'customerInsights.createDownload': segmentSchemaEntry(
		'customerInsights.createDownload',
	),
	'dbt.triggerModelSync': segmentSchemaEntry('dbt.triggerModelSync'),
	'deliveryOverview.getFailedDelivery': segmentSchemaEntry(
		'deliveryOverview.getFailedDelivery',
	),
	'deliveryOverview.getFailedOnIngest': segmentSchemaEntry(
		'deliveryOverview.getFailedOnIngest',
	),
	'deliveryOverview.getFilteredAtDestination': segmentSchemaEntry(
		'deliveryOverview.getFilteredAtDestination',
	),
	'deliveryOverview.getFilteredAtSource': segmentSchemaEntry(
		'deliveryOverview.getFilteredAtSource',
	),
	'deliveryOverview.getSuccessfulDelivery': segmentSchemaEntry(
		'deliveryOverview.getSuccessfulDelivery',
	),
	'deliveryOverview.getSuccessfullyReceived': segmentSchemaEntry(
		'deliveryOverview.getSuccessfullyReceived',
	),
	'destinations.create': segmentSchemaEntry('destinations.create'),
	'destinations.delete': segmentSchemaEntry('destinations.delete'),
	'destinations.filters.create': segmentSchemaEntry(
		'destinations.filters.create',
	),
	'destinations.filters.delete': segmentSchemaEntry(
		'destinations.filters.delete',
	),
	'destinations.filters.get': segmentSchemaEntry('destinations.filters.get'),
	'destinations.filters.list': segmentSchemaEntry('destinations.filters.list'),
	'destinations.filters.preview': segmentSchemaEntry(
		'destinations.filters.preview',
	),
	'destinations.filters.update': segmentSchemaEntry(
		'destinations.filters.update',
	),
	'destinations.get': segmentSchemaEntry('destinations.get'),
	'destinations.getDeliveryMetrics': segmentSchemaEntry(
		'destinations.getDeliveryMetrics',
	),
	'destinations.list': segmentSchemaEntry('destinations.list'),
	'destinations.subscriptions.create': segmentSchemaEntry(
		'destinations.subscriptions.create',
	),
	'destinations.subscriptions.delete': segmentSchemaEntry(
		'destinations.subscriptions.delete',
	),
	'destinations.subscriptions.get': segmentSchemaEntry(
		'destinations.subscriptions.get',
	),
	'destinations.subscriptions.list': segmentSchemaEntry(
		'destinations.subscriptions.list',
	),
	'destinations.subscriptions.update': segmentSchemaEntry(
		'destinations.subscriptions.update',
	),
	'destinations.update': segmentSchemaEntry('destinations.update'),
	'events.getVolume': segmentSchemaEntry('events.getVolume'),
	'filters.create': segmentSchemaEntry('filters.create'),
	'filters.delete': segmentSchemaEntry('filters.delete'),
	'filters.get': segmentSchemaEntry('filters.get'),
	'filters.list': segmentSchemaEntry('filters.list'),
	'filters.update': segmentSchemaEntry('filters.update'),
	'functions.create': segmentSchemaEntry('functions.create'),
	'functions.delete': segmentSchemaEntry('functions.delete'),
	'functions.deploy': segmentSchemaEntry('functions.deploy'),
	'functions.get': segmentSchemaEntry('functions.get'),
	'functions.getVersion': segmentSchemaEntry('functions.getVersion'),
	'functions.insertInstances.create': segmentSchemaEntry(
		'functions.insertInstances.create',
	),
	'functions.insertInstances.delete': segmentSchemaEntry(
		'functions.insertInstances.delete',
	),
	'functions.insertInstances.get': segmentSchemaEntry(
		'functions.insertInstances.get',
	),
	'functions.insertInstances.list': segmentSchemaEntry(
		'functions.insertInstances.list',
	),
	'functions.insertInstances.update': segmentSchemaEntry(
		'functions.insertInstances.update',
	),
	'functions.list': segmentSchemaEntry('functions.list'),
	'functions.listVersions': segmentSchemaEntry('functions.listVersions'),
	'functions.restoreVersion': segmentSchemaEntry('functions.restoreVersion'),
	'functions.update': segmentSchemaEntry('functions.update'),
	'invites.create': segmentSchemaEntry('invites.create'),
	'invites.delete': segmentSchemaEntry('invites.delete'),
	'invites.list': segmentSchemaEntry('invites.list'),
	'labels.create': segmentSchemaEntry('labels.create'),
	'labels.delete': segmentSchemaEntry('labels.delete'),
	'labels.list': segmentSchemaEntry('labels.list'),
	'livePlugins.create': segmentSchemaEntry('livePlugins.create'),
	'livePlugins.deleteCode': segmentSchemaEntry('livePlugins.deleteCode'),
	'livePlugins.getLatest': segmentSchemaEntry('livePlugins.getLatest'),
	'profilesSync.create': segmentSchemaEntry('profilesSync.create'),
	'profilesSync.delete': segmentSchemaEntry('profilesSync.delete'),
	'profilesSync.list': segmentSchemaEntry('profilesSync.list'),
	'profilesSync.listSelectiveSyncs': segmentSchemaEntry(
		'profilesSync.listSelectiveSyncs',
	),
	'profilesSync.update': segmentSchemaEntry('profilesSync.update'),
	'profilesSync.updateSelectiveSync': segmentSchemaEntry(
		'profilesSync.updateSelectiveSync',
	),
	'regulations.create': segmentSchemaEntry('regulations.create'),
	'regulations.createForCloudSource': segmentSchemaEntry(
		'regulations.createForCloudSource',
	),
	'regulations.createForSource': segmentSchemaEntry(
		'regulations.createForSource',
	),
	'regulations.get': segmentSchemaEntry('regulations.get'),
	'regulations.list': segmentSchemaEntry('regulations.list'),
	'regulations.listForSource': segmentSchemaEntry('regulations.listForSource'),
	'regulations.listSuppressions': segmentSchemaEntry(
		'regulations.listSuppressions',
	),
	'reverseEtl.models.create': segmentSchemaEntry('reverseEtl.models.create'),
	'reverseEtl.models.delete': segmentSchemaEntry('reverseEtl.models.delete'),
	'reverseEtl.models.get': segmentSchemaEntry('reverseEtl.models.get'),
	'reverseEtl.models.list': segmentSchemaEntry('reverseEtl.models.list'),
	'reverseEtl.models.update': segmentSchemaEntry('reverseEtl.models.update'),
	'reverseEtl.syncs.cancel': segmentSchemaEntry('reverseEtl.syncs.cancel'),
	'reverseEtl.syncs.create': segmentSchemaEntry('reverseEtl.syncs.create'),
	'reverseEtl.syncs.get': segmentSchemaEntry('reverseEtl.syncs.get'),
	'reverseEtl.syncs.list': segmentSchemaEntry('reverseEtl.syncs.list'),
	'roles.list': segmentSchemaEntry('roles.list'),
	'sources.addLabels': segmentSchemaEntry('sources.addLabels'),
	'sources.create': segmentSchemaEntry('sources.create'),
	'sources.createWriteKey': segmentSchemaEntry('sources.createWriteKey'),
	'sources.delete': segmentSchemaEntry('sources.delete'),
	'sources.get': segmentSchemaEntry('sources.get'),
	'sources.getSchemaSettings': segmentSchemaEntry('sources.getSchemaSettings'),
	'sources.list': segmentSchemaEntry('sources.list'),
	'sources.listConnectedDestinations': segmentSchemaEntry(
		'sources.listConnectedDestinations',
	),
	'sources.listConnectedWarehouses': segmentSchemaEntry(
		'sources.listConnectedWarehouses',
	),
	'sources.removeWriteKey': segmentSchemaEntry('sources.removeWriteKey'),
	'sources.replaceLabels': segmentSchemaEntry('sources.replaceLabels'),
	'sources.update': segmentSchemaEntry('sources.update'),
	'sources.updateSchemaSettings': segmentSchemaEntry(
		'sources.updateSchemaSettings',
	),
	'spaces.get': segmentSchemaEntry('spaces.get'),
	'spaces.list': segmentSchemaEntry('spaces.list'),
	'spaces.schema.listEntityPaths': segmentSchemaEntry(
		'spaces.schema.listEntityPaths',
	),
	'spaces.schema.listEntityProperties': segmentSchemaEntry(
		'spaces.schema.listEntityProperties',
	),
	'spaces.schema.listEntityPropertySampleValues': segmentSchemaEntry(
		'spaces.schema.listEntityPropertySampleValues',
	),
	'spaces.schema.listEventProperties': segmentSchemaEntry(
		'spaces.schema.listEventProperties',
	),
	'spaces.schema.listEventPropertySampleValues': segmentSchemaEntry(
		'spaces.schema.listEventPropertySampleValues',
	),
	'spaces.schema.listEvents': segmentSchemaEntry('spaces.schema.listEvents'),
	'spaces.schema.listTraitSampleValues': segmentSchemaEntry(
		'spaces.schema.listTraitSampleValues',
	),
	'spaces.schema.listTraits': segmentSchemaEntry('spaces.schema.listTraits'),
	'testing.echo': segmentSchemaEntry('testing.echo'),
	'tracking.alias': segmentSchemaEntry('tracking.alias'),
	'tracking.batch': segmentSchemaEntry('tracking.batch'),
	'tracking.group': segmentSchemaEntry('tracking.group'),
	'tracking.identify': segmentSchemaEntry('tracking.identify'),
	'tracking.page': segmentSchemaEntry('tracking.page'),
	'tracking.screen': segmentSchemaEntry('tracking.screen'),
	'tracking.track': segmentSchemaEntry('tracking.track'),
	'trackingPlans.addSource': segmentSchemaEntry('trackingPlans.addSource'),
	'trackingPlans.create': segmentSchemaEntry('trackingPlans.create'),
	'trackingPlans.delete': segmentSchemaEntry('trackingPlans.delete'),
	'trackingPlans.get': segmentSchemaEntry('trackingPlans.get'),
	'trackingPlans.list': segmentSchemaEntry('trackingPlans.list'),
	'trackingPlans.listRules': segmentSchemaEntry('trackingPlans.listRules'),
	'trackingPlans.listSources': segmentSchemaEntry('trackingPlans.listSources'),
	'trackingPlans.removeRules': segmentSchemaEntry('trackingPlans.removeRules'),
	'trackingPlans.removeSource': segmentSchemaEntry(
		'trackingPlans.removeSource',
	),
	'trackingPlans.replaceRules': segmentSchemaEntry(
		'trackingPlans.replaceRules',
	),
	'trackingPlans.update': segmentSchemaEntry('trackingPlans.update'),
	'trackingPlans.updateRules': segmentSchemaEntry('trackingPlans.updateRules'),
	'transformations.create': segmentSchemaEntry('transformations.create'),
	'transformations.delete': segmentSchemaEntry('transformations.delete'),
	'transformations.get': segmentSchemaEntry('transformations.get'),
	'transformations.list': segmentSchemaEntry('transformations.list'),
	'transformations.update': segmentSchemaEntry('transformations.update'),
	'usage.getDailyApiCalls': segmentSchemaEntry('usage.getDailyApiCalls'),
	'usage.getDailyApiCallsBySource': segmentSchemaEntry(
		'usage.getDailyApiCallsBySource',
	),
	'usage.getDailyMtu': segmentSchemaEntry('usage.getDailyMtu'),
	'usage.getDailyMtuBySource': segmentSchemaEntry('usage.getDailyMtuBySource'),
	'userGroups.addPermissions': segmentSchemaEntry('userGroups.addPermissions'),
	'userGroups.addUsers': segmentSchemaEntry('userGroups.addUsers'),
	'userGroups.create': segmentSchemaEntry('userGroups.create'),
	'userGroups.delete': segmentSchemaEntry('userGroups.delete'),
	'userGroups.get': segmentSchemaEntry('userGroups.get'),
	'userGroups.list': segmentSchemaEntry('userGroups.list'),
	'userGroups.listInvites': segmentSchemaEntry('userGroups.listInvites'),
	'userGroups.listUsers': segmentSchemaEntry('userGroups.listUsers'),
	'userGroups.removeUsers': segmentSchemaEntry('userGroups.removeUsers'),
	'userGroups.replacePermissions': segmentSchemaEntry(
		'userGroups.replacePermissions',
	),
	'userGroups.replaceUsers': segmentSchemaEntry('userGroups.replaceUsers'),
	'userGroups.update': segmentSchemaEntry('userGroups.update'),
	'users.addPermissions': segmentSchemaEntry('users.addPermissions'),
	'users.delete': segmentSchemaEntry('users.delete'),
	'users.get': segmentSchemaEntry('users.get'),
	'users.list': segmentSchemaEntry('users.list'),
	'users.listGroups': segmentSchemaEntry('users.listGroups'),
	'users.replacePermissions': segmentSchemaEntry('users.replacePermissions'),
	'warehouses.addSourceConnection': segmentSchemaEntry(
		'warehouses.addSourceConnection',
	),
	'warehouses.create': segmentSchemaEntry('warehouses.create'),
	'warehouses.delete': segmentSchemaEntry('warehouses.delete'),
	'warehouses.get': segmentSchemaEntry('warehouses.get'),
	'warehouses.getAdvancedSyncSchedule': segmentSchemaEntry(
		'warehouses.getAdvancedSyncSchedule',
	),
	'warehouses.getConnectionState': segmentSchemaEntry(
		'warehouses.getConnectionState',
	),
	'warehouses.list': segmentSchemaEntry('warehouses.list'),
	'warehouses.listConnectedSources': segmentSchemaEntry(
		'warehouses.listConnectedSources',
	),
	'warehouses.listSelectiveSyncs': segmentSchemaEntry(
		'warehouses.listSelectiveSyncs',
	),
	'warehouses.listSourceSyncs': segmentSchemaEntry(
		'warehouses.listSourceSyncs',
	),
	'warehouses.listSyncs': segmentSchemaEntry('warehouses.listSyncs'),
	'warehouses.removeSourceConnection': segmentSchemaEntry(
		'warehouses.removeSourceConnection',
	),
	'warehouses.replaceAdvancedSyncSchedule': segmentSchemaEntry(
		'warehouses.replaceAdvancedSyncSchedule',
	),
	'warehouses.update': segmentSchemaEntry('warehouses.update'),
	'warehouses.updateSelectiveSync': segmentSchemaEntry(
		'warehouses.updateSelectiveSync',
	),
	'warehouses.validate': segmentSchemaEntry('warehouses.validate'),
	'workspaces.get': segmentSchemaEntry('workspaces.get'),
} satisfies RequiredPluginEndpointSchemas<typeof segmentEndpointsNested>;

export const segmentEndpointMeta = {
	'activations.batchQuery': {
		riskLevel: 'read',
		description:
			"Batch Query Activations for Space. Lists Activations in bulk across many Audiences in one call. Intended for bulk reads, for example pulling activation metadata for hundreds of audiences on a schedule, so callers don't need one listActivationsFromAudience call per audience. Alpha in Segment's API: it may change.",
	},
	'activations.create': {
		riskLevel: 'destructive',
		description:
			"Add Activation to Audience. Defines how audience data is sent to a Destination. This step enables the data sync. You must establish a connection (Add Destination to Audience) for this audience before an Activation can be created. Alpha in Segment's API: it may change. Starts sending the audience to the destination once the activation is enabled.",
	},
	'activations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Activation from Audience. Deletes an Activation. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'activations.get': {
		riskLevel: 'read',
		description:
			"Get Activation from Audience. Gets a single Activation by id. Alpha in Segment's API: it may change.",
	},
	'activations.list': {
		riskLevel: 'read',
		description:
			"List Activations from Audience. Lists all Activations. Alpha in Segment's API: it may change.",
	},
	'activations.update': {
		riskLevel: 'destructive',
		description:
			"Update Activation for Audience. Updates an Activation. Alpha in Segment's API: it may change. With performResync true, Segment sends the whole audience to the destination again.",
	},
	'audiences.create': {
		riskLevel: 'write',
		description:
			'Create Audience. Creates Audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.createPreview': {
		riskLevel: 'read',
		description:
			'Create Audience Preview. Previews Audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. This endpoint also has a rate limit of 700 requests per month per spaceId, which is lower than the default due to access pattern restrictions. Segment limits previews per minute and per month, and each attempt counts: the plugin sends it once and does not retry a 429 or a 5xx.',
	},
	'audiences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Audience from Space. Deletes an Audience by id and spaceId. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Cannot be undone.',
	},
	'audiences.destinations.add': {
		riskLevel: 'write',
		description:
			"Add Destination to Audience. Establishes a connection between an audience and a Destination. To start syncing data, you must create an Activation for the connection created here. Note that the Destination must be added to Engage through the Engage Settings page within the App before creating the connection through the API. Alpha in Segment's API: it may change.",
	},
	'audiences.destinations.list': {
		riskLevel: 'read',
		description:
			"List Destinations from Audience. Lists all Destinations from an Audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Alpha in Segment's API: it may change.",
	},
	'audiences.destinations.listSupported': {
		riskLevel: 'read',
		description:
			"List Supported Destinations from Audience. Lists the Destinations that have been reviewed and validated for activation with this audience type. Use this endpoint to discover the available action ids and the Destination fields that can be mapped before creating an Activation. Alpha in Segment's API: it may change.",
	},
	'audiences.destinations.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Destination from Audience. Removes a Destination from an Audience. If there are activations associated with the Destination, the request will return a 409 Conflict error. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'audiences.destinations.update': {
		riskLevel: 'write',
		description:
			"Update Destination for Audience. Updates a Destination for an Audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Alpha in Segment's API: it may change.",
	},
	'audiences.get': {
		riskLevel: 'read',
		description:
			'Get Audience. Returns the Audience by id and spaceId. Supports including audience schedules using ?include=schedules. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.getPreview': {
		riskLevel: 'read',
		description:
			'Get Audience Preview. Reads the results of an audience preview. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.list': {
		riskLevel: 'read',
		description:
			'List Audiences. Returns Audiences by spaceId. Supports including audience schedules using ?include=schedules. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.listConsumers': {
		riskLevel: 'read',
		description:
			'List Audience Consumers from Space And Audience. Returns the list of consumers for the given audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.run': {
		riskLevel: 'destructive',
		description:
			'Force Execute Audience Run. The ability to force execute a run for an Audience is limited to Linked Audiences (audienceType = LINKED). In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Recomputes the audience now and sends changes to its connected destinations.',
	},
	'audiences.schedules.create': {
		riskLevel: 'write',
		description:
			'Add Audience Schedule to Audience. The ability to configure the run schedule for an Audience is limited to Linked Audiences (audienceType = LINKED). Note that if a Linked Audience remains disabled for 90 days Segment will delete the associated schedule and a new schedule will need to be created.',
	},
	'audiences.schedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Audience Schedule from Audience. Deletes an audience schedule for a Linked Audience (audienceType = LINKED). In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Cannot be undone.',
	},
	'audiences.schedules.get': {
		riskLevel: 'read',
		description:
			'Get Audience Schedule from Space And Audience. Returns the schedule for the given audience and scheduleId. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.schedules.list': {
		riskLevel: 'read',
		description:
			'List Audience Schedules from Space And Audience. Returns the list of schedules for the given audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.schedules.update': {
		riskLevel: 'write',
		description:
			'Update Audience Schedule for Audience. Updates an audience schedule for a Linked Audience (audienceType = LINKED). In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled.',
	},
	'audiences.update': {
		riskLevel: 'write',
		description:
			'Update Audience for Space. Updates the Audience. In order to successfully call this endpoint, the specified Workspace needs to have the Audience feature enabled. Note that when an Audience is updated, the Audience will be locked from future edits until the changes have been incorporated.',
	},
	'auditTrail.list': {
		riskLevel: 'read',
		description: 'List Audit Events. Returns a list of Audit Trail events.',
	},
	'catalog.getDestination': {
		riskLevel: 'read',
		description:
			'Get Destination Metadata. Returns a Destination catalog item by its id.',
	},
	'catalog.getSource': {
		riskLevel: 'read',
		description:
			'Get Source Metadata. Returns a Source catalog item by its id.',
	},
	'catalog.getWarehouse': {
		riskLevel: 'read',
		description:
			'Get Warehouse Metadata. Returns a Warehouse catalog item by its id.',
	},
	'catalog.listDestinations': {
		riskLevel: 'read',
		description:
			'Get Destinations Catalog. Returns a list of all available Destinations in the Segment catalog.',
	},
	'catalog.listSources': {
		riskLevel: 'read',
		description:
			'Get Sources Catalog. Returns a list of all available Sources in the Segment catalog.',
	},
	'catalog.listWarehouses': {
		riskLevel: 'read',
		description:
			'Get Warehouses Catalog. Returns a list of all available Warehouses in the Segment catalog.',
	},
	'computedTraits.create': {
		riskLevel: 'write',
		description:
			"Create Computed Trait. Creates a Computed Trait. In order to successfully call this endpoint, the specified Workspace needs to have the Computed Trait feature enabled. Note: The definition for a Computed Trait created using the API is not editable through the Segment App. Alpha in Segment's API: it may change.",
	},
	'computedTraits.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Computed Trait from Space. Deletes a Computed Trait by id and spaceId. In order to successfully call this endpoint, the specified Workspace needs to have the Computed Trait feature enabled. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'computedTraits.get': {
		riskLevel: 'read',
		description:
			"Get Computed Trait. Returns the Computed Trait by id and spaceId. In order to successfully call this endpoint, the specified Workspace needs to have the Computed Trait feature enabled. Alpha in Segment's API: it may change.",
	},
	'computedTraits.list': {
		riskLevel: 'read',
		description:
			"List Computed Traits. Returns Computed Traits by spaceId. In order to successfully call this endpoint, the specified Workspace needs to have the Computed Trait feature enabled. Alpha in Segment's API: it may change.",
	},
	'computedTraits.update': {
		riskLevel: 'write',
		description:
			"Update Computed Trait for Space. Updates the Computed Trait. In order to successfully call this endpoint, the specified Workspace needs to have the Computed Trait feature enabled. Note that when a Computed Trait is updated, the Computed Trait will be locked from future edits until the changes have been incorporated. Alpha in Segment's API: it may change.",
	},
	'credentials.create': {
		riskLevel: 'write',
		description:
			'Create Credential. Creates a new Credential. This endpoint requires the user to have at least the following permission(s):. * Workspace Owner. * Warehouse Admin. * Source Admin. * Entities Admin. * Unify and Engage Admin.',
	},
	'credentials.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Credential. Deletes an existing Credential. Fails with a 409 Conflict if the Credential is still in use by a Warehouse or Source (including a disabled one). Cannot be undone.',
	},
	'credentials.get': {
		riskLevel: 'read',
		description:
			'Get Credential. Returns a Credential by its id. This endpoint requires the user to have at least the following permission(s):. * Workspace Owner. * Warehouse Admin. * Source Admin. * Entities Admin. * Unify and Engage Admin.',
	},
	'credentials.list': {
		riskLevel: 'read',
		description:
			'List Credentials. Returns a list of Credentials. This endpoint requires the user to have at least the following permission(s):. * Workspace Owner. * Warehouse Admin. * Source Admin. * Entities Admin. * Unify and Engage Admin.',
	},
	'credentials.listConsumers': {
		riskLevel: 'read',
		description:
			'List Credential Consumers. Returns the Warehouses and Sources that use a Credential. This endpoint requires the user to have at least the following permission(s):. * Workspace Owner. * Warehouse Admin. * Source Admin. * Entities Admin. * Unify and Engage Admin.',
	},
	'credentials.update': {
		riskLevel: 'write',
		description:
			'Update Credential. Updates an existing Credential. All Warehouses using this Credential are affected immediately. This endpoint requires the user to have at least the following permission(s):. * Workspace Owner.',
	},
	'customerInsights.createDownload': {
		riskLevel: 'write',
		description:
			"Create Download. Create Customer Insights Presigned URLs. Alpha in Segment's API: it may change.",
	},
	'dbt.triggerModelSync': {
		riskLevel: 'destructive',
		description:
			"Create Dbt Model Sync Trigger. Creates a trigger for a new dbt model sync for a Source. Beta in Segment's API. Starts the dbt model sync now.",
	},
	'deliveryOverview.getFailedDelivery': {
		riskLevel: 'read',
		description:
			"Get Egress Failed Metrics from Delivery Overview. Get events that failed to be delivered to Destination. Beta in Segment's API.",
	},
	'deliveryOverview.getFailedOnIngest': {
		riskLevel: 'read',
		description:
			"Get Ingress Failed Metrics from Delivery Overview. Get events that failed on ingest. Beta in Segment's API.",
	},
	'deliveryOverview.getFilteredAtDestination': {
		riskLevel: 'read',
		description:
			"Get Filtered At Destination Metrics from Delivery Overview. Get events that were filtered at Destination. Beta in Segment's API.",
	},
	'deliveryOverview.getFilteredAtSource': {
		riskLevel: 'read',
		description:
			"Get Filtered At Source Metrics from Delivery Overview. Get events that were filtered at Source. Beta in Segment's API.",
	},
	'deliveryOverview.getSuccessfulDelivery': {
		riskLevel: 'read',
		description:
			"Get Egress Success Metrics from Delivery Overview. Get events successfully delivered to Destination. Beta in Segment's API.",
	},
	'deliveryOverview.getSuccessfullyReceived': {
		riskLevel: 'read',
		description:
			"Get Ingress Success Metrics from Delivery Overview. Get events that were successfully received by Segment. Beta in Segment's API.",
	},
	'destinations.create': {
		riskLevel: 'write',
		description: 'Create Destination. Creates a new Destination.',
	},
	'destinations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Destination. Deletes an existing Destination. Config API omitted fields:. - catalogId. Cannot be undone.',
	},
	'destinations.filters.create': {
		riskLevel: 'write',
		description:
			'Create Filter for Destination. Creates a filter in a Destination.',
	},
	'destinations.filters.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Filter from Destination. Deletes a Destination filter. Cannot be undone.',
	},
	'destinations.filters.get': {
		riskLevel: 'read',
		description: 'Get Filter in Destination. Gets a Destination filter by id.',
	},
	'destinations.filters.list': {
		riskLevel: 'read',
		description:
			'List Filters from Destination. Lists filters for a Destination.',
	},
	'destinations.filters.preview': {
		riskLevel: 'read',
		description:
			'Preview Destination Filter. Simulates the application of a Destination filter to a provided JSON payload.',
	},
	'destinations.filters.update': {
		riskLevel: 'write',
		description:
			'Update Filter for Destination. Updates a filter in a Destination. When called, this endpoint may generate one or more of the following audit trail events:* Destination Filter Enabled. * Destination Filter Disabled.',
	},
	'destinations.get': {
		riskLevel: 'read',
		description:
			'Get Destination. Returns a Destination by its id. Config API omitted fields:. - catalogId.',
	},
	'destinations.getDeliveryMetrics': {
		riskLevel: 'read',
		description:
			"List Delivery Metrics Summary from Destination. Get an event delivery metrics summary from a Destination. Based on the granularity chosen, there are restrictions on the time range you can query:. Minute:. - Max time range: 4 hours. - Oldest possible start time: 48 hours in the past. Hour:. - Max Time range: 7 days. Beta in Segment's API.",
	},
	'destinations.list': {
		riskLevel: 'read',
		description: 'List Destinations. Returns a list of Destinations.',
	},
	'destinations.subscriptions.create': {
		riskLevel: 'write',
		description:
			"Create Destination Subscription. Creates a new Destination subscription. In order to successfully call this endpoint, the specified Workspace needs to have the Destination Subscriptions feature enabled. Alpha in Segment's API: it may change.",
	},
	'destinations.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Subscription from Destination. Deletes an existing Destination subscription. In order to successfully call this endpoint, the specified Workspace needs to have the Destination Subscriptions feature enabled. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'destinations.subscriptions.get': {
		riskLevel: 'read',
		description:
			"Get Subscription from Destination. Gets a Destination subscription by id. In order to successfully call this endpoint, the specified Workspace needs to have the Destination Subscriptions feature enabled. Alpha in Segment's API: it may change.",
	},
	'destinations.subscriptions.list': {
		riskLevel: 'read',
		description:
			"List Subscriptions from Destination. Lists subscriptions for a Destination. In order to successfully call this endpoint, the specified Workspace needs to have the Destination Subscriptions feature enabled. Alpha in Segment's API: it may change.",
	},
	'destinations.subscriptions.update': {
		riskLevel: 'write',
		description:
			"Update Subscription for Destination. Updates an existing Destination subscription. In order to successfully call this endpoint, the specified Workspace needs to have the Destination Subscriptions feature enabled. Alpha in Segment's API: it may change.",
	},
	'destinations.update': {
		riskLevel: 'write',
		description:
			"Update Destination. Updates an existing Destination. Note: if you attempt to update read-only settings for your destination you'll encounter the following behavior:. * If only read-only properties are being updated, the endpoint will return an HTTP 400 error.",
	},
	'events.getVolume': {
		riskLevel: 'read',
		description:
			'Get Events Volume from Workspace. Enumerates the Workspace event volumes over time in minute increments.',
	},
	'filters.create': {
		riskLevel: 'write',
		description:
			"Create Filter for Space. Creates a filter for a space. A space filter applies to events coming from all Sources connected to a space. In order to successfully call this endpoint, the specified Workspace needs to have the Space Filters feature enabled. Beta in Segment's API.",
	},
	'filters.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete Filter By Id. Deletes a filter by id. In order to successfully call this endpoint, the specified Workspace needs to have the Space Filters feature enabled. Beta in Segment's API. Cannot be undone.",
	},
	'filters.get': {
		riskLevel: 'read',
		description:
			"Get Filter By Id. Gets a filter by id. In order to successfully call this endpoint, the specified Workspace needs to have the Space Filters feature enabled. Beta in Segment's API.",
	},
	'filters.list': {
		riskLevel: 'read',
		description:
			"List Filters for Space. Lists filters for a space. In order to successfully call this endpoint, the specified Workspace needs to have the Space Filters feature enabled. Beta in Segment's API.",
	},
	'filters.update': {
		riskLevel: 'write',
		description:
			"Update Filter By Id. Updates a filter by id and replaces the existing filter. In order to successfully call this endpoint, the specified Workspace needs to have the Space Filters feature enabled. Beta in Segment's API.",
	},
	'functions.create': {
		riskLevel: 'write',
		description:
			'Create Function. Creates a Function. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled.',
	},
	'functions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Function. Deletes a Function. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Cannot be undone.',
	},
	'functions.deploy': {
		riskLevel: 'destructive',
		description:
			'Create Function Deployment. Deploys a Function. Only applicable to Source Function instances. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Deploys the function code: it starts running on live events.',
	},
	'functions.get': {
		riskLevel: 'read',
		description:
			'Get Function. Gets a Function. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled.',
	},
	'functions.getVersion': {
		riskLevel: 'read',
		description:
			"Get Function Version. Gets a Function version. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.insertInstances.create': {
		riskLevel: 'write',
		description:
			"Create Insert Function Instance. Creates an insert Function instance connected to the given Destination. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.insertInstances.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete Insert Function Instance. Deletes an insert Function instance. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'functions.insertInstances.get': {
		riskLevel: 'read',
		description:
			"Get Insert Function Instance. Gets an insert Function instance. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.insertInstances.list': {
		riskLevel: 'read',
		description:
			"List Insert Function Instances. Lists all insert Function instances connected to the given insert Function. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.insertInstances.update': {
		riskLevel: 'write',
		description:
			"Update Insert Function Instance. Updates an insert Function instance connected to the given Destination. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.list': {
		riskLevel: 'read',
		description:
			'List Functions. Lists all Functions in a Workspace. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled.',
	},
	'functions.listVersions': {
		riskLevel: 'read',
		description:
			"List Function Versions. Lists versions for a Function in a Workspace. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.restoreVersion': {
		riskLevel: 'destructive',
		description:
			"Restore Function Version. Restore an old Function version as the latest version. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Alpha in Segment's API: it may change.",
	},
	'functions.update': {
		riskLevel: 'write',
		description:
			'Update Function. Updates a Function. In order to successfully call this endpoint, the specified Workspace needs to have the Functions feature enabled. Config API omitted fields:. - updateMask.',
	},
	'invites.create': {
		riskLevel: 'destructive',
		description:
			'Create Invites. Invites a list of users to join a Workspace. When called, this endpoint may generate one or more of the following audit trail events:* Non-Segment User Invited to Workspace. * Policy Created. * New Segment User Invited to Workspace. Config API omitted fields:. - parent. Sends an invitation email to each address.',
	},
	'invites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Invites. Removes a list of invitations to join a Workspace. When called, this endpoint may generate one or more of the following audit trail events:* Invite Deleted. * Group Memberships Deleted. Cannot be undone.',
	},
	'invites.list': {
		riskLevel: 'read',
		description:
			'List Invites. Returns a list of invitations to join a Workspace. Config API omitted fields:. - parent.',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create Label. Creates a new label. (POST /labels)',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Label. Deletes a label. Cannot be undone.',
	},
	'labels.list': {
		riskLevel: 'read',
		description: 'List Labels. Returns a list of all available labels.',
	},
	'livePlugins.create': {
		riskLevel: 'destructive',
		description:
			"Create Live Plugin. Creates or updates a Live Plugin for your Source with given code. In order to successfully call this endpoint, the specified Workspace needs to have the Live Plugins feature enabled. Alpha in Segment's API: it may change.",
	},
	'livePlugins.deleteCode': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete Live Plugin Code. Delete the Live Plugin code for a Source. This will not disable Live Plugins for the Source, but will remove any existing code. In order to successfully call this endpoint, the specified Workspace needs to have the Live Plugins feature enabled. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'livePlugins.getLatest': {
		riskLevel: 'read',
		description:
			"Get Latest from Live Plugins. Get the latest Live Plugins for your Source. In order to successfully call this endpoint, the specified Workspace needs to have the Live Plugins feature enabled. Alpha in Segment's API: it may change.",
	},
	'profilesSync.create': {
		riskLevel: 'write',
		description:
			"Create Profiles Warehouse. Creates a new Profiles Warehouse. WARN : Please be careful to not use this API to link multiple Warehouses to a single Space. This is not officially supported. Although the Warehouse will be linked, it won't show up on the UI and can lead to various other unforeseen issues. Alpha in Segment's API: it may change.",
	},
	'profilesSync.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Profiles Warehouse from Space. Deletes an existing Profiles Warehouse. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'profilesSync.list': {
		riskLevel: 'read',
		description:
			"List Profiles Warehouse in Space. Lists all Profile Warehouses for a given space id. Alpha in Segment's API: it may change.",
	},
	'profilesSync.listSelectiveSyncs': {
		riskLevel: 'read',
		description:
			"List Selective Syncs from Warehouse And Space. Returns the schema for a Space Warehouse connection, including Collections and Properties. Alpha in Segment's API: it may change.",
	},
	'profilesSync.update': {
		riskLevel: 'write',
		description:
			"Update Profiles Warehouse for Space Warehouse. Updates an existing Profiles Warehouse. Alpha in Segment's API: it may change.",
	},
	'profilesSync.updateSelectiveSync': {
		riskLevel: 'write',
		description:
			"Update Selective Sync for Warehouse And Space. Updates the schema for a Space Warehouse connection, including Collections and Properties. Alpha in Segment's API: it may change.",
	},
	'regulations.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create Workspace Regulation. Creates a Workspace-scoped regulation. Config API omitted fields:. - attributes,. - userAgent. Rate limit headers will be updated to reflect regulation-specific limits (tracked separately for Segment-only vs Segment & Destination regulation types):. Starts a deletion or suppression run over the subject ids. It cannot be cancelled and deleted data cannot be recovered; poll regulations.get until overallStatus is FINISHED, PARTIAL_SUCCESS or FAILED.',
	},
	'regulations.createForCloudSource': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create Cloud Source Regulation. Creates a Source-scoped regulation. Please Note: Suppression rules at the Workspace level take precedence over those at the Source level. Starts a deletion run on a cloud-mode source. It cannot be cancelled and deleted data cannot be recovered.',
	},
	'regulations.createForSource': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create Source Regulation. Creates a Source-scoped regulation. Please Note: Suppression rules at the Workspace level take precedence over those at the Source level. Starts a deletion or suppression run limited to one source. It cannot be cancelled and deleted data cannot be recovered.',
	},
	'regulations.get': {
		riskLevel: 'read',
		description:
			'Get Regulation. Gets a regulation from the Workspace. Config API omitted fields:. - parent.',
	},
	'regulations.list': {
		riskLevel: 'read',
		description:
			'List Workspace Regulations. Lists all Workspace-scoped regulations. Please note: List Workspace regulations only returns deletion requests from the past 90 days. Deletion requests older than 90 days are not retained and will result in 404 resource not found.',
	},
	'regulations.listForSource': {
		riskLevel: 'read',
		description:
			'List Regulations from Source. Lists all Source-scoped regulations. Please note: List regulations for Source only returns deletion requests from the past 90 days. Deletion requests older than 90 days are not retained and will result in 404 resource not found.',
	},
	'regulations.listSuppressions': {
		riskLevel: 'read',
		description:
			'List Suppressions. Lists all suppressions in a given Workspace.',
	},
	'reverseEtl.models.create': {
		riskLevel: 'write',
		description:
			"Create Reverse Etl Model. Creates a new Reverse ETL Model. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.models.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete Reverse Etl Model. Deletes an existing Model. Alpha in Segment's API: it may change. Cannot be undone.",
	},
	'reverseEtl.models.get': {
		riskLevel: 'read',
		description:
			"Get Reverse Etl Model. Returns a Reverse ETL Model by its id. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.models.list': {
		riskLevel: 'read',
		description:
			"List Reverse Etl Models. Returns a list of Reverse ETL Models. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.models.update': {
		riskLevel: 'write',
		description:
			"Update Reverse Etl Model. Updates an existing Reverse ETL Model. When called, this endpoint may generate one or more of the following audit trail events:* Model Settings Saved. * Model State Change Toggled. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.syncs.cancel': {
		riskLevel: 'destructive',
		description:
			"Cancel Reverse ETL Sync for Model. Cancels a sync for a Reverse ETL Connection. It might take a few seconds to completely cancel the sync. Will return an error if the sync is already completed or cancelled. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.syncs.create': {
		riskLevel: 'destructive',
		description:
			"Create Reverse ETL Manual Sync. Triggers a manual sync for a Reverse ETL Connection. In the request body, the subscription id is the id that follows after /mappings/ portion in the URL of the sync. Alpha in Segment's API: it may change. Starts a sync now: rows go out to the connected destination.",
	},
	'reverseEtl.syncs.get': {
		riskLevel: 'read',
		description:
			"Get Reverse ETL Sync Status. Get the sync status for a Reverse ETL sync. The sync status includes all detailed information about the sync - sync status, duration, details about the extract and load phase if applicable, etc. Alpha in Segment's API: it may change.",
	},
	'reverseEtl.syncs.list': {
		riskLevel: 'read',
		description:
			"List Reverse ETL Sync Statuses from Model And Subscription Id. Get the sync statuses for a Reverse ETL mapping subscription. The sync status includes all detailed information about the sync - sync status, duration, details about the extract and load phase if applicable, etc. Alpha in Segment's API: it may change.",
	},
	'roles.list': {
		riskLevel: 'read',
		description:
			'List Roles. Returns a list of Roles available to apply to permissions for users and/or groups.',
	},
	'sources.addLabels': {
		riskLevel: 'write',
		description: 'Add Labels to Source. Adds an existing label to a Source.',
	},
	'sources.create': {
		riskLevel: 'write',
		description: 'Create Source. Creates a new Source. (POST /sources)',
	},
	'sources.createWriteKey': {
		riskLevel: 'destructive',
		description:
			"Create Write Key for Source. Creates a new Write Key for the Source. Alpha in Segment's API: it may change. Mints a new write key for the source: a credential, treat it as a secret.",
	},
	'sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Source. Deletes an existing Source. Cannot be undone.',
	},
	'sources.get': {
		riskLevel: 'read',
		description:
			'Get Source. Returns a Source by its id. The source carries its writeKeys: treat them as secrets.',
	},
	'sources.getSchemaSettings': {
		riskLevel: 'read',
		description:
			'List Schema Settings in Source. Retrieves the schema configuration settings for a Source. If Protocols is not enabled for the Source, the configurations specific to Protocols will have default values.',
	},
	'sources.list': {
		riskLevel: 'read',
		description:
			'List Sources. Returns a list of Sources. Each source carries its writeKeys: treat them as secrets.',
	},
	'sources.listConnectedDestinations': {
		riskLevel: 'read',
		description:
			'List Connected Destinations from Source. Returns a list of Destinations connected to a Source.',
	},
	'sources.listConnectedWarehouses': {
		riskLevel: 'read',
		description:
			'List Connected Warehouses from Source. Returns a list of Warehouses connected to a Source.',
	},
	'sources.removeWriteKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove Write Key from Source. Removes a Write Key from a Source. Alpha in Segment's API: it may change. Every sender still using this write key stops being accepted. Cannot be undone.",
	},
	'sources.replaceLabels': {
		riskLevel: 'write',
		description: 'Replace Labels in Source. Replaces all labels in a Source.',
	},
	'sources.update': {
		riskLevel: 'write',
		description:
			'Update Source. Updates an existing Source. When called, this endpoint may generate one or more of the following audit trail events:* Source Modified. * Source Enabled. * Source Settings Modified. * Source Disabled. Config API omitted fields:. - updateMask.',
	},
	'sources.updateSchemaSettings': {
		riskLevel: 'write',
		description:
			'Update Schema Settings in Source. Updates the schema configuration for a Source. If Protocols is not enabled for the Source, any updates to Protocols-specific configurations will not be applied. Config API omitted fields:. - updateMask.',
	},
	'spaces.get': {
		riskLevel: 'read',
		description:
			"Get Space. Returns the Space by id. In order to successfully call this endpoint, the specified Workspace needs to have the Spaces feature enabled. Alpha in Segment's API: it may change.",
	},
	'spaces.list': {
		riskLevel: 'read',
		description:
			"List Spaces. List Spaces. In order to successfully call this endpoint, the specified Workspace needs to have the Spaces feature enabled. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEntityPaths': {
		riskLevel: 'read',
		description:
			"List Entity Paths. Returns a list of Entity Paths for a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEntityProperties': {
		riskLevel: 'read',
		description:
			"List Properties from Entity. Returns a list of Properties for an Entity in a Space. Forward-only pagination : this endpoint does not support backward traversal. The pagination.previous field is always absent; use pagination.next to advance through pages. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEntityPropertySampleValues': {
		riskLevel: 'read',
		description:
			"List Sample Values from Entity Property. Returns sample values for an Entity Property in a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEventProperties': {
		riskLevel: 'read',
		description:
			"List Properties from Event. Returns a list of Properties for an Event in a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEventPropertySampleValues': {
		riskLevel: 'read',
		description:
			"List Sample Values from Event Property. Returns sample values for an Event Property in a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listEvents': {
		riskLevel: 'read',
		description:
			"List Events. Returns a list of Events for a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listTraitSampleValues': {
		riskLevel: 'read',
		description:
			"List Sample Values from Trait. Returns sample values for a Trait in a Space. Alpha in Segment's API: it may change.",
	},
	'spaces.schema.listTraits': {
		riskLevel: 'read',
		description:
			"List Traits. Returns a list of Traits for a Space. Forward-only pagination : this endpoint does not support backward traversal. The pagination.previous field is always absent; use pagination.next to advance through pages. Alpha in Segment's API: it may change.",
	},
	'testing.echo': {
		riskLevel: 'read',
		description: 'Echo. Public Echo endpoint. (GET /echo)',
	},
	'tracking.alias': {
		riskLevel: 'write',
		description:
			'Merge two user identities. Merges two identities of one user (a previous anonymous or old id and the new userId) in destinations that need it, such as Mixpanel. Most destinations merge on identify and do not need alias. Tracking API: sent with the source write key.',
	},
	'tracking.batch': {
		riskLevel: 'write',
		description:
			'Send a batch of calls. Sends up to 2,500 calls and 500 KB of identify, track, page, screen, group and alias calls in one request (each message at most 32 KB). Use it to import historical data or to save requests. Tracking API: sent with the source write key.',
	},
	'tracking.group': {
		riskLevel: 'write',
		description:
			'Associate a user with a group. Ties a user to a group (a company, account or team) and records traits about the group. Tracking API: sent with the source write key.',
	},
	'tracking.identify': {
		riskLevel: 'write',
		description:
			'Identify a user. Ties a user to their actions and records traits about them (email, name, plan). Traits stay on the user profile in destinations that keep one. Tracking API: sent with the source write key to api.segment.io (events.eu1.segmentapis.com in the EU). Segment answers 200 for every call it can parse; check the source debugger for what arrived.',
	},
	'tracking.page': {
		riskLevel: 'write',
		description:
			'Record a page view. Records that a user viewed a page of a website. Tracking API: sent with the source write key.',
	},
	'tracking.screen': {
		riskLevel: 'write',
		description:
			'Record a screen view. Records that a user viewed a screen of a mobile app. Tracking API: sent with the source write key.',
	},
	'tracking.track': {
		riskLevel: 'write',
		description:
			'Track an event. Records an action the user performed, with properties describing it ("Order Completed" with revenue). Tracking API: sent with the source write key. Events go on to every destination connected to the source.',
	},
	'trackingPlans.addSource': {
		riskLevel: 'write',
		description:
			'Add Source to Tracking Plan. Connects a Source to a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.create': {
		riskLevel: 'write',
		description:
			'Create Tracking Plan. Creates a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Tracking Plan. Deletes a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. Cannot be undone.',
	},
	'trackingPlans.get': {
		riskLevel: 'read',
		description:
			'Get Tracking Plan. Returns a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.list': {
		riskLevel: 'read',
		description:
			'List Tracking Plans. Returns a list of Tracking Plans. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.listRules': {
		riskLevel: 'read',
		description:
			'List Rules from Tracking Plan. Lists Tracking Plan rules. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.listSources': {
		riskLevel: 'read',
		description:
			'List Sources from Tracking Plan. Lists Sources connected to a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. This endpoint requires the user to have at least the following permission(s):. * Source Read-only. * Tracking Plan Read-only.',
	},
	'trackingPlans.removeRules': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Rules from Tracking Plan. Deletes Tracking Plan rules. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. Cannot be undone.',
	},
	'trackingPlans.removeSource': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Source from Tracking Plan. Disconnects a Source from a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. Cannot be undone.',
	},
	'trackingPlans.replaceRules': {
		riskLevel: 'destructive',
		description:
			'Replace Rules in Tracking Plan. Replaces Tracking Plan rules. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'trackingPlans.update': {
		riskLevel: 'write',
		description:
			'Update Tracking Plan. Updates a Tracking Plan. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. Config API omitted fields:. - updateMask.',
	},
	'trackingPlans.updateRules': {
		riskLevel: 'write',
		description:
			'Update Rules in Tracking Plan. Updates Tracking Plan rules. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'transformations.create': {
		riskLevel: 'write',
		description:
			'Create Transformation. Creates a new Transformation. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'transformations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Transformation. Deletes a Transformation. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled. Cannot be undone.',
	},
	'transformations.get': {
		riskLevel: 'read',
		description:
			'Get Transformation. Gets a Transformation. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'transformations.list': {
		riskLevel: 'read',
		description:
			'List Transformations. Lists all Transformations in the Workspace. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'transformations.update': {
		riskLevel: 'write',
		description:
			'Update Transformation. Updates an existing Transformation. In order to successfully call this endpoint, the specified Workspace needs to have the Protocols feature enabled.',
	},
	'usage.getDailyApiCalls': {
		riskLevel: 'read',
		description:
			'Get Daily Workspace API Calls Usage. Provides daily cumulative API call counts for a usage period.',
	},
	'usage.getDailyApiCallsBySource': {
		riskLevel: 'read',
		description:
			'Get Daily Per Source API Calls Usage. Provides daily cumulative per-source API call counts for a usage period.',
	},
	'usage.getDailyMtu': {
		riskLevel: 'read',
		description:
			'Get Daily Workspace MTU Usage. Provides daily cumulative MTU counts for a usage period.',
	},
	'usage.getDailyMtuBySource': {
		riskLevel: 'read',
		description:
			'Get Daily Per Source MTU Usage. Provides daily cumulative per-source MTU counts for a usage period.',
	},
	'userGroups.addPermissions': {
		riskLevel: 'write',
		description:
			'Add Permissions to User Group. Adds a list of access permissions to a user group. When called, this endpoint may generate one or more of the following audit trail events:* Policy Created. * User Group Policy Updated.',
	},
	'userGroups.addUsers': {
		riskLevel: 'write',
		description:
			'Add Users to User Group. Adds a list of users or invites to a user group. When called, this endpoint may generate one or more of the following audit trail events:* Subjects Added to Group. * User Added To User Group.',
	},
	'userGroups.create': {
		riskLevel: 'write',
		description:
			'Create User Group. Creates a user group. When called, this endpoint may generate one or more of the following audit trail events:* User Group Created. * Policy Created.',
	},
	'userGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete User Group. Removes a user group from a Workspace. Cannot be undone.',
	},
	'userGroups.get': {
		riskLevel: 'read',
		description:
			'Get User Group. Returns a user group. (GET /groups/{userGroupId})',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description: 'List User Groups. Returns all user groups.',
	},
	'userGroups.listInvites': {
		riskLevel: 'read',
		description:
			'List Invites from User Group. Returns the emails of invitees to a user group.',
	},
	'userGroups.listUsers': {
		riskLevel: 'read',
		description:
			'List Users from User Group. Returns users belonging to a user group.',
	},
	'userGroups.removeUsers': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Users from User Group. Removes one or multiple users or invites from a user group by email. When called, this endpoint may generate one or more of the following audit trail events:* Group Memberships Deleted. * User Removed From User Group. Cannot be undone.',
	},
	'userGroups.replacePermissions': {
		riskLevel: 'destructive',
		description:
			'Replace Permissions for User Group. Updates the list of access permissions for a user group.',
	},
	'userGroups.replaceUsers': {
		riskLevel: 'destructive',
		description:
			'Replace Users in User Group. Replaces the members of a user group by email. When called, this endpoint may generate one or more of the following audit trail events:* Subjects Added to Group. * User Added To User Group. * Group Memberships Deleted.',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description: 'Update User Group. Updates a user group for a Workspace.',
	},
	'users.addPermissions': {
		riskLevel: 'write',
		description:
			'Add Permissions to User. Adds a list of access permissions to a user. When called, this endpoint may generate one or more of the following audit trail events:* Policy Created. * User Policy Updated.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Users. Removes one or multiple users. Removes the users from the workspace. Cannot be undone.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get User. Returns a user given their id.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List Users. Returns a list of users with access to the Workspace.',
	},
	'users.listGroups': {
		riskLevel: 'read',
		description:
			'List User Groups from User. Returns all groups a user belongs to.',
	},
	'users.replacePermissions': {
		riskLevel: 'destructive',
		description:
			'Replace Permissions for User. Updates the list of access permissions for a user.',
	},
	'warehouses.addSourceConnection': {
		riskLevel: 'write',
		description:
			'Add Connection from Source to Warehouse. Connects a Source to a Warehouse.',
	},
	'warehouses.create': {
		riskLevel: 'write',
		description: 'Create Warehouse. Creates a new Warehouse.',
	},
	'warehouses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Warehouse. Deletes an existing Warehouse. Cannot be undone.',
	},
	'warehouses.get': {
		riskLevel: 'read',
		description: 'Get Warehouse. Returns a Warehouse by its id.',
	},
	'warehouses.getAdvancedSyncSchedule': {
		riskLevel: 'read',
		description:
			'Get Advanced Sync Schedule from Warehouse. Returns the advanced sync schedule for a Warehouse.',
	},
	'warehouses.getConnectionState': {
		riskLevel: 'read',
		description:
			'Get Connection State from Warehouse. Verifies the state of Warehouse connection settings.',
	},
	'warehouses.list': {
		riskLevel: 'read',
		description: 'List Warehouses. Returns a list of Warehouses.',
	},
	'warehouses.listConnectedSources': {
		riskLevel: 'read',
		description:
			'List Connected Sources from Warehouse. Returns the list of Sources that are connected to a Warehouse.',
	},
	'warehouses.listSelectiveSyncs': {
		riskLevel: 'read',
		description:
			'List Selective Syncs from Warehouse And Source. Returns the schema for a Warehouse, including Sources, Collections, and Properties.',
	},
	'warehouses.listSourceSyncs': {
		riskLevel: 'read',
		description:
			'List Syncs from Warehouse And Source. Returns the overview of syncs for a Source connected to a Warehouse.',
	},
	'warehouses.listSyncs': {
		riskLevel: 'read',
		description:
			'List Syncs from Warehouse. Returns the overview of syncs for every Source connected to a Warehouse.',
	},
	'warehouses.removeSourceConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Source Connection from Warehouse. Disconnects a Source from a Warehouse. Cannot be undone.',
	},
	'warehouses.replaceAdvancedSyncSchedule': {
		riskLevel: 'write',
		description:
			'Replace Advanced Sync Schedule for Warehouse. Updates the advanced sync schedule for a Warehouse, replacing the sync schedule with a new schedule.',
	},
	'warehouses.update': {
		riskLevel: 'write',
		description:
			'Update Warehouse. Updates an existing Warehouse. When called, this endpoint may generate one or more of the following audit trail events:* Storage Destination Modified. * Storage Destination Enabled.',
	},
	'warehouses.updateSelectiveSync': {
		riskLevel: 'write',
		description:
			'Update Selective Sync for Warehouse. Configures the schema for a Warehouse, including Sources, Collections, and Properties.',
	},
	'warehouses.validate': {
		riskLevel: 'read',
		description:
			'Create Validation in Warehouse. Validates input settings against a Warehouse.',
	},
	'workspaces.get': {
		riskLevel: 'read',
		description:
			'Get Workspace. Returns the Workspace associated with the token used to access this resource. The workspace the token belongs to: a cheap call to check the token.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof segmentEndpointsNested>;
