import type {
	AuthTypes,
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
import type { ZodType } from 'zod';
import type { GongOpaqueRecord } from './client';
import {
	addCall,
	addCallRecording,
	getCall,
	getCallTranscripts,
	listCalls,
	listCallsExtensive,
} from './endpoints/calls';
import type {
	GongCallsInputs,
	GongCallsOutputs,
} from './endpoints/calls-types';
import {
	GongCallsInputSchemas,
	GongCallsOutputSchemas,
} from './endpoints/calls-types';
import {
	deleteCrmIntegration,
	getCrmObjects,
	getCrmRequestStatus,
	listCrmIntegrations,
	listCrmSchemaFields,
	registerCrmIntegration,
	uploadCrmObjects,
	uploadCrmSchemaFields,
} from './endpoints/crm';
import {
	GongCrmInputSchemas,
	GongCrmOutputSchemas,
} from './endpoints/crm-types';
import {
	assignProspects,
	getFlowProspectsBulkAssignment,
	getFlowSteps,
	getProspectsAssignedFlows,
	listFlows,
	listFlowsFolders,
	searchFlows,
	submitFlowProspectsBulkAssignment,
	unassignFlows,
	unassignProspectFlows,
} from './endpoints/engage-flows';
import {
	GongEngageFlowsInputSchemas,
	GongEngageFlowsOutputSchemas,
} from './endpoints/engage-flows-types';
import { updateIntegrationSettings } from './endpoints/integration-settings';
import {
	GongIntegrationSettingsInputSchemas,
	GongIntegrationSettingsOutputSchemas,
} from './endpoints/integration-settings-types';
import {
	getCallsInSpecificFolder,
	getLibraryStructure,
} from './endpoints/library';
import {
	GongLibraryInputSchemas,
	GongLibraryOutputSchemas,
} from './endpoints/library-types';
import {
	accountsEnrich,
	addDigitalInteraction,
	askEntity,
	contactsEnrich,
	findAllReferencesToEmailAddress,
	findAllReferencesToPhoneNumber,
	generateBrief,
	getAccountsEnrichResults,
	getContactsEnrichResults,
	listCallOutcomes,
	listCoaching,
	listLogs,
	purgeEmailAddress,
	purgePhoneNumber,
} from './endpoints/other';
import type {
	GongOtherInputs,
	GongOtherOutputs,
} from './endpoints/other-types';
import {
	GongOtherInputSchemas,
	GongOtherOutputSchemas,
} from './endpoints/other-types';
import {
	addUsersAccessToCalls,
	createPermissionProfile,
	deleteUsersAccessToCalls,
	getPermissionProfile,
	getUsersAccessToCalls,
	listPermissionProfile,
	listPermissionProfileUsers,
	updatePermissionProfile,
} from './endpoints/permissions';
import type {
	GongPermissionsInputs,
	GongPermissionsOutputs,
} from './endpoints/permissions-types';
import {
	GongPermissionsInputSchemas,
	GongPermissionsOutputSchemas,
} from './endpoints/permissions-types';
import { listBriefs, listScorecards, listTrackers } from './endpoints/settings';
import {
	GongSettingsInputSchemas,
	GongSettingsOutputSchemas,
} from './endpoints/settings-types';
import {
	listAnsweredScorecards,
	listInteractionStats,
	listMultipleUsersAggregateActivity,
	listMultipleUsersAggregateByPeriod,
	listMultipleUsersDayByDayActivity,
} from './endpoints/stats';
import {
	GongStatsInputSchemas,
	GongStatsOutputSchemas,
} from './endpoints/stats-types';
import { listTargetDefinitions, uploadAssignments } from './endpoints/targets';
import {
	GongTargetsInputSchemas,
	GongTargetsOutputSchemas,
} from './endpoints/targets-types';
import { listTasks, updateReminder } from './endpoints/tasks';
import {
	GongTasksInputSchemas,
	GongTasksOutputSchemas,
} from './endpoints/tasks-types';
import {
	getUser,
	getUserHistory,
	listMultipleUsers,
	listUsers,
} from './endpoints/users';
import type {
	GongUsersInputs,
	GongUsersOutputs,
} from './endpoints/users-types';
import {
	GongUsersInputSchemas,
	GongUsersOutputSchemas,
} from './endpoints/users-types';
import { listWorkspaces } from './endpoints/workspaces';
import {
	GongWorkspacesInputSchemas,
	GongWorkspacesOutputSchemas,
} from './endpoints/workspaces-types';
import { errorHandlers } from './error-handlers';
import { GongSchema } from './schema';

export type GongPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	accessKey?: string;
	accessKeySecret?: string;
	baseUrl?: string;
	hooks?: InternalGongPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gongEndpointsNested>;
};

