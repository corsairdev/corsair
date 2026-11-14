import type {
	AuthTypes,
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
import { ShortcutEndpointsNested } from './endpoints';
import type {
	ShortcutEndpointInputs,
	ShortcutEndpointOutputs,
} from './endpoints/types';
import {
	ShortcutEndpointInputSchemas,
	ShortcutEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ShortcutSchema } from './schema';

export type ShortcutPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalShortcutPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ShortcutEndpointsNested>;
};
export type ShortcutContext = CorsairPluginContext<
	typeof ShortcutSchema,
	ShortcutPluginOptions
>;
export type ShortcutKeyBuilderContext = KeyBuilderContext<
	ShortcutPluginOptions,
	typeof shortcutAuthConfig
>;
export type ShortcutBoundEndpoints = BindEndpoints<
	typeof ShortcutEndpointsNested
>;
export type ShortcutEndpoint<K extends keyof ShortcutEndpointInputs> = (
	ctx: Pick<ShortcutContext, 'key'>,
	input: ShortcutEndpointInputs[K],
) => Promise<ShortcutEndpointOutputs[K]>;
export type ShortcutEndpoints = {
	listCategories: ShortcutEndpoint<'listCategories'>;
	createCategory: ShortcutEndpoint<'createCategory'>;
	getCategory: ShortcutEndpoint<'getCategory'>;
	updateCategory: ShortcutEndpoint<'updateCategory'>;
	deleteCategory: ShortcutEndpoint<'deleteCategory'>;
	listCategoryMilestones: ShortcutEndpoint<'listCategoryMilestones'>;
	listCategoryObjectives: ShortcutEndpoint<'listCategoryObjectives'>;
	listCustomFields: ShortcutEndpoint<'listCustomFields'>;
	getCustomField: ShortcutEndpoint<'getCustomField'>;
	updateCustomField: ShortcutEndpoint<'updateCustomField'>;
	deleteCustomField: ShortcutEndpoint<'deleteCustomField'>;
	listDocs: ShortcutEndpoint<'listDocs'>;
	createDoc: ShortcutEndpoint<'createDoc'>;
	getDoc: ShortcutEndpoint<'getDoc'>;
	updateDoc: ShortcutEndpoint<'updateDoc'>;
	deleteDoc: ShortcutEndpoint<'deleteDoc'>;
	listDocumentEpics: ShortcutEndpoint<'listDocumentEpics'>;
	linkDocumentToEpic: ShortcutEndpoint<'linkDocumentToEpic'>;
	unlinkDocumentFromEpic: ShortcutEndpoint<'unlinkDocumentFromEpic'>;
	listEntityTemplates: ShortcutEndpoint<'listEntityTemplates'>;
	createEntityTemplate: ShortcutEndpoint<'createEntityTemplate'>;
	disableStoryTemplates: ShortcutEndpoint<'disableStoryTemplates'>;
	enableStoryTemplates: ShortcutEndpoint<'enableStoryTemplates'>;
	getEntityTemplate: ShortcutEndpoint<'getEntityTemplate'>;
	updateEntityTemplate: ShortcutEndpoint<'updateEntityTemplate'>;
	deleteEntityTemplate: ShortcutEndpoint<'deleteEntityTemplate'>;
	getEpicWorkflow: ShortcutEndpoint<'getEpicWorkflow'>;
	listEpics: ShortcutEndpoint<'listEpics'>;
	createEpic: ShortcutEndpoint<'createEpic'>;
	listEpicsPaginated: ShortcutEndpoint<'listEpicsPaginated'>;
	getEpic: ShortcutEndpoint<'getEpic'>;
	updateEpic: ShortcutEndpoint<'updateEpic'>;
	deleteEpic: ShortcutEndpoint<'deleteEpic'>;
	listEpicComments: ShortcutEndpoint<'listEpicComments'>;
	createEpicComment: ShortcutEndpoint<'createEpicComment'>;
	createEpicCommentComment: ShortcutEndpoint<'createEpicCommentComment'>;
	getEpicComment: ShortcutEndpoint<'getEpicComment'>;
	updateEpicComment: ShortcutEndpoint<'updateEpicComment'>;
	deleteEpicComment: ShortcutEndpoint<'deleteEpicComment'>;
	listEpicDocuments: ShortcutEndpoint<'listEpicDocuments'>;
	getEpicHealth: ShortcutEndpoint<'getEpicHealth'>;
	createEpicHealth: ShortcutEndpoint<'createEpicHealth'>;
	listEpicHealths: ShortcutEndpoint<'listEpicHealths'>;
	listEpicStories: ShortcutEndpoint<'listEpicStories'>;
	getExternalLinkStories: ShortcutEndpoint<'getExternalLinkStories'>;
	listFiles: ShortcutEndpoint<'listFiles'>;
	uploadFiles: ShortcutEndpoint<'uploadFiles'>;
	getFile: ShortcutEndpoint<'getFile'>;
	updateFile: ShortcutEndpoint<'updateFile'>;
	deleteFile: ShortcutEndpoint<'deleteFile'>;
	listGroups: ShortcutEndpoint<'listGroups'>;
	createGroup: ShortcutEndpoint<'createGroup'>;
	getGroup: ShortcutEndpoint<'getGroup'>;
	updateGroup: ShortcutEndpoint<'updateGroup'>;
	listGroupStories: ShortcutEndpoint<'listGroupStories'>;
	updateHealth: ShortcutEndpoint<'updateHealth'>;
	listIterations: ShortcutEndpoint<'listIterations'>;
	createIteration: ShortcutEndpoint<'createIteration'>;
	disableIterations: ShortcutEndpoint<'disableIterations'>;
	enableIterations: ShortcutEndpoint<'enableIterations'>;
	getIteration: ShortcutEndpoint<'getIteration'>;
	updateIteration: ShortcutEndpoint<'updateIteration'>;
	deleteIteration: ShortcutEndpoint<'deleteIteration'>;
	listIterationStories: ShortcutEndpoint<'listIterationStories'>;
	getKeyResult: ShortcutEndpoint<'getKeyResult'>;
	updateKeyResult: ShortcutEndpoint<'updateKeyResult'>;
	listLabels: ShortcutEndpoint<'listLabels'>;
	createLabel: ShortcutEndpoint<'createLabel'>;
	getLabel: ShortcutEndpoint<'getLabel'>;
	updateLabel: ShortcutEndpoint<'updateLabel'>;
	deleteLabel: ShortcutEndpoint<'deleteLabel'>;
	listLabelEpics: ShortcutEndpoint<'listLabelEpics'>;
	listLabelStories: ShortcutEndpoint<'listLabelStories'>;
	listLinkedFiles: ShortcutEndpoint<'listLinkedFiles'>;
	createLinkedFile: ShortcutEndpoint<'createLinkedFile'>;
	getLinkedFile: ShortcutEndpoint<'getLinkedFile'>;
	updateLinkedFile: ShortcutEndpoint<'updateLinkedFile'>;
	deleteLinkedFile: ShortcutEndpoint<'deleteLinkedFile'>;
	getCurrentMemberInfo: ShortcutEndpoint<'getCurrentMemberInfo'>;
	listMembers: ShortcutEndpoint<'listMembers'>;
	getMember: ShortcutEndpoint<'getMember'>;
	listMilestones: ShortcutEndpoint<'listMilestones'>;
	createMilestone: ShortcutEndpoint<'createMilestone'>;
	getMilestone: ShortcutEndpoint<'getMilestone'>;
	updateMilestone: ShortcutEndpoint<'updateMilestone'>;
	deleteMilestone: ShortcutEndpoint<'deleteMilestone'>;
	listMilestoneEpics: ShortcutEndpoint<'listMilestoneEpics'>;
	listObjectives: ShortcutEndpoint<'listObjectives'>;
	createObjective: ShortcutEndpoint<'createObjective'>;
	getObjective: ShortcutEndpoint<'getObjective'>;
	updateObjective: ShortcutEndpoint<'updateObjective'>;
	deleteObjective: ShortcutEndpoint<'deleteObjective'>;
	listObjectiveEpics: ShortcutEndpoint<'listObjectiveEpics'>;
	getObjectiveHealth: ShortcutEndpoint<'getObjectiveHealth'>;
	createObjectiveHealth: ShortcutEndpoint<'createObjectiveHealth'>;
	listObjectiveHealths: ShortcutEndpoint<'listObjectiveHealths'>;
	listProjects: ShortcutEndpoint<'listProjects'>;
	createProject: ShortcutEndpoint<'createProject'>;
	getProject: ShortcutEndpoint<'getProject'>;
	updateProject: ShortcutEndpoint<'updateProject'>;
	deleteProject: ShortcutEndpoint<'deleteProject'>;
	listStories: ShortcutEndpoint<'listStories'>;
	listRepositories: ShortcutEndpoint<'listRepositories'>;
	getRepository: ShortcutEndpoint<'getRepository'>;
	search: ShortcutEndpoint<'search'>;
	searchDocuments: ShortcutEndpoint<'searchDocuments'>;
	searchEpics: ShortcutEndpoint<'searchEpics'>;
	searchIterations: ShortcutEndpoint<'searchIterations'>;
	searchMilestones: ShortcutEndpoint<'searchMilestones'>;
	searchObjectives: ShortcutEndpoint<'searchObjectives'>;
	searchStories: ShortcutEndpoint<'searchStories'>;
	createStory: ShortcutEndpoint<'createStory'>;
	createMultipleStories: ShortcutEndpoint<'createMultipleStories'>;
	updateMultipleStories: ShortcutEndpoint<'updateMultipleStories'>;
	deleteMultipleStories: ShortcutEndpoint<'deleteMultipleStories'>;
	createStoryFromTemplate: ShortcutEndpoint<'createStoryFromTemplate'>;
	queryStories: ShortcutEndpoint<'queryStories'>;
	getStory: ShortcutEndpoint<'getStory'>;
	updateStory: ShortcutEndpoint<'updateStory'>;
	deleteStory: ShortcutEndpoint<'deleteStory'>;
	listStoryComment: ShortcutEndpoint<'listStoryComment'>;
	createStoryComment: ShortcutEndpoint<'createStoryComment'>;
	getStoryComment: ShortcutEndpoint<'getStoryComment'>;
	updateStoryComment: ShortcutEndpoint<'updateStoryComment'>;
	deleteStoryComment: ShortcutEndpoint<'deleteStoryComment'>;
	createStoryReaction: ShortcutEndpoint<'createStoryReaction'>;
	deleteStoryReaction: ShortcutEndpoint<'deleteStoryReaction'>;
	unlinkCommentThreadFromSlack: ShortcutEndpoint<'unlinkCommentThreadFromSlack'>;
	storyHistory: ShortcutEndpoint<'storyHistory'>;
	listStorySubTasks: ShortcutEndpoint<'listStorySubTasks'>;
	createTask: ShortcutEndpoint<'createTask'>;
	getTask: ShortcutEndpoint<'getTask'>;
	updateTask: ShortcutEndpoint<'updateTask'>;
	deleteTask: ShortcutEndpoint<'deleteTask'>;
	createStoryLink: ShortcutEndpoint<'createStoryLink'>;
	getStoryLink: ShortcutEndpoint<'getStoryLink'>;
	updateStoryLink: ShortcutEndpoint<'updateStoryLink'>;
	deleteStoryLink: ShortcutEndpoint<'deleteStoryLink'>;
	listWorkflows: ShortcutEndpoint<'listWorkflows'>;
	getWorkflow: ShortcutEndpoint<'getWorkflow'>;
};
export const shortcutEndpointSchemas = {
	'listCategories.get': {
		input: ShortcutEndpointInputSchemas['listCategories'],
		output: ShortcutEndpointOutputSchemas['listCategories'],
	},
	'createCategory.post': {
		input: ShortcutEndpointInputSchemas['createCategory'],
		output: ShortcutEndpointOutputSchemas['createCategory'],
	},
	'getCategory.get': {
		input: ShortcutEndpointInputSchemas['getCategory'],
		output: ShortcutEndpointOutputSchemas['getCategory'],
	},
	'updateCategory.put': {
		input: ShortcutEndpointInputSchemas['updateCategory'],
		output: ShortcutEndpointOutputSchemas['updateCategory'],
	},
	'deleteCategory.delete': {
		input: ShortcutEndpointInputSchemas['deleteCategory'],
		output: ShortcutEndpointOutputSchemas['deleteCategory'],
	},
	'listCategoryMilestones.get': {
		input: ShortcutEndpointInputSchemas['listCategoryMilestones'],
		output: ShortcutEndpointOutputSchemas['listCategoryMilestones'],
	},
	'listCategoryObjectives.get': {
		input: ShortcutEndpointInputSchemas['listCategoryObjectives'],
		output: ShortcutEndpointOutputSchemas['listCategoryObjectives'],
	},
	'listCustomFields.get': {
		input: ShortcutEndpointInputSchemas['listCustomFields'],
		output: ShortcutEndpointOutputSchemas['listCustomFields'],
	},
	'getCustomField.get': {
		input: ShortcutEndpointInputSchemas['getCustomField'],
		output: ShortcutEndpointOutputSchemas['getCustomField'],
	},
	'updateCustomField.put': {
		input: ShortcutEndpointInputSchemas['updateCustomField'],
		output: ShortcutEndpointOutputSchemas['updateCustomField'],
	},
	'deleteCustomField.delete': {
		input: ShortcutEndpointInputSchemas['deleteCustomField'],
		output: ShortcutEndpointOutputSchemas['deleteCustomField'],
	},
	'listDocs.get': {
		input: ShortcutEndpointInputSchemas['listDocs'],
		output: ShortcutEndpointOutputSchemas['listDocs'],
	},
	'createDoc.post': {
		input: ShortcutEndpointInputSchemas['createDoc'],
		output: ShortcutEndpointOutputSchemas['createDoc'],
	},
	'getDoc.get': {
		input: ShortcutEndpointInputSchemas['getDoc'],
		output: ShortcutEndpointOutputSchemas['getDoc'],
	},
	'updateDoc.put': {
		input: ShortcutEndpointInputSchemas['updateDoc'],
		output: ShortcutEndpointOutputSchemas['updateDoc'],
	},
	'deleteDoc.delete': {
		input: ShortcutEndpointInputSchemas['deleteDoc'],
		output: ShortcutEndpointOutputSchemas['deleteDoc'],
	},
	'listDocumentEpics.get': {
		input: ShortcutEndpointInputSchemas['listDocumentEpics'],
		output: ShortcutEndpointOutputSchemas['listDocumentEpics'],
	},
	'linkDocumentToEpic.put': {
		input: ShortcutEndpointInputSchemas['linkDocumentToEpic'],
		output: ShortcutEndpointOutputSchemas['linkDocumentToEpic'],
	},
	'unlinkDocumentFromEpic.delete': {
		input: ShortcutEndpointInputSchemas['unlinkDocumentFromEpic'],
		output: ShortcutEndpointOutputSchemas['unlinkDocumentFromEpic'],
	},
	'listEntityTemplates.get': {
		input: ShortcutEndpointInputSchemas['listEntityTemplates'],
		output: ShortcutEndpointOutputSchemas['listEntityTemplates'],
	},
	'createEntityTemplate.post': {
		input: ShortcutEndpointInputSchemas['createEntityTemplate'],
		output: ShortcutEndpointOutputSchemas['createEntityTemplate'],
	},
	'disableStoryTemplates.put': {
		input: ShortcutEndpointInputSchemas['disableStoryTemplates'],
		output: ShortcutEndpointOutputSchemas['disableStoryTemplates'],
	},
	'enableStoryTemplates.put': {
		input: ShortcutEndpointInputSchemas['enableStoryTemplates'],
		output: ShortcutEndpointOutputSchemas['enableStoryTemplates'],
	},
	'getEntityTemplate.get': {
		input: ShortcutEndpointInputSchemas['getEntityTemplate'],
		output: ShortcutEndpointOutputSchemas['getEntityTemplate'],
	},
	'updateEntityTemplate.put': {
		input: ShortcutEndpointInputSchemas['updateEntityTemplate'],
		output: ShortcutEndpointOutputSchemas['updateEntityTemplate'],
	},
	'deleteEntityTemplate.delete': {
		input: ShortcutEndpointInputSchemas['deleteEntityTemplate'],
		output: ShortcutEndpointOutputSchemas['deleteEntityTemplate'],
	},
	'getEpicWorkflow.get': {
		input: ShortcutEndpointInputSchemas['getEpicWorkflow'],
		output: ShortcutEndpointOutputSchemas['getEpicWorkflow'],
	},
	'listEpics.get': {
		input: ShortcutEndpointInputSchemas['listEpics'],
		output: ShortcutEndpointOutputSchemas['listEpics'],
	},
	'createEpic.post': {
		input: ShortcutEndpointInputSchemas['createEpic'],
		output: ShortcutEndpointOutputSchemas['createEpic'],
	},
	'listEpicsPaginated.get': {
		input: ShortcutEndpointInputSchemas['listEpicsPaginated'],
		output: ShortcutEndpointOutputSchemas['listEpicsPaginated'],
	},
	'getEpic.get': {
		input: ShortcutEndpointInputSchemas['getEpic'],
		output: ShortcutEndpointOutputSchemas['getEpic'],
	},
	'updateEpic.put': {
		input: ShortcutEndpointInputSchemas['updateEpic'],
		output: ShortcutEndpointOutputSchemas['updateEpic'],
	},
	'deleteEpic.delete': {
		input: ShortcutEndpointInputSchemas['deleteEpic'],
		output: ShortcutEndpointOutputSchemas['deleteEpic'],
	},
	'listEpicComments.get': {
		input: ShortcutEndpointInputSchemas['listEpicComments'],
		output: ShortcutEndpointOutputSchemas['listEpicComments'],
	},
	'createEpicComment.post': {
		input: ShortcutEndpointInputSchemas['createEpicComment'],
		output: ShortcutEndpointOutputSchemas['createEpicComment'],
	},
	'createEpicCommentComment.post': {
		input: ShortcutEndpointInputSchemas['createEpicCommentComment'],
		output: ShortcutEndpointOutputSchemas['createEpicCommentComment'],
	},
	'getEpicComment.get': {
		input: ShortcutEndpointInputSchemas['getEpicComment'],
		output: ShortcutEndpointOutputSchemas['getEpicComment'],
	},
	'updateEpicComment.put': {
		input: ShortcutEndpointInputSchemas['updateEpicComment'],
		output: ShortcutEndpointOutputSchemas['updateEpicComment'],
	},
	'deleteEpicComment.delete': {
		input: ShortcutEndpointInputSchemas['deleteEpicComment'],
		output: ShortcutEndpointOutputSchemas['deleteEpicComment'],
	},
	'listEpicDocuments.get': {
		input: ShortcutEndpointInputSchemas['listEpicDocuments'],
		output: ShortcutEndpointOutputSchemas['listEpicDocuments'],
	},
	'getEpicHealth.get': {
		input: ShortcutEndpointInputSchemas['getEpicHealth'],
		output: ShortcutEndpointOutputSchemas['getEpicHealth'],
	},
	'createEpicHealth.post': {
		input: ShortcutEndpointInputSchemas['createEpicHealth'],
		output: ShortcutEndpointOutputSchemas['createEpicHealth'],
	},
	'listEpicHealths.get': {
		input: ShortcutEndpointInputSchemas['listEpicHealths'],
		output: ShortcutEndpointOutputSchemas['listEpicHealths'],
	},
	'listEpicStories.get': {
		input: ShortcutEndpointInputSchemas['listEpicStories'],
		output: ShortcutEndpointOutputSchemas['listEpicStories'],
	},
	'getExternalLinkStories.get': {
		input: ShortcutEndpointInputSchemas['getExternalLinkStories'],
		output: ShortcutEndpointOutputSchemas['getExternalLinkStories'],
	},
	'listFiles.get': {
		input: ShortcutEndpointInputSchemas['listFiles'],
		output: ShortcutEndpointOutputSchemas['listFiles'],
	},
	'uploadFiles.post': {
		input: ShortcutEndpointInputSchemas['uploadFiles'],
		output: ShortcutEndpointOutputSchemas['uploadFiles'],
	},
	'getFile.get': {
		input: ShortcutEndpointInputSchemas['getFile'],
		output: ShortcutEndpointOutputSchemas['getFile'],
	},
	'updateFile.put': {
		input: ShortcutEndpointInputSchemas['updateFile'],
		output: ShortcutEndpointOutputSchemas['updateFile'],
	},
	'deleteFile.delete': {
		input: ShortcutEndpointInputSchemas['deleteFile'],
		output: ShortcutEndpointOutputSchemas['deleteFile'],
	},
	'listGroups.get': {
		input: ShortcutEndpointInputSchemas['listGroups'],
		output: ShortcutEndpointOutputSchemas['listGroups'],
	},
	'createGroup.post': {
		input: ShortcutEndpointInputSchemas['createGroup'],
		output: ShortcutEndpointOutputSchemas['createGroup'],
	},
	'getGroup.get': {
		input: ShortcutEndpointInputSchemas['getGroup'],
		output: ShortcutEndpointOutputSchemas['getGroup'],
	},
	'updateGroup.put': {
		input: ShortcutEndpointInputSchemas['updateGroup'],
		output: ShortcutEndpointOutputSchemas['updateGroup'],
	},
	'listGroupStories.get': {
		input: ShortcutEndpointInputSchemas['listGroupStories'],
		output: ShortcutEndpointOutputSchemas['listGroupStories'],
	},
	'updateHealth.put': {
		input: ShortcutEndpointInputSchemas['updateHealth'],
		output: ShortcutEndpointOutputSchemas['updateHealth'],
	},
	'listIterations.get': {
		input: ShortcutEndpointInputSchemas['listIterations'],
		output: ShortcutEndpointOutputSchemas['listIterations'],
	},
	'createIteration.post': {
		input: ShortcutEndpointInputSchemas['createIteration'],
		output: ShortcutEndpointOutputSchemas['createIteration'],
	},
	'disableIterations.put': {
		input: ShortcutEndpointInputSchemas['disableIterations'],
		output: ShortcutEndpointOutputSchemas['disableIterations'],
	},
	'enableIterations.put': {
		input: ShortcutEndpointInputSchemas['enableIterations'],
		output: ShortcutEndpointOutputSchemas['enableIterations'],
	},
	'getIteration.get': {
		input: ShortcutEndpointInputSchemas['getIteration'],
		output: ShortcutEndpointOutputSchemas['getIteration'],
	},
	'updateIteration.put': {
		input: ShortcutEndpointInputSchemas['updateIteration'],
		output: ShortcutEndpointOutputSchemas['updateIteration'],
	},
	'deleteIteration.delete': {
		input: ShortcutEndpointInputSchemas['deleteIteration'],
		output: ShortcutEndpointOutputSchemas['deleteIteration'],
	},
	'listIterationStories.get': {
		input: ShortcutEndpointInputSchemas['listIterationStories'],
		output: ShortcutEndpointOutputSchemas['listIterationStories'],
	},
	'getKeyResult.get': {
		input: ShortcutEndpointInputSchemas['getKeyResult'],
		output: ShortcutEndpointOutputSchemas['getKeyResult'],
	},
	'updateKeyResult.put': {
		input: ShortcutEndpointInputSchemas['updateKeyResult'],
		output: ShortcutEndpointOutputSchemas['updateKeyResult'],
	},
	'listLabels.get': {
		input: ShortcutEndpointInputSchemas['listLabels'],
		output: ShortcutEndpointOutputSchemas['listLabels'],
	},
	'createLabel.post': {
		input: ShortcutEndpointInputSchemas['createLabel'],
		output: ShortcutEndpointOutputSchemas['createLabel'],
	},
	'getLabel.get': {
		input: ShortcutEndpointInputSchemas['getLabel'],
		output: ShortcutEndpointOutputSchemas['getLabel'],
	},
	'updateLabel.put': {
		input: ShortcutEndpointInputSchemas['updateLabel'],
		output: ShortcutEndpointOutputSchemas['updateLabel'],
	},
	'deleteLabel.delete': {
		input: ShortcutEndpointInputSchemas['deleteLabel'],
		output: ShortcutEndpointOutputSchemas['deleteLabel'],
	},
	'listLabelEpics.get': {
		input: ShortcutEndpointInputSchemas['listLabelEpics'],
		output: ShortcutEndpointOutputSchemas['listLabelEpics'],
	},
	'listLabelStories.get': {
		input: ShortcutEndpointInputSchemas['listLabelStories'],
		output: ShortcutEndpointOutputSchemas['listLabelStories'],
	},
	'listLinkedFiles.get': {
		input: ShortcutEndpointInputSchemas['listLinkedFiles'],
		output: ShortcutEndpointOutputSchemas['listLinkedFiles'],
	},
	'createLinkedFile.post': {
		input: ShortcutEndpointInputSchemas['createLinkedFile'],
		output: ShortcutEndpointOutputSchemas['createLinkedFile'],
	},
	'getLinkedFile.get': {
		input: ShortcutEndpointInputSchemas['getLinkedFile'],
		output: ShortcutEndpointOutputSchemas['getLinkedFile'],
	},
	'updateLinkedFile.put': {
		input: ShortcutEndpointInputSchemas['updateLinkedFile'],
		output: ShortcutEndpointOutputSchemas['updateLinkedFile'],
	},
	'deleteLinkedFile.delete': {
		input: ShortcutEndpointInputSchemas['deleteLinkedFile'],
		output: ShortcutEndpointOutputSchemas['deleteLinkedFile'],
	},
	'getCurrentMemberInfo.get': {
		input: ShortcutEndpointInputSchemas['getCurrentMemberInfo'],
		output: ShortcutEndpointOutputSchemas['getCurrentMemberInfo'],
	},
	'listMembers.get': {
		input: ShortcutEndpointInputSchemas['listMembers'],
		output: ShortcutEndpointOutputSchemas['listMembers'],
	},
	'getMember.get': {
		input: ShortcutEndpointInputSchemas['getMember'],
		output: ShortcutEndpointOutputSchemas['getMember'],
	},
	'listMilestones.get': {
		input: ShortcutEndpointInputSchemas['listMilestones'],
		output: ShortcutEndpointOutputSchemas['listMilestones'],
	},
	'createMilestone.post': {
		input: ShortcutEndpointInputSchemas['createMilestone'],
		output: ShortcutEndpointOutputSchemas['createMilestone'],
	},
	'getMilestone.get': {
		input: ShortcutEndpointInputSchemas['getMilestone'],
		output: ShortcutEndpointOutputSchemas['getMilestone'],
	},
	'updateMilestone.put': {
		input: ShortcutEndpointInputSchemas['updateMilestone'],
		output: ShortcutEndpointOutputSchemas['updateMilestone'],
	},
	'deleteMilestone.delete': {
		input: ShortcutEndpointInputSchemas['deleteMilestone'],
		output: ShortcutEndpointOutputSchemas['deleteMilestone'],
	},
	'listMilestoneEpics.get': {
		input: ShortcutEndpointInputSchemas['listMilestoneEpics'],
		output: ShortcutEndpointOutputSchemas['listMilestoneEpics'],
	},
	'listObjectives.get': {
		input: ShortcutEndpointInputSchemas['listObjectives'],
		output: ShortcutEndpointOutputSchemas['listObjectives'],
	},
	'createObjective.post': {
		input: ShortcutEndpointInputSchemas['createObjective'],
		output: ShortcutEndpointOutputSchemas['createObjective'],
	},
	'getObjective.get': {
		input: ShortcutEndpointInputSchemas['getObjective'],
		output: ShortcutEndpointOutputSchemas['getObjective'],
	},
	'updateObjective.put': {
		input: ShortcutEndpointInputSchemas['updateObjective'],
		output: ShortcutEndpointOutputSchemas['updateObjective'],
	},
	'deleteObjective.delete': {
		input: ShortcutEndpointInputSchemas['deleteObjective'],
		output: ShortcutEndpointOutputSchemas['deleteObjective'],
	},
	'listObjectiveEpics.get': {
		input: ShortcutEndpointInputSchemas['listObjectiveEpics'],
		output: ShortcutEndpointOutputSchemas['listObjectiveEpics'],
	},
	'getObjectiveHealth.get': {
		input: ShortcutEndpointInputSchemas['getObjectiveHealth'],
		output: ShortcutEndpointOutputSchemas['getObjectiveHealth'],
	},
	'createObjectiveHealth.post': {
		input: ShortcutEndpointInputSchemas['createObjectiveHealth'],
		output: ShortcutEndpointOutputSchemas['createObjectiveHealth'],
	},
	'listObjectiveHealths.get': {
		input: ShortcutEndpointInputSchemas['listObjectiveHealths'],
		output: ShortcutEndpointOutputSchemas['listObjectiveHealths'],
	},
	'listProjects.get': {
		input: ShortcutEndpointInputSchemas['listProjects'],
		output: ShortcutEndpointOutputSchemas['listProjects'],
	},
	'createProject.post': {
		input: ShortcutEndpointInputSchemas['createProject'],
		output: ShortcutEndpointOutputSchemas['createProject'],
	},
	'getProject.get': {
		input: ShortcutEndpointInputSchemas['getProject'],
		output: ShortcutEndpointOutputSchemas['getProject'],
	},
	'updateProject.put': {
		input: ShortcutEndpointInputSchemas['updateProject'],
		output: ShortcutEndpointOutputSchemas['updateProject'],
	},
	'deleteProject.delete': {
		input: ShortcutEndpointInputSchemas['deleteProject'],
		output: ShortcutEndpointOutputSchemas['deleteProject'],
	},
	'listStories.get': {
		input: ShortcutEndpointInputSchemas['listStories'],
		output: ShortcutEndpointOutputSchemas['listStories'],
	},
	'listRepositories.get': {
		input: ShortcutEndpointInputSchemas['listRepositories'],
		output: ShortcutEndpointOutputSchemas['listRepositories'],
	},
	'getRepository.get': {
		input: ShortcutEndpointInputSchemas['getRepository'],
		output: ShortcutEndpointOutputSchemas['getRepository'],
	},
	'search.get': {
		input: ShortcutEndpointInputSchemas['search'],
		output: ShortcutEndpointOutputSchemas['search'],
	},
	'searchDocuments.get': {
		input: ShortcutEndpointInputSchemas['searchDocuments'],
		output: ShortcutEndpointOutputSchemas['searchDocuments'],
	},
	'searchEpics.get': {
		input: ShortcutEndpointInputSchemas['searchEpics'],
		output: ShortcutEndpointOutputSchemas['searchEpics'],
	},
	'searchIterations.get': {
		input: ShortcutEndpointInputSchemas['searchIterations'],
		output: ShortcutEndpointOutputSchemas['searchIterations'],
	},
	'searchMilestones.get': {
		input: ShortcutEndpointInputSchemas['searchMilestones'],
		output: ShortcutEndpointOutputSchemas['searchMilestones'],
	},
	'searchObjectives.get': {
		input: ShortcutEndpointInputSchemas['searchObjectives'],
		output: ShortcutEndpointOutputSchemas['searchObjectives'],
	},
	'searchStories.get': {
		input: ShortcutEndpointInputSchemas['searchStories'],
		output: ShortcutEndpointOutputSchemas['searchStories'],
	},
	'createStory.post': {
		input: ShortcutEndpointInputSchemas['createStory'],
		output: ShortcutEndpointOutputSchemas['createStory'],
	},
	'createMultipleStories.post': {
		input: ShortcutEndpointInputSchemas['createMultipleStories'],
		output: ShortcutEndpointOutputSchemas['createMultipleStories'],
	},
	'updateMultipleStories.put': {
		input: ShortcutEndpointInputSchemas['updateMultipleStories'],
		output: ShortcutEndpointOutputSchemas['updateMultipleStories'],
	},
	'deleteMultipleStories.delete': {
		input: ShortcutEndpointInputSchemas['deleteMultipleStories'],
		output: ShortcutEndpointOutputSchemas['deleteMultipleStories'],
	},
	'createStoryFromTemplate.post': {
		input: ShortcutEndpointInputSchemas['createStoryFromTemplate'],
		output: ShortcutEndpointOutputSchemas['createStoryFromTemplate'],
	},
	'queryStories.post': {
		input: ShortcutEndpointInputSchemas['queryStories'],
		output: ShortcutEndpointOutputSchemas['queryStories'],
	},
	'getStory.get': {
		input: ShortcutEndpointInputSchemas['getStory'],
		output: ShortcutEndpointOutputSchemas['getStory'],
	},
	'updateStory.put': {
		input: ShortcutEndpointInputSchemas['updateStory'],
		output: ShortcutEndpointOutputSchemas['updateStory'],
	},
	'deleteStory.delete': {
		input: ShortcutEndpointInputSchemas['deleteStory'],
		output: ShortcutEndpointOutputSchemas['deleteStory'],
	},
	'listStoryComment.get': {
		input: ShortcutEndpointInputSchemas['listStoryComment'],
		output: ShortcutEndpointOutputSchemas['listStoryComment'],
	},
	'createStoryComment.post': {
		input: ShortcutEndpointInputSchemas['createStoryComment'],
		output: ShortcutEndpointOutputSchemas['createStoryComment'],
	},
	'getStoryComment.get': {
		input: ShortcutEndpointInputSchemas['getStoryComment'],
		output: ShortcutEndpointOutputSchemas['getStoryComment'],
	},
	'updateStoryComment.put': {
		input: ShortcutEndpointInputSchemas['updateStoryComment'],
		output: ShortcutEndpointOutputSchemas['updateStoryComment'],
	},
	'deleteStoryComment.delete': {
		input: ShortcutEndpointInputSchemas['deleteStoryComment'],
		output: ShortcutEndpointOutputSchemas['deleteStoryComment'],
	},
	'createStoryReaction.post': {
		input: ShortcutEndpointInputSchemas['createStoryReaction'],
		output: ShortcutEndpointOutputSchemas['createStoryReaction'],
	},
	'deleteStoryReaction.delete': {
		input: ShortcutEndpointInputSchemas['deleteStoryReaction'],
		output: ShortcutEndpointOutputSchemas['deleteStoryReaction'],
	},
	'unlinkCommentThreadFromSlack.post': {
		input: ShortcutEndpointInputSchemas['unlinkCommentThreadFromSlack'],
		output: ShortcutEndpointOutputSchemas['unlinkCommentThreadFromSlack'],
	},
	'storyHistory.get': {
		input: ShortcutEndpointInputSchemas['storyHistory'],
		output: ShortcutEndpointOutputSchemas['storyHistory'],
	},
	'listStorySubTasks.get': {
		input: ShortcutEndpointInputSchemas['listStorySubTasks'],
		output: ShortcutEndpointOutputSchemas['listStorySubTasks'],
	},
	'createTask.post': {
		input: ShortcutEndpointInputSchemas['createTask'],
		output: ShortcutEndpointOutputSchemas['createTask'],
	},
	'getTask.get': {
		input: ShortcutEndpointInputSchemas['getTask'],
		output: ShortcutEndpointOutputSchemas['getTask'],
	},
	'updateTask.put': {
		input: ShortcutEndpointInputSchemas['updateTask'],
		output: ShortcutEndpointOutputSchemas['updateTask'],
	},
	'deleteTask.delete': {
		input: ShortcutEndpointInputSchemas['deleteTask'],
		output: ShortcutEndpointOutputSchemas['deleteTask'],
	},
	'createStoryLink.post': {
		input: ShortcutEndpointInputSchemas['createStoryLink'],
		output: ShortcutEndpointOutputSchemas['createStoryLink'],
	},
	'getStoryLink.get': {
		input: ShortcutEndpointInputSchemas['getStoryLink'],
		output: ShortcutEndpointOutputSchemas['getStoryLink'],
	},
	'updateStoryLink.put': {
		input: ShortcutEndpointInputSchemas['updateStoryLink'],
		output: ShortcutEndpointOutputSchemas['updateStoryLink'],
	},
	'deleteStoryLink.delete': {
		input: ShortcutEndpointInputSchemas['deleteStoryLink'],
		output: ShortcutEndpointOutputSchemas['deleteStoryLink'],
	},
	'listWorkflows.get': {
		input: ShortcutEndpointInputSchemas['listWorkflows'],
		output: ShortcutEndpointOutputSchemas['listWorkflows'],
	},
	'getWorkflow.get': {
		input: ShortcutEndpointInputSchemas['getWorkflow'],
		output: ShortcutEndpointOutputSchemas['getWorkflow'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ShortcutEndpointsNested
>;
const shortcutEndpointMeta = {
	'listCategories.get': { riskLevel: 'read', description: 'List Categories' },
	'createCategory.post': { riskLevel: 'write', description: 'Create Category' },
	'getCategory.get': { riskLevel: 'read', description: 'Get Category' },
	'updateCategory.put': { riskLevel: 'write', description: 'Update Category' },
	'deleteCategory.delete': {
		riskLevel: 'destructive',
		description: 'Delete Category',
	},
	'listCategoryMilestones.get': {
		riskLevel: 'read',
		description: 'List Category Milestones',
	},
	'listCategoryObjectives.get': {
		riskLevel: 'read',
		description: 'List Category Objectives',
	},
	'listCustomFields.get': {
		riskLevel: 'read',
		description: 'List Custom Fields',
	},
	'getCustomField.get': { riskLevel: 'read', description: 'Get Custom Field' },
	'updateCustomField.put': {
		riskLevel: 'write',
		description: 'Update Custom Field',
	},
	'deleteCustomField.delete': {
		riskLevel: 'destructive',
		description: 'Delete Custom Field',
	},
	'listDocs.get': { riskLevel: 'read', description: 'List Docs' },
	'createDoc.post': { riskLevel: 'write', description: 'Create Doc' },
	'getDoc.get': { riskLevel: 'read', description: 'Get Doc' },
	'updateDoc.put': { riskLevel: 'write', description: 'Update Doc' },
	'deleteDoc.delete': { riskLevel: 'destructive', description: 'Delete Doc' },
	'listDocumentEpics.get': {
		riskLevel: 'read',
		description: 'List Document Epics',
	},
	'linkDocumentToEpic.put': {
		riskLevel: 'write',
		description: 'Link Document to Epic',
	},
	'unlinkDocumentFromEpic.delete': {
		riskLevel: 'destructive',
		description: 'Unlink Document from Epic',
	},
	'listEntityTemplates.get': {
		riskLevel: 'read',
		description: 'List Entity Templates',
	},
	'createEntityTemplate.post': {
		riskLevel: 'write',
		description: 'Create Entity Template',
	},
	'disableStoryTemplates.put': {
		riskLevel: 'write',
		description: 'Disable Story Templates',
	},
	'enableStoryTemplates.put': {
		riskLevel: 'write',
		description: 'Enable Story Templates',
	},
	'getEntityTemplate.get': {
		riskLevel: 'read',
		description: 'Get Entity Template',
	},
	'updateEntityTemplate.put': {
		riskLevel: 'write',
		description: 'Update Entity Template',
	},
	'deleteEntityTemplate.delete': {
		riskLevel: 'destructive',
		description: 'Delete Entity Template',
	},
	'getEpicWorkflow.get': {
		riskLevel: 'read',
		description: 'Get Epic Workflow',
	},
	'listEpics.get': { riskLevel: 'read', description: 'List Epics' },
	'createEpic.post': { riskLevel: 'write', description: 'Create Epic' },
	'listEpicsPaginated.get': {
		riskLevel: 'read',
		description: 'List Epics Paginated',
	},
	'getEpic.get': { riskLevel: 'read', description: 'Get Epic' },
	'updateEpic.put': { riskLevel: 'write', description: 'Update Epic' },
	'deleteEpic.delete': { riskLevel: 'destructive', description: 'Delete Epic' },
	'listEpicComments.get': {
		riskLevel: 'read',
		description: 'List Epic Comments',
	},
	'createEpicComment.post': {
		riskLevel: 'destructive',
		description: 'Create Epic Comment',
	},
	'createEpicCommentComment.post': {
		riskLevel: 'destructive',
		description: 'Create Epic Comment Comment',
	},
	'getEpicComment.get': { riskLevel: 'read', description: 'Get Epic Comment' },
	'updateEpicComment.put': {
		riskLevel: 'write',
		description: 'Update Epic Comment',
	},
	'deleteEpicComment.delete': {
		riskLevel: 'destructive',
		description: 'Delete Epic Comment',
	},
	'listEpicDocuments.get': {
		riskLevel: 'read',
		description: 'List Epic Documents',
	},
	'getEpicHealth.get': { riskLevel: 'read', description: 'Get Epic Health' },
	'createEpicHealth.post': {
		riskLevel: 'write',
		description: 'Create Epic Health',
	},
	'listEpicHealths.get': {
		riskLevel: 'read',
		description: 'List Epic Healths',
	},
	'listEpicStories.get': {
		riskLevel: 'read',
		description: 'List Epic Stories',
	},
	'getExternalLinkStories.get': {
		riskLevel: 'read',
		description: 'Get External Link Stories',
	},
	'listFiles.get': { riskLevel: 'read', description: 'List Files' },
	'uploadFiles.post': { riskLevel: 'write', description: 'Upload Files' },
	'getFile.get': { riskLevel: 'read', description: 'Get File' },
	'updateFile.put': { riskLevel: 'write', description: 'Update File' },
	'deleteFile.delete': { riskLevel: 'destructive', description: 'Delete File' },
	'listGroups.get': { riskLevel: 'read', description: 'List Groups' },
	'createGroup.post': { riskLevel: 'write', description: 'Create Group' },
	'getGroup.get': { riskLevel: 'read', description: 'Get Group' },
	'updateGroup.put': { riskLevel: 'write', description: 'Update Group' },
	'listGroupStories.get': {
		riskLevel: 'read',
		description: 'List Group Stories',
	},
	'updateHealth.put': { riskLevel: 'write', description: 'Update Health' },
	'listIterations.get': { riskLevel: 'read', description: 'List Iterations' },
	'createIteration.post': {
		riskLevel: 'write',
		description: 'Create Iteration',
	},
	'disableIterations.put': {
		riskLevel: 'write',
		description: 'Disable Iterations',
	},
	'enableIterations.put': {
		riskLevel: 'write',
		description: 'Enable Iterations',
	},
	'getIteration.get': { riskLevel: 'read', description: 'Get Iteration' },
	'updateIteration.put': {
		riskLevel: 'write',
		description: 'Update Iteration',
	},
	'deleteIteration.delete': {
		riskLevel: 'destructive',
		description: 'Delete Iteration',
	},
	'listIterationStories.get': {
		riskLevel: 'read',
		description: 'List Iteration Stories',
	},
	'getKeyResult.get': { riskLevel: 'read', description: 'Get Key Result' },
	'updateKeyResult.put': {
		riskLevel: 'write',
		description: 'Update Key Result',
	},
	'listLabels.get': { riskLevel: 'read', description: 'List Labels' },
	'createLabel.post': { riskLevel: 'write', description: 'Create Label' },
	'getLabel.get': { riskLevel: 'read', description: 'Get Label' },
	'updateLabel.put': { riskLevel: 'write', description: 'Update Label' },
	'deleteLabel.delete': {
		riskLevel: 'destructive',
		description: 'Delete Label',
	},
	'listLabelEpics.get': { riskLevel: 'read', description: 'List Label Epics' },
	'listLabelStories.get': {
		riskLevel: 'read',
		description: 'List Label Stories',
	},
	'listLinkedFiles.get': {
		riskLevel: 'read',
		description: 'List Linked Files',
	},
	'createLinkedFile.post': {
		riskLevel: 'write',
		description: 'Create Linked File',
	},
	'getLinkedFile.get': { riskLevel: 'read', description: 'Get Linked File' },
	'updateLinkedFile.put': {
		riskLevel: 'write',
		description: 'Update Linked File',
	},
	'deleteLinkedFile.delete': {
		riskLevel: 'destructive',
		description: 'Delete Linked File',
	},
	'getCurrentMemberInfo.get': {
		riskLevel: 'read',
		description: 'Get Current Member Info',
	},
	'listMembers.get': { riskLevel: 'read', description: 'List Members' },
	'getMember.get': { riskLevel: 'read', description: 'Get Member' },
	'listMilestones.get': { riskLevel: 'read', description: 'List Milestones' },
	'createMilestone.post': {
		riskLevel: 'write',
		description: 'Create Milestone',
	},
	'getMilestone.get': { riskLevel: 'read', description: 'Get Milestone' },
	'updateMilestone.put': {
		riskLevel: 'write',
		description: 'Update Milestone',
	},
	'deleteMilestone.delete': {
		riskLevel: 'destructive',
		description: 'Delete Milestone',
	},
	'listMilestoneEpics.get': {
		riskLevel: 'read',
		description: 'List Milestone Epics',
	},
	'listObjectives.get': { riskLevel: 'read', description: 'List Objectives' },
	'createObjective.post': {
		riskLevel: 'write',
		description: 'Create Objective',
	},
	'getObjective.get': { riskLevel: 'read', description: 'Get Objective' },
	'updateObjective.put': {
		riskLevel: 'write',
		description: 'Update Objective',
	},
	'deleteObjective.delete': {
		riskLevel: 'destructive',
		description: 'Delete Objective',
	},
	'listObjectiveEpics.get': {
		riskLevel: 'read',
		description: 'List Objective Epics',
	},
	'getObjectiveHealth.get': {
		riskLevel: 'read',
		description: 'Get Objective Health',
	},
	'createObjectiveHealth.post': {
		riskLevel: 'write',
		description: 'Create Objective Health',
	},
	'listObjectiveHealths.get': {
		riskLevel: 'read',
		description: 'List Objective Healths',
	},
	'listProjects.get': { riskLevel: 'read', description: 'List Projects' },
	'createProject.post': { riskLevel: 'write', description: 'Create Project' },
	'getProject.get': { riskLevel: 'read', description: 'Get Project' },
	'updateProject.put': { riskLevel: 'write', description: 'Update Project' },
	'deleteProject.delete': {
		riskLevel: 'destructive',
		description: 'Delete Project',
	},
	'listStories.get': { riskLevel: 'read', description: 'List Stories' },
	'listRepositories.get': {
		riskLevel: 'read',
		description: 'List Repositories',
	},
	'getRepository.get': { riskLevel: 'read', description: 'Get Repository' },
	'search.get': { riskLevel: 'read', description: 'Search' },
	'searchDocuments.get': { riskLevel: 'read', description: 'Search Documents' },
	'searchEpics.get': { riskLevel: 'read', description: 'Search Epics' },
	'searchIterations.get': {
		riskLevel: 'read',
		description: 'Search Iterations',
	},
	'searchMilestones.get': {
		riskLevel: 'read',
		description: 'Search Milestones',
	},
	'searchObjectives.get': {
		riskLevel: 'read',
		description: 'Search Objectives',
	},
	'searchStories.get': { riskLevel: 'read', description: 'Search Stories' },
	'createStory.post': { riskLevel: 'write', description: 'Create Story' },
	'createMultipleStories.post': {
		riskLevel: 'write',
		description: 'Create Multiple Stories',
	},
	'updateMultipleStories.put': {
		riskLevel: 'write',
		description: 'Update Multiple Stories',
	},
	'deleteMultipleStories.delete': {
		riskLevel: 'destructive',
		description: 'Delete Multiple Stories',
	},
	'createStoryFromTemplate.post': {
		riskLevel: 'write',
		description: 'Create Story From Template',
	},
	'queryStories.post': { riskLevel: 'read', description: 'Query Stories' },
	'getStory.get': { riskLevel: 'read', description: 'Get Story' },
	'updateStory.put': { riskLevel: 'write', description: 'Update Story' },
	'deleteStory.delete': {
		riskLevel: 'destructive',
		description: 'Delete Story',
	},
	'listStoryComment.get': {
		riskLevel: 'read',
		description: 'List Story Comment',
	},
	'createStoryComment.post': {
		riskLevel: 'destructive',
		description: 'Create Story Comment',
	},
	'getStoryComment.get': {
		riskLevel: 'read',
		description: 'Get Story Comment',
	},
	'updateStoryComment.put': {
		riskLevel: 'write',
		description: 'Update Story Comment',
	},
	'deleteStoryComment.delete': {
		riskLevel: 'destructive',
		description: 'Delete Story Comment',
	},
	'createStoryReaction.post': {
		riskLevel: 'write',
		description: 'Create Story Reaction',
	},
	'deleteStoryReaction.delete': {
		riskLevel: 'destructive',
		description: 'Delete Story Reaction',
	},
	'unlinkCommentThreadFromSlack.post': {
		riskLevel: 'write',
		description: 'Unlink Comment thread from Slack',
	},
	'storyHistory.get': { riskLevel: 'read', description: 'Story History' },
	'listStorySubTasks.get': {
		riskLevel: 'read',
		description: 'List Story Sub tasks',
	},
	'createTask.post': { riskLevel: 'write', description: 'Create Task' },
	'getTask.get': { riskLevel: 'read', description: 'Get Task' },
	'updateTask.put': { riskLevel: 'write', description: 'Update Task' },
	'deleteTask.delete': { riskLevel: 'destructive', description: 'Delete Task' },
	'createStoryLink.post': {
		riskLevel: 'write',
		description: 'Create Story Link',
	},
	'getStoryLink.get': { riskLevel: 'read', description: 'Get Story Link' },
	'updateStoryLink.put': {
		riskLevel: 'write',
		description: 'Update Story Link',
	},
	'deleteStoryLink.delete': {
		riskLevel: 'destructive',
		description: 'Delete Story Link',
	},
	'listWorkflows.get': { riskLevel: 'read', description: 'List Workflows' },
	'getWorkflow.get': { riskLevel: 'read', description: 'Get Workflow' },
} as const satisfies RequiredPluginEndpointMeta<typeof ShortcutEndpointsNested>;
const defaultAuthType: AuthTypes = 'api_key';
export const shortcutAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseShortcutPlugin<T extends ShortcutPluginOptions> = CorsairPlugin<
	'shortcut',
	typeof ShortcutSchema,
	typeof ShortcutEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalShortcutPlugin = BaseShortcutPlugin<ShortcutPluginOptions>;
export type ExternalShortcutPlugin<T extends ShortcutPluginOptions> =
	BaseShortcutPlugin<T>;
export function shortcut<const T extends ShortcutPluginOptions>(
	incomingOptions: ShortcutPluginOptions & T = {} as ShortcutPluginOptions & T,
): ExternalShortcutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	return {
		id: 'shortcut',
		authConfig: shortcutAuthConfig,
		schema: ShortcutSchema,
		options,
		hooks: options.hooks,
		endpoints: ShortcutEndpointsNested,
		webhooks: {},
		endpointMeta: shortcutEndpointMeta,
		endpointSchemas: shortcutEndpointSchemas,
		errorHandlers: {
			...callerHandlers,
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: ShortcutKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('shortcut', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('shortcut', 'api_key');
			return key;
		},
	} satisfies InternalShortcutPlugin;
}
export type {
	ShortcutEndpointInputs,
	ShortcutEndpointOutputs,
} from './endpoints/types';
