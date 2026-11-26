import * as Annotations from './annotations';
import * as Experiments from './experiments';
import * as Export from './export';
import * as FeatureFlags from './feature-flags';
import * as Gdpr from './gdpr';
import * as Groups from './groups';
import * as Ingestion from './ingestion';
import * as Lexicon from './lexicon';
import * as Pipelines from './pipelines';
import * as Platform from './platform';
import * as Profiles from './profiles';
import * as Reports from './reports';
import * as ServiceAccounts from './service-accounts';
import * as Warehouse from './warehouse';

export const mixpanelEndpointsNested = {
	events: {
		import: Ingestion.importEvents,
		track: Ingestion.trackEvents,
		counts: Reports.eventsCounts,
		top: Reports.eventsTop,
		names: Reports.eventsNames,
		propertyCounts: Reports.eventsPropertyCounts,
		topProperties: Reports.eventsTopProperties,
		topPropertyValues: Reports.eventsTopPropertyValues,
	},
	identity: {
		createIdentity: Ingestion.createIdentity,
		createAlias: Ingestion.createAlias,
		merge: Ingestion.mergeIdentities,
	},
	lookupTables: {
		list: Ingestion.listLookupTables,
		replace: Ingestion.replaceLookupTable,
	},
	profiles: {
		query: Profiles.query,
		activity: Profiles.activity,
		set: Profiles.set,
		setOnce: Profiles.setOnce,
		increment: Profiles.increment,
		union: Profiles.union,
		append: Profiles.append,
		remove: Profiles.remove,
		unset: Profiles.unset,
		batchUpdate: Profiles.batchUpdate,
		delete: Profiles.deleteProfile,
	},
	groups: {
		set: Groups.set,
		setOnce: Groups.setOnce,
		union: Groups.union,
		remove: Groups.remove,
		unset: Groups.unset,
		batchUpdate: Groups.batchUpdate,
		delete: Groups.deleteGroup,
	},
	insights: {
		query: Reports.insightsQuery,
		run: Reports.insightsRun,
	},
	funnels: {
		query: Reports.funnelsQuery,
		list: Reports.funnelsList,
	},
	retention: {
		query: Reports.retentionQuery,
		frequency: Reports.retentionFrequency,
	},
	segmentation: {
		query: Reports.segmentationQuery,
		numeric: Reports.segmentationNumeric,
		sum: Reports.segmentationSum,
		average: Reports.segmentationAverage,
	},
	cohorts: {
		list: Reports.cohortsList,
	},
	jql: {
		run: Reports.jqlRun,
	},
	export: {
		events: Export.events,
	},
	annotations: {
		list: Annotations.list,
		get: Annotations.get,
		create: Annotations.create,
		update: Annotations.update,
		delete: Annotations.remove,
		listTags: Annotations.listTags,
		createTag: Annotations.createTag,
	},
	lexicon: {
		list: Lexicon.list,
		listForEntity: Lexicon.listForEntity,
		get: Lexicon.get,
		upsert: Lexicon.upsert,
		upsertMany: Lexicon.upsertMany,
		delete: Lexicon.remove,
		deleteForEntity: Lexicon.removeForEntity,
		deleteAll: Lexicon.removeAll,
	},
	serviceAccounts: {
		list: ServiceAccounts.list,
		listForProject: ServiceAccounts.listForProject,
		get: ServiceAccounts.get,
		create: ServiceAccounts.create,
		delete: ServiceAccounts.remove,
		addToProjects: ServiceAccounts.addToProjects,
		removeFromProjects: ServiceAccounts.removeFromProjects,
	},
	gdpr: {
		createRetrieval: Gdpr.createRetrieval,
		getRetrieval: Gdpr.getRetrieval,
		createDeletion: Gdpr.createDeletion,
		getDeletion: Gdpr.getDeletion,
		cancelDeletion: Gdpr.cancelDeletion,
	},
	featureFlags: {
		list: FeatureFlags.list,
		get: FeatureFlags.get,
		create: FeatureFlags.create,
		update: FeatureFlags.update,
		delete: FeatureFlags.remove,
		evaluate: FeatureFlags.evaluate,
		definitions: FeatureFlags.definitions,
	},
	experiments: {
		list: Experiments.list,
		get: Experiments.get,
		create: Experiments.create,
		update: Experiments.update,
		delete: Experiments.remove,
		archive: Experiments.archive,
		unarchive: Experiments.unarchive,
		launch: Experiments.launch,
		decide: Experiments.decide,
		forceConclude: Experiments.forceConclude,
	},
	warehouseImports: {
		list: Warehouse.list,
		get: Warehouse.get,
		update: Warehouse.update,
		delete: Warehouse.remove,
		createEventStream: Warehouse.createEventStream,
		createPeople: Warehouse.createPeople,
		createGroups: Warehouse.createGroups,
		createLookupTable: Warehouse.createLookupTable,
		run: Warehouse.run,
		history: Warehouse.history,
	},
	pipelines: {
		list: Pipelines.list,
		create: Pipelines.create,
		edit: Pipelines.edit,
		delete: Pipelines.cancel,
		pause: Pipelines.pause,
		resume: Pipelines.resume,
		status: Pipelines.status,
		timeline: Pipelines.timeline,
	},
	dataDefinitions: {
		list: Platform.listDefinitions,
		get: Platform.getDefinition,
		create: Platform.createDefinition,
		update: Platform.updateDefinition,
		delete: Platform.deleteDefinition,
		merge: Platform.mergeDefinitions,
		unmerge: Platform.unmergeDefinitions,
	},
	dataDefinitionTags: {
		list: Platform.listTags,
		get: Platform.getTag,
		create: Platform.createTag,
		rename: Platform.renameTag,
		delete: Platform.deleteTag,
	},
	auditLogs: {
		query: Platform.queryAuditLogs,
	},
} as const;

export {
	Ingestion,
	Profiles,
	Groups,
	Reports,
	Export,
	Annotations,
	Lexicon,
	ServiceAccounts,
	Gdpr,
	FeatureFlags,
	Experiments,
	Warehouse,
	Pipelines,
	Platform,
};
export * from './types';