export type GongContext = CorsairPluginContext<
	typeof GongSchema,
	GongPluginOptions
>;
export type GongKeyBuilderContext = KeyBuilderContext<GongPluginOptions>;
export type GongBoundEndpoints = BindEndpoints<typeof gongEndpointsNested>;
type GongEndpoint<K extends keyof GongCallsOutputs> = CorsairEndpoint<
	GongContext,
	GongCallsInputs[K],
	GongCallsOutputs[K]
>;
type GongUserEndpoint<K extends keyof GongUsersOutputs> = CorsairEndpoint<
	GongContext,
	GongUsersInputs[K],
	GongUsersOutputs[K]
>;
type GongOtherEndpoint<K extends keyof GongOtherOutputs> = CorsairEndpoint<
	GongContext,
	GongOtherInputs[K],
	GongOtherOutputs[K]
>;
type GongPermissionEndpoint<K extends keyof GongPermissionsOutputs> =
	CorsairEndpoint<
		GongContext,
		GongPermissionsInputs[K],
		GongPermissionsOutputs[K]
	>;

export type GongEndpoints = {
	callsAddCall: GongEndpoint<'addCall'>;
	callsAddCallRecording: GongEndpoint<'addCallRecording'>;
	callsListCalls: GongEndpoint<'listCalls'>;
	callsGetCall: GongEndpoint<'getCall'>;
	callsListCallsExtensive: GongEndpoint<'listCallsExtensive'>;
	callsGetCallTranscripts: GongEndpoint<'getCallTranscripts'>;
};

export type GongUserEndpoints = {
	listUsers: GongUserEndpoint<'listUsers'>;
	listMultipleUsers: GongUserEndpoint<'listMultipleUsers'>;
	getUser: GongUserEndpoint<'getUser'>;
	getUserHistory: GongUserEndpoint<'getUserHistory'>;
};
export type GongOtherEndpoints = {
	addDigitalInteraction: GongOtherEndpoint<'addDigitalInteraction'>;
	purgePhoneNumber: GongOtherEndpoint<'purgePhoneNumber'>;
	purgeEmailAddress: GongOtherEndpoint<'purgeEmailAddress'>;
	findAllReferencesToPhoneNumber: GongOtherEndpoint<'findAllReferencesToPhoneNumber'>;
	findAllReferencesToEmailAddress: GongOtherEndpoint<'findAllReferencesToEmailAddress'>;
	accountsEnrich: GongOtherEndpoint<'accountsEnrich'>;
	getAccountsEnrichResults: GongOtherEndpoint<'getAccountsEnrichResults'>;
	contactsEnrich: GongOtherEndpoint<'contactsEnrich'>;
	getContactsEnrichResults: GongOtherEndpoint<'getContactsEnrichResults'>;
	listLogs: GongOtherEndpoint<'listLogs'>;
	generateBrief: GongOtherEndpoint<'generateBrief'>;
	askEntity: GongOtherEndpoint<'askEntity'>;
	listCoaching: GongOtherEndpoint<'listCoaching'>;
	listCallOutcomes: GongOtherEndpoint<'listCallOutcomes'>;
};
export type GongPermissionEndpoints = {
	getPermissionProfile: GongPermissionEndpoint<'getPermissionProfile'>;
	updatePermissionProfile: GongPermissionEndpoint<'updatePermissionProfile'>;
	createPermissionProfile: GongPermissionEndpoint<'createPermissionProfile'>;
	addUsersAccessToCalls: GongPermissionEndpoint<'addUsersAccessToCalls'>;
	getUsersAccessToCalls: GongPermissionEndpoint<'getUsersAccessToCalls'>;
	deleteUsersAccessToCalls: GongPermissionEndpoint<'deleteUsersAccessToCalls'>;
	listPermissionProfileUsers: GongPermissionEndpoint<'listPermissionProfileUsers'>;
	listPermissionProfile: GongPermissionEndpoint<'listPermissionProfile'>;
};

