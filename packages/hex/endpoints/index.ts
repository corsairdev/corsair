import {
	adminListAgentUsage,
	adminListCreditGrants,
	adminListTopics,
} from './admin';
import {
	cellsCreate,
	cellsDelete,
	cellsGet,
	cellsGetChartImage,
	cellsGetOutput,
	cellsList,
	cellsUpdate,
} from './cells';
import {
	collectionsCreate,
	collectionsGet,
	collectionsList,
	collectionsUpdate,
} from './collections';
import {
	dataConnectionsCreate,
	dataConnectionsGet,
	dataConnectionsList,
	dataConnectionsUpdate,
	dataConnectionsUpdateSchema,
} from './data-connections';
import { embeddingCreatePresignedUrl } from './embedding';
import {
	groupsCreate,
	groupsDelete,
	groupsGet,
	groupsList,
	groupsUpdate,
} from './groups';
import {
	guidesDeleteDraft,
	guidesListDrafts,
	guidesPublish,
	guidesUpsertDraft,
} from './guides';
import {
	projectRunsCancel,
	projectRunsGetChartImage,
	projectRunsGetStatus,
	projectRunsList,
	projectRunsRun,
} from './project-runs';
import {
	projectsBatchUpdateComputeProfile,
	projectsCreate,
	projectsEditSharingCollections,
	projectsEditSharingGroups,
	projectsEditSharingOrgAndPublic,
	projectsEditSharingUsers,
	projectsExport,
	projectsGet,
	projectsGetQueriedTables,
	projectsList,
	projectsUpdate,
} from './projects';
import { semanticUpdate } from './semantic';
import {
	suggestionsGet,
	suggestionsGetV2,
	suggestionsList,
	suggestionsTriggerReview,
	suggestionsUpdate,
	suggestionsUpdateChange,
} from './suggestions';
import {
	threadsContinue,
	threadsCreate,
	threadsGet,
	threadsGetMessages,
	threadsList,
} from './threads';
import { usersDeactivate, usersList, usersMe } from './users';

export const Admin = {
	listAgentUsage: adminListAgentUsage,
	listTopics: adminListTopics,
	listCreditGrants: adminListCreditGrants,
} as const;

export const Cells = {
	list: cellsList,
	create: cellsCreate,
	delete: cellsDelete,
	get: cellsGet,
	update: cellsUpdate,
	getChartImage: cellsGetChartImage,
	getOutput: cellsGetOutput,
} as const;

export const Collections = {
	list: collectionsList,
	create: collectionsCreate,
	get: collectionsGet,
	update: collectionsUpdate,
} as const;

export const DataConnections = {
	list: dataConnectionsList,
	create: dataConnectionsCreate,
	get: dataConnectionsGet,
	update: dataConnectionsUpdate,
	updateSchema: dataConnectionsUpdateSchema,
} as const;

export const Embedding = {
	createPresignedUrl: embeddingCreatePresignedUrl,
} as const;

export const Groups = {
	list: groupsList,
	create: groupsCreate,
	delete: groupsDelete,
	get: groupsGet,
	update: groupsUpdate,
} as const;

export const Guides = {
	upsertDraft: guidesUpsertDraft,
	deleteDraft: guidesDeleteDraft,
	listDrafts: guidesListDrafts,
	publish: guidesPublish,
} as const;

export const Projects = {
	list: projectsList,
	create: projectsCreate,
	get: projectsGet,
	update: projectsUpdate,
	getQueriedTables: projectsGetQueriedTables,
	editSharingCollections: projectsEditSharingCollections,
	editSharingGroups: projectsEditSharingGroups,
	editSharingUsers: projectsEditSharingUsers,
	editSharingOrgAndPublic: projectsEditSharingOrgAndPublic,
	batchUpdateComputeProfile: projectsBatchUpdateComputeProfile,
	export: projectsExport,
} as const;

export const ProjectRuns = {
	list: projectRunsList,
	run: projectRunsRun,
	cancel: projectRunsCancel,
	getStatus: projectRunsGetStatus,
	getChartImage: projectRunsGetChartImage,
} as const;

export const Semantic = {
	update: semanticUpdate,
} as const;

export const Suggestions = {
	list: suggestionsList,
	get: suggestionsGet,
	update: suggestionsUpdate,
	updateChange: suggestionsUpdateChange,
	triggerReview: suggestionsTriggerReview,
	getV2: suggestionsGetV2,
} as const;

export const Threads = {
	list: threadsList,
	create: threadsCreate,
	get: threadsGet,
	continue: threadsContinue,
	getMessages: threadsGetMessages,
} as const;

export const Users = {
	list: usersList,
	deactivate: usersDeactivate,
	me: usersMe,
} as const;

export * from './types';