const gongEndpointsNested = {
	calls: {
		add: addCall,
		addRecording: addCallRecording,
		list: listCalls,
		get: getCall,
		listExtensive: listCallsExtensive,
		getTranscripts: getCallTranscripts,
	},
	users: {
		list: listUsers,
		listMultiple: listMultipleUsers,
		get: getUser,
		getHistory: getUserHistory,
	},
	digitalInteractions: { add: addDigitalInteraction },
	dataPrivacy: {
		purgePhoneNumber: purgePhoneNumber,
		purgeEmailAddress: purgeEmailAddress,
		findPhoneReferences: findAllReferencesToPhoneNumber,
		findEmailReferences: findAllReferencesToEmailAddress,
	},
	accountsEnrich: {
		start: accountsEnrich,
		getResults: getAccountsEnrichResults,
	},
	contactsEnrich: {
		start: contactsEnrich,
		getResults: getContactsEnrichResults,
	},
	auditing: { listLogs },
	entities: { generateBrief, ask: askEntity },
	coaching: { list: listCoaching },
	outcomes: { list: listCallOutcomes },
	permissions: {
		getProfile: getPermissionProfile,
		updateProfile: updatePermissionProfile,
		createProfile: createPermissionProfile,
		addCallUsers: addUsersAccessToCalls,
		getCallUsers: getUsersAccessToCalls,
		deleteCallUsers: deleteUsersAccessToCalls,
		listProfileUsers: listPermissionProfileUsers,
		listProfiles: listPermissionProfile,
	},
	crm: {
		listIntegrations: listCrmIntegrations,
		registerIntegration: registerCrmIntegration,
		deleteIntegration: deleteCrmIntegration,
		listSchemaFields: listCrmSchemaFields,
		uploadSchemaFields: uploadCrmSchemaFields,
		getObjects: getCrmObjects,
		uploadObjects: uploadCrmObjects,
		getRequestStatus: getCrmRequestStatus,
	},
	integrationSettings: { update: updateIntegrationSettings },
	stats: {
		interaction: listInteractionStats,
		answeredScorecards: listAnsweredScorecards,
		dayByDay: listMultipleUsersDayByDayActivity,
		aggregate: listMultipleUsersAggregateActivity,
		aggregateByPeriod: listMultipleUsersAggregateByPeriod,
	},
	settings: {
		trackers: listTrackers,
		scorecards: listScorecards,
		briefs: listBriefs,
	},
	engageFlows: {
		steps: getFlowSteps,
		assignedProspects: getProspectsAssignedFlows,
		unassign: unassignFlows,
		unassignProspects: unassignProspectFlows,
		bulkAssignment: submitFlowProspectsBulkAssignment,
		assign: assignProspects,
		list: listFlows,
		search: searchFlows,
		getBulkAssignment: getFlowProspectsBulkAssignment,
		folders: listFlowsFolders,
	},
	tasks: { list: listTasks, updateReminder },
	targets: { listDefinitions: listTargetDefinitions, uploadAssignments },
	library: {
		folders: getLibraryStructure,
		folderContent: getCallsInSpecificFolder,
	},
	workspaces: { list: listWorkspaces },
} as const;

export const gongEndpointSchemas = {
	'calls.add': {
		input: GongCallsInputSchemas.addCall,
		output: GongCallsOutputSchemas.addCall,
	},
	'calls.addRecording': {
		input: GongCallsInputSchemas.addCallRecording,
		output: GongCallsOutputSchemas.addCallRecording,
	},
	'calls.list': {
		input: GongCallsInputSchemas.listCalls,
		output: GongCallsOutputSchemas.listCalls,
	},
	'calls.get': {
		input: GongCallsInputSchemas.getCall,
		output: GongCallsOutputSchemas.getCall,
	},
	'calls.listExtensive': {
		input: GongCallsInputSchemas.listCallsExtensive,
		output: GongCallsOutputSchemas.listCallsExtensive,
	},
	'calls.getTranscripts': {
		input: GongCallsInputSchemas.getCallTranscripts,
		output: GongCallsOutputSchemas.getCallTranscripts,
	},
	'users.list': {
		input: GongUsersInputSchemas.listUsers,
		output: GongUsersOutputSchemas.listUsers,
	},
	'users.listMultiple': {
		input: GongUsersInputSchemas.listMultipleUsers,
		output: GongUsersOutputSchemas.listMultipleUsers,
	},
	'users.get': {
		input: GongUsersInputSchemas.getUser,
		output: GongUsersOutputSchemas.getUser,
	},
	'users.getHistory': {
		input: GongUsersInputSchemas.getUserHistory,
		output: GongUsersOutputSchemas.getUserHistory,
	},
	'digitalInteractions.add': {
		input: GongOtherInputSchemas.addDigitalInteraction,
		output: GongOtherOutputSchemas.addDigitalInteraction,
	},
	'dataPrivacy.purgePhoneNumber': {
		input: GongOtherInputSchemas.purgePhoneNumber,
		output: GongOtherOutputSchemas.purgePhoneNumber,
	},
	'dataPrivacy.purgeEmailAddress': {
		input: GongOtherInputSchemas.purgeEmailAddress,
		output: GongOtherOutputSchemas.purgeEmailAddress,
	},
	'dataPrivacy.findPhoneReferences': {
		input: GongOtherInputSchemas.findAllReferencesToPhoneNumber,
		output: GongOtherOutputSchemas.findAllReferencesToPhoneNumber,
	},
	'dataPrivacy.findEmailReferences': {
		input: GongOtherInputSchemas.findAllReferencesToEmailAddress,
		output: GongOtherOutputSchemas.findAllReferencesToEmailAddress,
	},
	'accountsEnrich.start': {
		input: GongOtherInputSchemas.accountsEnrich,
		output: GongOtherOutputSchemas.accountsEnrich,
	},
	'accountsEnrich.getResults': {
		input: GongOtherInputSchemas.getAccountsEnrichResults,
		output: GongOtherOutputSchemas.getAccountsEnrichResults,
	},
	'contactsEnrich.start': {
		input: GongOtherInputSchemas.contactsEnrich,
		output: GongOtherOutputSchemas.contactsEnrich,
	},
	'contactsEnrich.getResults': {
		input: GongOtherInputSchemas.getContactsEnrichResults,
		output: GongOtherOutputSchemas.getContactsEnrichResults,
	},
	'auditing.listLogs': {
		input: GongOtherInputSchemas.listLogs,
		output: GongOtherOutputSchemas.listLogs,
	},
	'entities.generateBrief': {
		input: GongOtherInputSchemas.generateBrief,
		output: GongOtherOutputSchemas.generateBrief,
	},
	'entities.ask': {
		input: GongOtherInputSchemas.askEntity,
		output: GongOtherOutputSchemas.askEntity,
	},
	'coaching.list': {
		input: GongOtherInputSchemas.listCoaching,
		output: GongOtherOutputSchemas.listCoaching,
	},
	'outcomes.list': {
		input: GongOtherInputSchemas.listCallOutcomes,
		output: GongOtherOutputSchemas.listCallOutcomes,
	},
	'permissions.getProfile': {
		input: GongPermissionsInputSchemas.getPermissionProfile,
		output: GongPermissionsOutputSchemas.getPermissionProfile,
	},
	'permissions.updateProfile': {
		input: GongPermissionsInputSchemas.updatePermissionProfile,
		output: GongPermissionsOutputSchemas.updatePermissionProfile,
	},
	'permissions.createProfile': {
		input: GongPermissionsInputSchemas.createPermissionProfile,
		output: GongPermissionsOutputSchemas.createPermissionProfile,
	},
	'permissions.addCallUsers': {
		input: GongPermissionsInputSchemas.addUsersAccessToCalls,
		output: GongPermissionsOutputSchemas.addUsersAccessToCalls,
	},
	'permissions.getCallUsers': {
		input: GongPermissionsInputSchemas.getUsersAccessToCalls,
		output: GongPermissionsOutputSchemas.getUsersAccessToCalls,
	},
	'permissions.deleteCallUsers': {
		input: GongPermissionsInputSchemas.deleteUsersAccessToCalls,
		output: GongPermissionsOutputSchemas.deleteUsersAccessToCalls,
	},
	'permissions.listProfileUsers': {
		input: GongPermissionsInputSchemas.listPermissionProfileUsers,
		output: GongPermissionsOutputSchemas.listPermissionProfileUsers,
	},
	'permissions.listProfiles': {
		input: GongPermissionsInputSchemas.listPermissionProfile,
		output: GongPermissionsOutputSchemas.listPermissionProfile,
	},
	'crm.listIntegrations': {
		input: GongCrmInputSchemas.listIntegrations,
		output: GongCrmOutputSchemas.listIntegrations,
	},
	'crm.registerIntegration': {
		input: GongCrmInputSchemas.registerIntegration,
		output: GongCrmOutputSchemas.registerIntegration,
	},
	'crm.deleteIntegration': {
		input: GongCrmInputSchemas.deleteIntegration,
		output: GongCrmOutputSchemas.deleteIntegration,
	},
	'crm.listSchemaFields': {
		input: GongCrmInputSchemas.listSchemaFields,
		output: GongCrmOutputSchemas.listSchemaFields,
	},
	'crm.uploadSchemaFields': {
		input: GongCrmInputSchemas.uploadSchemaFields,
		output: GongCrmOutputSchemas.uploadSchemaFields,
	},
	'crm.getObjects': {
		input: GongCrmInputSchemas.getObjects,
		output: GongCrmOutputSchemas.getObjects,
	},
	'crm.uploadObjects': {
		input: GongCrmInputSchemas.uploadObjects,
		output: GongCrmOutputSchemas.uploadObjects,
	},
	'crm.getRequestStatus': {
		input: GongCrmInputSchemas.getRequestStatus,
		output: GongCrmOutputSchemas.getRequestStatus,
	},
	'integrationSettings.update': {
		input: GongIntegrationSettingsInputSchemas.update,
		output: GongIntegrationSettingsOutputSchemas.update,
	},
	'stats.interaction': {
		input: GongStatsInputSchemas.listInteractionStats,
		output: GongStatsOutputSchemas.listInteractionStats,
	},
	'stats.answeredScorecards': {
		input: GongStatsInputSchemas.listAnsweredScorecards,
		output: GongStatsOutputSchemas.listAnsweredScorecards,
	},
	'stats.dayByDay': {
		input: GongStatsInputSchemas.listMultipleUsersDayByDayActivity,
		output: GongStatsOutputSchemas.listMultipleUsersDayByDayActivity,
	},
	'stats.aggregate': {
		input: GongStatsInputSchemas.listMultipleUsersAggregateActivity,
		output: GongStatsOutputSchemas.listMultipleUsersAggregateActivity,
	},
	'stats.aggregateByPeriod': {
		input: GongStatsInputSchemas.listMultipleUsersAggregateByPeriod,
		output: GongStatsOutputSchemas.listMultipleUsersAggregateByPeriod,
	},
	'settings.trackers': {
		input: GongSettingsInputSchemas.listTrackers,
		output: GongSettingsOutputSchemas.listTrackers,
	},
	'settings.scorecards': {
		input: GongSettingsInputSchemas.listScorecards,
		output: GongSettingsOutputSchemas.listScorecards,
	},
	'settings.briefs': {
		input: GongSettingsInputSchemas.listBriefs,
		output: GongSettingsOutputSchemas.listBriefs,
	},
	'engageFlows.steps': {
		input: GongEngageFlowsInputSchemas.getFlowSteps,
		output: GongEngageFlowsOutputSchemas.getFlowSteps,
	},
	'engageFlows.assignedProspects': {
		input: GongEngageFlowsInputSchemas.getProspectsAssignedFlows,
		output: GongEngageFlowsOutputSchemas.getProspectsAssignedFlows,
	},
	'engageFlows.unassign': {
		input: GongEngageFlowsInputSchemas.unassignFlows,
		output: GongEngageFlowsOutputSchemas.unassignFlows,
	},
	'engageFlows.unassignProspects': {
		input: GongEngageFlowsInputSchemas.unassignProspectFlows,
		output: GongEngageFlowsOutputSchemas.unassignProspectFlows,
	},
	'engageFlows.bulkAssignment': {
		input: GongEngageFlowsInputSchemas.submitFlowProspectsBulkAssignment,
		output: GongEngageFlowsOutputSchemas.submitFlowProspectsBulkAssignment,
	},
	'engageFlows.assign': {
		input: GongEngageFlowsInputSchemas.assignProspects,
		output: GongEngageFlowsOutputSchemas.assignProspects,
	},
	'engageFlows.list': {
		input: GongEngageFlowsInputSchemas.listFlows,
		output: GongEngageFlowsOutputSchemas.listFlows,
	},
	'engageFlows.search': {
		input: GongEngageFlowsInputSchemas.searchFlows,
		output: GongEngageFlowsOutputSchemas.searchFlows,
	},
	'engageFlows.getBulkAssignment': {
		input: GongEngageFlowsInputSchemas.getFlowProspectsBulkAssignment,
		output: GongEngageFlowsOutputSchemas.getFlowProspectsBulkAssignment,
	},
	'engageFlows.folders': {
		input: GongEngageFlowsInputSchemas.listFlowsFolders,
		output: GongEngageFlowsOutputSchemas.listFlowsFolders,
	},
	'tasks.list': {
		input: GongTasksInputSchemas.listTasks,
		output: GongTasksOutputSchemas.listTasks,
	},
	'tasks.updateReminder': {
		input: GongTasksInputSchemas.updateReminder,
		output: GongTasksOutputSchemas.updateReminder,
	},
	'targets.listDefinitions': {
		input: GongTargetsInputSchemas.listTargetDefinitions,
		output: GongTargetsOutputSchemas.listTargetDefinitions,
	},
	'targets.uploadAssignments': {
		input: GongTargetsInputSchemas.uploadAssignments,
		output: GongTargetsOutputSchemas.uploadAssignments,
	},
	'library.folders': {
		input: GongLibraryInputSchemas.getLibraryStructure,
		output: GongLibraryOutputSchemas.getLibraryStructure,
	},
	'library.folderContent': {
		input: GongLibraryInputSchemas.getCallsInSpecificFolder,
		output: GongLibraryOutputSchemas.getCallsInSpecificFolder,
	},
	'workspaces.list': {
		input: GongWorkspacesInputSchemas.listWorkspaces,
		output: GongWorkspacesOutputSchemas.listWorkspaces,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gongEndpointsNested>;

const expectedGongEndpointCount = 66;
if (Object.keys(gongEndpointSchemas).length !== expectedGongEndpointCount)
	throw new Error(
		`Expected ${expectedGongEndpointCount} Gong endpoint schemas, found ${Object.keys(gongEndpointSchemas).length}`,
	);

// The generated endpoint tree mixes namespace objects with endpoint functions.
function validateEndpointTree<T extends GongOpaqueRecord>(
	endpoints: T,
	schemas: Record<string, { input?: ZodType; output?: ZodType }>,
	parentPath = '',
): T {
	// The recursive tree is heterogeneous until each entry is visited below.
	const validated: GongOpaqueRecord = {};
	for (const [name, value] of Object.entries(endpoints)) {
		const path = parentPath ? `${parentPath}.${name}` : name;
		if (typeof value === 'function') {
			const schema = schemas[path];
			// Endpoint argument tuples differ; only the second argument is schema-parsed.
			validated[name] = async (...args: unknown[]) => {
				const callArgs = [...args];
				if (schema?.input) callArgs[1] = schema.input.parse(callArgs[1] ?? {});
				// The provider response remains opaque until its registered output schema parses it.
				const result: unknown = await Reflect.apply(value, undefined, callArgs);
				return schema?.output ? schema.output.parse(result) : result;
			};
		} else if (value && typeof value === 'object') {
			validated[name] = validateEndpointTree(
				// This branch is known to be a nested namespace object.
				value as GongOpaqueRecord,
				schemas,
				path,
			);
		} else {
			validated[name] = value;
		}
	}
	// This recursive copy preserves endpoint signatures; schemas add runtime checks only.
	return validated as T;
}

const validatedGongEndpointsNested = validateEndpointTree(
	gongEndpointsNested,
	gongEndpointSchemas,
);

const gongEndpointMeta = {
	'calls.add': {
		riskLevel: 'write',
		description: 'Create a Gong call from an externally recorded conversation.',
	},
	'calls.addRecording': {
		riskLevel: 'write',
		description: 'Upload media for a previously created Gong call.',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List calls within a requested date range.',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Retrieve details for one Gong call.',
	},
	'calls.listExtensive': {
		riskLevel: 'read',
		description: 'Retrieve calls with detailed content and filters.',
	},
	'calls.getTranscripts': {
		riskLevel: 'read',
		description: 'Retrieve transcripts for calls matching the filter.',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users in the Gong company workspace.',
	},
	'users.listMultiple': {
		riskLevel: 'read',
		description: 'List users matching the supplied filters.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve a user by Gong user identifier.',
	},
	'users.getHistory': {
		riskLevel: 'read',
		description: 'Retrieve the settings history for a Gong user.',
	},
	'digitalInteractions.add': {
		riskLevel: 'write',
		description: 'Add a digital interaction event to Gong.',
	},
	'dataPrivacy.purgePhoneNumber': {
		riskLevel: 'destructive',
		description: 'Delete a phone number and its associated Gong data.',
	},
	'dataPrivacy.purgeEmailAddress': {
		riskLevel: 'destructive',
		description: 'Delete an email address and its associated Gong data.',
	},
	'dataPrivacy.findPhoneReferences': {
		riskLevel: 'read',
		description: 'Find Gong records associated with a phone number.',
	},
	'dataPrivacy.findEmailReferences': {
		riskLevel: 'read',
		description: 'Find Gong records associated with an email address.',
	},
	'accountsEnrich.start': {
		riskLevel: 'write',
		description: 'Start an account enrichment job.',
	},
	'accountsEnrich.getResults': {
		riskLevel: 'read',
		description: 'Retrieve account enrichment results for a job.',
	},
	'contactsEnrich.start': {
		riskLevel: 'write',
		description: 'Start a contact enrichment job.',
	},
	'contactsEnrich.getResults': {
		riskLevel: 'read',
		description: 'Retrieve contact enrichment results for a job.',
	},
	'auditing.listLogs': {
		riskLevel: 'read',
		description: 'Retrieve Gong audit log entries for a time range.',
	},
	'entities.generateBrief': {
		riskLevel: 'read',
		description: 'Generate an AI brief for a CRM entity.',
	},
	'entities.ask': {
		riskLevel: 'read',
		description: 'Ask a question about a CRM entity.',
	},
	'coaching.list': {
		riskLevel: 'read',
		description: 'List coaching metrics for users.',
	},
	'outcomes.list': {
		riskLevel: 'read',
		description: 'List available call outcomes.',
	},
	'permissions.getProfile': {
		riskLevel: 'read',
		description: 'Retrieve a permission profile.',
	},
	'permissions.updateProfile': {
		riskLevel: 'write',
		description: 'Update a permission profile.',
	},
	'permissions.createProfile': {
		riskLevel: 'write',
		description: 'Create a permission profile.',
	},
	'permissions.addCallUsers': {
		riskLevel: 'write',
		description: 'Grant individual users access to calls.',
	},
	'permissions.getCallUsers': {
		riskLevel: 'read',
		description: 'Retrieve users with individual call access.',
	},
	'permissions.deleteCallUsers': {
		riskLevel: 'destructive',
		description: 'Remove individual users from call access.',
	},
	'permissions.listProfileUsers': {
		riskLevel: 'read',
		description: 'List users attached to a permission profile.',
	},
	'permissions.listProfiles': {
		riskLevel: 'read',
		description: 'List permission profiles for a workspace.',
	},
	'crm.listIntegrations': {
		riskLevel: 'read',
		description: 'List Gong CRM integrations.',
	},
	'crm.registerIntegration': {
		riskLevel: 'write',
		description: 'Register a Gong CRM integration.',
	},
	'crm.deleteIntegration': {
		riskLevel: 'destructive',
		description: 'Delete a Gong CRM integration.',
	},
	'crm.listSchemaFields': {
		riskLevel: 'read',
		description: 'List selected CRM schema fields.',
	},
	'crm.uploadSchemaFields': {
		riskLevel: 'write',
		description: 'Upload selected CRM schema fields.',
	},
	'crm.getObjects': {
		riskLevel: 'read',
		description: 'Retrieve CRM objects by CRM IDs.',
	},
	'crm.uploadObjects': {
		riskLevel: 'write',
		description: 'Upload CRM objects from a data file.',
	},
	'crm.getRequestStatus': {
		riskLevel: 'read',
		description: 'Retrieve CRM request status.',
	},
	'integrationSettings.update': {
		riskLevel: 'write',
		description: 'Update Gong integration settings.',
	},
	'stats.interaction': {
		riskLevel: 'read',
		description: 'Retrieve interaction statistics.',
	},
	'stats.answeredScorecards': {
		riskLevel: 'read',
		description: 'Retrieve answered scorecard statistics.',
	},
	'stats.dayByDay': {
		riskLevel: 'read',
		description: 'Retrieve daily user activity.',
	},
	'stats.aggregate': {
		riskLevel: 'read',
		description: 'Retrieve aggregate user activity.',
	},
	'stats.aggregateByPeriod': {
		riskLevel: 'read',
		description: 'Retrieve aggregate activity by period.',
	},
	'settings.trackers': {
		riskLevel: 'read',
		description: 'List keyword trackers.',
	},
	'settings.scorecards': { riskLevel: 'read', description: 'List scorecards.' },
	'settings.briefs': { riskLevel: 'read', description: 'List briefs.' },
	'engageFlows.steps': {
		riskLevel: 'read',
		description: 'Retrieve steps for Engage flows.',
	},
	'engageFlows.assignedProspects': {
		riskLevel: 'read',
		description: 'Retrieve prospects assigned to flows.',
	},
	'engageFlows.unassign': {
		riskLevel: 'write',
		description: 'Unassign flows by instance ID.',
	},
	'engageFlows.unassignProspects': {
		riskLevel: 'write',
		description: 'Unassign prospect flows by CRM ID.',
	},
	'engageFlows.bulkAssignment': {
		riskLevel: 'write',
		description: 'Submit a bulk flow assignment.',
	},
	'engageFlows.assign': {
		riskLevel: 'write',
		description: 'Assign prospects to flows.',
	},
	'engageFlows.list': { riskLevel: 'read', description: 'List Engage flows.' },
	'engageFlows.search': {
		riskLevel: 'read',
		description: 'Search Engage flows.',
	},
	'engageFlows.getBulkAssignment': {
		riskLevel: 'read',
		description: 'Retrieve a bulk flow assignment.',
	},
	'engageFlows.folders': {
		riskLevel: 'read',
		description: 'List Engage flow folders.',
	},
	'tasks.list': { riskLevel: 'read', description: 'List Gong tasks.' },
	'tasks.updateReminder': {
		riskLevel: 'write',
		description: 'Update a task reminder.',
	},
	'targets.listDefinitions': {
		riskLevel: 'read',
		description: 'List target definitions.',
	},
	'targets.uploadAssignments': {
		riskLevel: 'write',
		description: 'Upload target assignments.',
	},
	'library.folders': {
		riskLevel: 'read',
		description: 'Retrieve public library folders.',
	},
	'library.folderContent': {
		riskLevel: 'read',
		description: 'List calls in a library folder.',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List company workspaces.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gongEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export type BaseGongPlugin<T extends GongPluginOptions> = CorsairPlugin<
	'gong',
	typeof GongSchema,
	typeof gongEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalGongPlugin = BaseGongPlugin<GongPluginOptions>;
export type ExternalGongPlugin<T extends GongPluginOptions> = BaseGongPlugin<T>;

export function gong<const T extends GongPluginOptions>(
	incomingOptions: GongPluginOptions & T = {} as GongPluginOptions & T,
): ExternalGongPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gong',
		schema: GongSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedGongEndpointsNested,
		webhooks: {},
		endpointMeta: gongEndpointMeta,
		endpointSchemas: gongEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: GongKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('gong', ctx.authType);
			if (options.key) return options.key;
			if (ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();
				if (token) return token;
				throw new AuthMissingError('gong', 'oauth_2');
			}
			if (options.accessKey && options.accessKeySecret)
				return options.accessKey;
			const storedKey = await ctx.keys.get_api_key();
			if (storedKey && options.accessKeySecret) return storedKey;
			throw new AuthMissingError('gong', 'api_key');
		},
	} satisfies InternalGongPlugin;
}

export type {
	GongCallsInputs,
	GongCallsOutputs,
} from './endpoints/calls-types';
