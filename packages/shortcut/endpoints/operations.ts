import { makeShortcutRequest } from '../client';
import type { ShortcutEndpoint } from '../index';
import {
	ShortcutEndpointInputSchemas,
	ShortcutEndpointOutputSchemas,
} from './types';

export const ShortcutOperations = {
	listCategories: {
		method: 'GET',
		route: '/api/v3/categories',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createCategory: {
		method: 'POST',
		route: '/api/v3/categories',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getCategory: {
		method: 'GET',
		route: '/api/v3/categories/{category-public-id}',
		pathParams: [{ name: 'category-public-id', key: 'categoryPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateCategory: {
		method: 'PUT',
		route: '/api/v3/categories/{category-public-id}',
		pathParams: [{ name: 'category-public-id', key: 'categoryPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteCategory: {
		method: 'DELETE',
		route: '/api/v3/categories/{category-public-id}',
		pathParams: [{ name: 'category-public-id', key: 'categoryPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listCategoryMilestones: {
		method: 'GET',
		route: '/api/v3/categories/{category-public-id}/milestones',
		pathParams: [{ name: 'category-public-id', key: 'categoryPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listCategoryObjectives: {
		method: 'GET',
		route: '/api/v3/categories/{category-public-id}/objectives',
		pathParams: [{ name: 'category-public-id', key: 'categoryPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listCustomFields: {
		method: 'GET',
		route: '/api/v3/custom-fields',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getCustomField: {
		method: 'GET',
		route: '/api/v3/custom-fields/{custom-field-public-id}',
		pathParams: [
			{ name: 'custom-field-public-id', key: 'customFieldPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	updateCustomField: {
		method: 'PUT',
		route: '/api/v3/custom-fields/{custom-field-public-id}',
		pathParams: [
			{ name: 'custom-field-public-id', key: 'customFieldPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteCustomField: {
		method: 'DELETE',
		route: '/api/v3/custom-fields/{custom-field-public-id}',
		pathParams: [
			{ name: 'custom-field-public-id', key: 'customFieldPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	listDocs: {
		method: 'GET',
		route: '/api/v3/documents',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createDoc: {
		method: 'POST',
		route: '/api/v3/documents',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getDoc: {
		method: 'GET',
		route: '/api/v3/documents/{doc-public-id}',
		pathParams: [{ name: 'doc-public-id', key: 'docPublicId' }],
		queryParams: ['content_format'],
		multipart: false,
	},
	updateDoc: {
		method: 'PUT',
		route: '/api/v3/documents/{doc-public-id}',
		pathParams: [{ name: 'doc-public-id', key: 'docPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteDoc: {
		method: 'DELETE',
		route: '/api/v3/documents/{doc-public-id}',
		pathParams: [{ name: 'doc-public-id', key: 'docPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listDocumentEpics: {
		method: 'GET',
		route: '/api/v3/documents/{doc-public-id}/epics',
		pathParams: [{ name: 'doc-public-id', key: 'docPublicId' }],
		queryParams: [],
		multipart: false,
	},
	linkDocumentToEpic: {
		method: 'PUT',
		route: '/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
		pathParams: [
			{ name: 'doc-public-id', key: 'docPublicId' },
			{ name: 'epic-public-id', key: 'epicPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	unlinkDocumentFromEpic: {
		method: 'DELETE',
		route: '/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
		pathParams: [
			{ name: 'doc-public-id', key: 'docPublicId' },
			{ name: 'epic-public-id', key: 'epicPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	listEntityTemplates: {
		method: 'GET',
		route: '/api/v3/entity-templates',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createEntityTemplate: {
		method: 'POST',
		route: '/api/v3/entity-templates',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	disableStoryTemplates: {
		method: 'PUT',
		route: '/api/v3/entity-templates/disable',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	enableStoryTemplates: {
		method: 'PUT',
		route: '/api/v3/entity-templates/enable',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getEntityTemplate: {
		method: 'GET',
		route: '/api/v3/entity-templates/{entity-template-public-id}',
		pathParams: [
			{ name: 'entity-template-public-id', key: 'entityTemplatePublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	updateEntityTemplate: {
		method: 'PUT',
		route: '/api/v3/entity-templates/{entity-template-public-id}',
		pathParams: [
			{ name: 'entity-template-public-id', key: 'entityTemplatePublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteEntityTemplate: {
		method: 'DELETE',
		route: '/api/v3/entity-templates/{entity-template-public-id}',
		pathParams: [
			{ name: 'entity-template-public-id', key: 'entityTemplatePublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	getEpicWorkflow: {
		method: 'GET',
		route: '/api/v3/epic-workflow',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	listEpics: {
		method: 'GET',
		route: '/api/v3/epics',
		pathParams: [],
		queryParams: ['includes_description'],
		multipart: false,
	},
	createEpic: {
		method: 'POST',
		route: '/api/v3/epics',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	listEpicsPaginated: {
		method: 'GET',
		route: '/api/v3/epics/paginated',
		pathParams: [],
		queryParams: ['includes_description', 'page', 'page_size'],
		multipart: false,
	},
	getEpic: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateEpic: {
		method: 'PUT',
		route: '/api/v3/epics/{epic-public-id}',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteEpic: {
		method: 'DELETE',
		route: '/api/v3/epics/{epic-public-id}',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listEpicComments: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/comments',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	createEpicComment: {
		method: 'POST',
		route: '/api/v3/epics/{epic-public-id}/comments',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	createEpicCommentComment: {
		method: 'POST',
		route: '/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'epic-public-id', key: 'epicPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	getEpicComment: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'epic-public-id', key: 'epicPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	updateEpicComment: {
		method: 'PUT',
		route: '/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'epic-public-id', key: 'epicPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteEpicComment: {
		method: 'DELETE',
		route: '/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'epic-public-id', key: 'epicPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	listEpicDocuments: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/documents',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	getEpicHealth: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/health',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	createEpicHealth: {
		method: 'POST',
		route: '/api/v3/epics/{epic-public-id}/health',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listEpicHealths: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/health-history',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listEpicStories: {
		method: 'GET',
		route: '/api/v3/epics/{epic-public-id}/stories',
		pathParams: [{ name: 'epic-public-id', key: 'epicPublicId' }],
		queryParams: ['includes_description'],
		multipart: false,
	},
	getExternalLinkStories: {
		method: 'GET',
		route: '/api/v3/external-link/stories',
		pathParams: [],
		queryParams: ['external_link'],
		multipart: false,
	},
	listFiles: {
		method: 'GET',
		route: '/api/v3/files',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	uploadFiles: {
		method: 'POST',
		route: '/api/v3/files',
		pathParams: [],
		queryParams: [],
		multipart: true,
	},
	getFile: {
		method: 'GET',
		route: '/api/v3/files/{file-public-id}',
		pathParams: [{ name: 'file-public-id', key: 'filePublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateFile: {
		method: 'PUT',
		route: '/api/v3/files/{file-public-id}',
		pathParams: [{ name: 'file-public-id', key: 'filePublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteFile: {
		method: 'DELETE',
		route: '/api/v3/files/{file-public-id}',
		pathParams: [{ name: 'file-public-id', key: 'filePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listGroups: {
		method: 'GET',
		route: '/api/v3/groups',
		pathParams: [],
		queryParams: ['archived'],
		multipart: false,
	},
	createGroup: {
		method: 'POST',
		route: '/api/v3/groups',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getGroup: {
		method: 'GET',
		route: '/api/v3/groups/{group-public-id}',
		pathParams: [{ name: 'group-public-id', key: 'groupPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateGroup: {
		method: 'PUT',
		route: '/api/v3/groups/{group-public-id}',
		pathParams: [{ name: 'group-public-id', key: 'groupPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listGroupStories: {
		method: 'GET',
		route: '/api/v3/groups/{group-public-id}/stories',
		pathParams: [{ name: 'group-public-id', key: 'groupPublicId' }],
		queryParams: ['limit', 'offset'],
		multipart: false,
	},
	updateHealth: {
		method: 'PUT',
		route: '/api/v3/health/{health-public-id}',
		pathParams: [{ name: 'health-public-id', key: 'healthPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listIterations: {
		method: 'GET',
		route: '/api/v3/iterations',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createIteration: {
		method: 'POST',
		route: '/api/v3/iterations',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	disableIterations: {
		method: 'PUT',
		route: '/api/v3/iterations/disable',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	enableIterations: {
		method: 'PUT',
		route: '/api/v3/iterations/enable',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getIteration: {
		method: 'GET',
		route: '/api/v3/iterations/{iteration-public-id}',
		pathParams: [{ name: 'iteration-public-id', key: 'iterationPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateIteration: {
		method: 'PUT',
		route: '/api/v3/iterations/{iteration-public-id}',
		pathParams: [{ name: 'iteration-public-id', key: 'iterationPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteIteration: {
		method: 'DELETE',
		route: '/api/v3/iterations/{iteration-public-id}',
		pathParams: [{ name: 'iteration-public-id', key: 'iterationPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listIterationStories: {
		method: 'GET',
		route: '/api/v3/iterations/{iteration-public-id}/stories',
		pathParams: [{ name: 'iteration-public-id', key: 'iterationPublicId' }],
		queryParams: ['includes_description'],
		multipart: false,
	},
	getKeyResult: {
		method: 'GET',
		route: '/api/v3/key-results/{key-result-public-id}',
		pathParams: [{ name: 'key-result-public-id', key: 'keyResultPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateKeyResult: {
		method: 'PUT',
		route: '/api/v3/key-results/{key-result-public-id}',
		pathParams: [{ name: 'key-result-public-id', key: 'keyResultPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listLabels: {
		method: 'GET',
		route: '/api/v3/labels',
		pathParams: [],
		queryParams: ['slim'],
		multipart: false,
	},
	createLabel: {
		method: 'POST',
		route: '/api/v3/labels',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getLabel: {
		method: 'GET',
		route: '/api/v3/labels/{label-public-id}',
		pathParams: [{ name: 'label-public-id', key: 'labelPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateLabel: {
		method: 'PUT',
		route: '/api/v3/labels/{label-public-id}',
		pathParams: [{ name: 'label-public-id', key: 'labelPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteLabel: {
		method: 'DELETE',
		route: '/api/v3/labels/{label-public-id}',
		pathParams: [{ name: 'label-public-id', key: 'labelPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listLabelEpics: {
		method: 'GET',
		route: '/api/v3/labels/{label-public-id}/epics',
		pathParams: [{ name: 'label-public-id', key: 'labelPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listLabelStories: {
		method: 'GET',
		route: '/api/v3/labels/{label-public-id}/stories',
		pathParams: [{ name: 'label-public-id', key: 'labelPublicId' }],
		queryParams: ['includes_description'],
		multipart: false,
	},
	listLinkedFiles: {
		method: 'GET',
		route: '/api/v3/linked-files',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createLinkedFile: {
		method: 'POST',
		route: '/api/v3/linked-files',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getLinkedFile: {
		method: 'GET',
		route: '/api/v3/linked-files/{linked-file-public-id}',
		pathParams: [{ name: 'linked-file-public-id', key: 'linkedFilePublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateLinkedFile: {
		method: 'PUT',
		route: '/api/v3/linked-files/{linked-file-public-id}',
		pathParams: [{ name: 'linked-file-public-id', key: 'linkedFilePublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteLinkedFile: {
		method: 'DELETE',
		route: '/api/v3/linked-files/{linked-file-public-id}',
		pathParams: [{ name: 'linked-file-public-id', key: 'linkedFilePublicId' }],
		queryParams: [],
		multipart: false,
	},
	getCurrentMemberInfo: {
		method: 'GET',
		route: '/api/v3/member',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	listMembers: {
		method: 'GET',
		route: '/api/v3/members',
		pathParams: [],
		queryParams: ['org-public-id', 'disabled'],
		multipart: false,
	},
	getMember: {
		method: 'GET',
		route: '/api/v3/members/{member-public-id}',
		pathParams: [{ name: 'member-public-id', key: 'memberPublicId' }],
		queryParams: ['org-public-id'],
		multipart: false,
	},
	listMilestones: {
		method: 'GET',
		route: '/api/v3/milestones',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createMilestone: {
		method: 'POST',
		route: '/api/v3/milestones',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getMilestone: {
		method: 'GET',
		route: '/api/v3/milestones/{milestone-public-id}',
		pathParams: [{ name: 'milestone-public-id', key: 'milestonePublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateMilestone: {
		method: 'PUT',
		route: '/api/v3/milestones/{milestone-public-id}',
		pathParams: [{ name: 'milestone-public-id', key: 'milestonePublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteMilestone: {
		method: 'DELETE',
		route: '/api/v3/milestones/{milestone-public-id}',
		pathParams: [{ name: 'milestone-public-id', key: 'milestonePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listMilestoneEpics: {
		method: 'GET',
		route: '/api/v3/milestones/{milestone-public-id}/epics',
		pathParams: [{ name: 'milestone-public-id', key: 'milestonePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listObjectives: {
		method: 'GET',
		route: '/api/v3/objectives',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createObjective: {
		method: 'POST',
		route: '/api/v3/objectives',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getObjective: {
		method: 'GET',
		route: '/api/v3/objectives/{objective-public-id}',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateObjective: {
		method: 'PUT',
		route: '/api/v3/objectives/{objective-public-id}',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteObjective: {
		method: 'DELETE',
		route: '/api/v3/objectives/{objective-public-id}',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listObjectiveEpics: {
		method: 'GET',
		route: '/api/v3/objectives/{objective-public-id}/epics',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	getObjectiveHealth: {
		method: 'GET',
		route: '/api/v3/objectives/{objective-public-id}/health',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	createObjectiveHealth: {
		method: 'POST',
		route: '/api/v3/objectives/{objective-public-id}/health',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listObjectiveHealths: {
		method: 'GET',
		route: '/api/v3/objectives/{objective-public-id}/health-history',
		pathParams: [{ name: 'objective-public-id', key: 'objectivePublicId' }],
		queryParams: [],
		multipart: false,
	},
	listProjects: {
		method: 'GET',
		route: '/api/v3/projects',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createProject: {
		method: 'POST',
		route: '/api/v3/projects',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getProject: {
		method: 'GET',
		route: '/api/v3/projects/{project-public-id}',
		pathParams: [{ name: 'project-public-id', key: 'projectPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateProject: {
		method: 'PUT',
		route: '/api/v3/projects/{project-public-id}',
		pathParams: [{ name: 'project-public-id', key: 'projectPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteProject: {
		method: 'DELETE',
		route: '/api/v3/projects/{project-public-id}',
		pathParams: [{ name: 'project-public-id', key: 'projectPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listStories: {
		method: 'GET',
		route: '/api/v3/projects/{project-public-id}/stories',
		pathParams: [{ name: 'project-public-id', key: 'projectPublicId' }],
		queryParams: ['includes_description'],
		multipart: false,
	},
	listRepositories: {
		method: 'GET',
		route: '/api/v3/repositories',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getRepository: {
		method: 'GET',
		route: '/api/v3/repositories/{repo-public-id}',
		pathParams: [{ name: 'repo-public-id', key: 'repoPublicId' }],
		queryParams: [],
		multipart: false,
	},
	search: {
		method: 'GET',
		route: '/api/v3/search',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	searchDocuments: {
		method: 'GET',
		route: '/api/v3/search/documents',
		pathParams: [],
		queryParams: [
			'title',
			'archived',
			'created_by_me',
			'followed_by_me',
			'page_size',
			'next',
		],
		multipart: false,
	},
	searchEpics: {
		method: 'GET',
		route: '/api/v3/search/epics',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	searchIterations: {
		method: 'GET',
		route: '/api/v3/search/iterations',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	searchMilestones: {
		method: 'GET',
		route: '/api/v3/search/milestones',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	searchObjectives: {
		method: 'GET',
		route: '/api/v3/search/objectives',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	searchStories: {
		method: 'GET',
		route: '/api/v3/search/stories',
		pathParams: [],
		queryParams: ['query', 'page_size', 'detail', 'next', 'entity_types'],
		multipart: false,
	},
	createStory: {
		method: 'POST',
		route: '/api/v3/stories',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createMultipleStories: {
		method: 'POST',
		route: '/api/v3/stories/bulk',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	updateMultipleStories: {
		method: 'PUT',
		route: '/api/v3/stories/bulk',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	deleteMultipleStories: {
		method: 'DELETE',
		route: '/api/v3/stories/bulk',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	createStoryFromTemplate: {
		method: 'POST',
		route: '/api/v3/stories/from-template',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	queryStories: {
		method: 'POST',
		route: '/api/v3/stories/search',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getStory: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateStory: {
		method: 'PUT',
		route: '/api/v3/stories/{story-public-id}',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteStory: {
		method: 'DELETE',
		route: '/api/v3/stories/{story-public-id}',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listStoryComment: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}/comments',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	createStoryComment: {
		method: 'POST',
		route: '/api/v3/stories/{story-public-id}/comments',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	getStoryComment: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	updateStoryComment: {
		method: 'PUT',
		route: '/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteStoryComment: {
		method: 'DELETE',
		route: '/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	createStoryReaction: {
		method: 'POST',
		route:
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteStoryReaction: {
		method: 'DELETE',
		route:
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	unlinkCommentThreadFromSlack: {
		method: 'POST',
		route:
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/unlink-from-slack',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'comment-public-id', key: 'commentPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	storyHistory: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}/history',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listStorySubTasks: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}/sub-tasks',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	createTask: {
		method: 'POST',
		route: '/api/v3/stories/{story-public-id}/tasks',
		pathParams: [{ name: 'story-public-id', key: 'storyPublicId' }],
		queryParams: [],
		multipart: false,
	},
	getTask: {
		method: 'GET',
		route: '/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'task-public-id', key: 'taskPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	updateTask: {
		method: 'PUT',
		route: '/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'task-public-id', key: 'taskPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	deleteTask: {
		method: 'DELETE',
		route: '/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		pathParams: [
			{ name: 'story-public-id', key: 'storyPublicId' },
			{ name: 'task-public-id', key: 'taskPublicId' },
		],
		queryParams: [],
		multipart: false,
	},
	createStoryLink: {
		method: 'POST',
		route: '/api/v3/story-links',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getStoryLink: {
		method: 'GET',
		route: '/api/v3/story-links/{story-link-public-id}',
		pathParams: [{ name: 'story-link-public-id', key: 'storyLinkPublicId' }],
		queryParams: [],
		multipart: false,
	},
	updateStoryLink: {
		method: 'PUT',
		route: '/api/v3/story-links/{story-link-public-id}',
		pathParams: [{ name: 'story-link-public-id', key: 'storyLinkPublicId' }],
		queryParams: [],
		multipart: false,
	},
	deleteStoryLink: {
		method: 'DELETE',
		route: '/api/v3/story-links/{story-link-public-id}',
		pathParams: [{ name: 'story-link-public-id', key: 'storyLinkPublicId' }],
		queryParams: [],
		multipart: false,
	},
	listWorkflows: {
		method: 'GET',
		route: '/api/v3/workflows',
		pathParams: [],
		queryParams: [],
		multipart: false,
	},
	getWorkflow: {
		method: 'GET',
		route: '/api/v3/workflows/{workflow-public-id}',
		pathParams: [{ name: 'workflow-public-id', key: 'workflowPublicId' }],
		queryParams: [],
		multipart: false,
	},
} as const;

export const listCategories: ShortcutEndpoint<'listCategories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listCategories'].parse(input);
	const response = await makeShortcutRequest('/api/v3/categories', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listCategories'].parse(response);
};

export const createCategory: ShortcutEndpoint<'createCategory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createCategory'].parse(input);
	const response = await makeShortcutRequest('/api/v3/categories', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createCategory'].parse(response);
};

export const getCategory: ShortcutEndpoint<'getCategory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getCategory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/categories/{category-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'category-public-id': parsed.path.categoryPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getCategory'].parse(response);
};

export const updateCategory: ShortcutEndpoint<'updateCategory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateCategory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/categories/{category-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'category-public-id': parsed.path.categoryPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateCategory'].parse(response);
};

export const deleteCategory: ShortcutEndpoint<'deleteCategory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteCategory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/categories/{category-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'category-public-id': parsed.path.categoryPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteCategory'].parse(response);
};

export const listCategoryMilestones: ShortcutEndpoint<
	'listCategoryMilestones'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listCategoryMilestones'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/categories/{category-public-id}/milestones',
		ctx.key,
		{
			method: 'GET',
			path: { 'category-public-id': parsed.path.categoryPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listCategoryMilestones'].parse(
		response,
	);
};

export const listCategoryObjectives: ShortcutEndpoint<
	'listCategoryObjectives'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listCategoryObjectives'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/categories/{category-public-id}/objectives',
		ctx.key,
		{
			method: 'GET',
			path: { 'category-public-id': parsed.path.categoryPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listCategoryObjectives'].parse(
		response,
	);
};

export const listCustomFields: ShortcutEndpoint<'listCustomFields'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listCustomFields'].parse(input);
	const response = await makeShortcutRequest('/api/v3/custom-fields', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listCustomFields'].parse(response);
};

export const getCustomField: ShortcutEndpoint<'getCustomField'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getCustomField'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/custom-fields/{custom-field-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'custom-field-public-id': parsed.path.customFieldPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getCustomField'].parse(response);
};

export const updateCustomField: ShortcutEndpoint<'updateCustomField'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateCustomField'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/custom-fields/{custom-field-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'custom-field-public-id': parsed.path.customFieldPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateCustomField'].parse(response);
};

export const deleteCustomField: ShortcutEndpoint<'deleteCustomField'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteCustomField'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/custom-fields/{custom-field-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'custom-field-public-id': parsed.path.customFieldPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteCustomField'].parse(response);
};

export const listDocs: ShortcutEndpoint<'listDocs'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['listDocs'].parse(input);
	const response = await makeShortcutRequest('/api/v3/documents', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listDocs'].parse(response);
};

export const createDoc: ShortcutEndpoint<'createDoc'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['createDoc'].parse(input);
	const response = await makeShortcutRequest('/api/v3/documents', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createDoc'].parse(response);
};

export const getDoc: ShortcutEndpoint<'getDoc'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getDoc'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'doc-public-id': parsed.path.docPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['getDoc'].parse(response);
};

export const updateDoc: ShortcutEndpoint<'updateDoc'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['updateDoc'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'doc-public-id': parsed.path.docPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateDoc'].parse(response);
};

export const deleteDoc: ShortcutEndpoint<'deleteDoc'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['deleteDoc'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'doc-public-id': parsed.path.docPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteDoc'].parse(response);
};

export const listDocumentEpics: ShortcutEndpoint<'listDocumentEpics'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listDocumentEpics'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}/epics',
		ctx.key,
		{
			method: 'GET',
			path: { 'doc-public-id': parsed.path.docPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listDocumentEpics'].parse(response);
};

export const linkDocumentToEpic: ShortcutEndpoint<
	'linkDocumentToEpic'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['linkDocumentToEpic'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: {
				'doc-public-id': parsed.path.docPublicId,
				'epic-public-id': parsed.path.epicPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['linkDocumentToEpic'].parse(response);
};

export const unlinkDocumentFromEpic: ShortcutEndpoint<
	'unlinkDocumentFromEpic'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['unlinkDocumentFromEpic'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: {
				'doc-public-id': parsed.path.docPublicId,
				'epic-public-id': parsed.path.epicPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['unlinkDocumentFromEpic'].parse(
		response,
	);
};

export const listEntityTemplates: ShortcutEndpoint<
	'listEntityTemplates'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listEntityTemplates'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates',
		ctx.key,
		{ method: 'GET', path: {}, query: undefined },
	);
	return ShortcutEndpointOutputSchemas['listEntityTemplates'].parse(response);
};

export const createEntityTemplate: ShortcutEndpoint<
	'createEntityTemplate'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createEntityTemplate'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates',
		ctx.key,
		{ method: 'POST', path: {}, query: undefined, body: parsed.body },
	);
	return ShortcutEndpointOutputSchemas['createEntityTemplate'].parse(response);
};

export const disableStoryTemplates: ShortcutEndpoint<
	'disableStoryTemplates'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['disableStoryTemplates'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates/disable',
		ctx.key,
		{ method: 'PUT', path: {}, query: undefined },
	);
	return ShortcutEndpointOutputSchemas['disableStoryTemplates'].parse(response);
};

export const enableStoryTemplates: ShortcutEndpoint<
	'enableStoryTemplates'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['enableStoryTemplates'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates/enable',
		ctx.key,
		{ method: 'PUT', path: {}, query: undefined },
	);
	return ShortcutEndpointOutputSchemas['enableStoryTemplates'].parse(response);
};

export const getEntityTemplate: ShortcutEndpoint<'getEntityTemplate'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getEntityTemplate'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates/{entity-template-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'entity-template-public-id': parsed.path.entityTemplatePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getEntityTemplate'].parse(response);
};

export const updateEntityTemplate: ShortcutEndpoint<
	'updateEntityTemplate'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['updateEntityTemplate'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates/{entity-template-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'entity-template-public-id': parsed.path.entityTemplatePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateEntityTemplate'].parse(response);
};

export const deleteEntityTemplate: ShortcutEndpoint<
	'deleteEntityTemplate'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['deleteEntityTemplate'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/entity-templates/{entity-template-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'entity-template-public-id': parsed.path.entityTemplatePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteEntityTemplate'].parse(response);
};

export const getEpicWorkflow: ShortcutEndpoint<'getEpicWorkflow'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getEpicWorkflow'].parse(input);
	const response = await makeShortcutRequest('/api/v3/epic-workflow', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['getEpicWorkflow'].parse(response);
};

export const listEpics: ShortcutEndpoint<'listEpics'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['listEpics'].parse(input);
	const response = await makeShortcutRequest('/api/v3/epics', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['listEpics'].parse(response);
};

export const createEpic: ShortcutEndpoint<'createEpic'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createEpic'].parse(input);
	const response = await makeShortcutRequest('/api/v3/epics', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createEpic'].parse(response);
};

export const listEpicsPaginated: ShortcutEndpoint<
	'listEpicsPaginated'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listEpicsPaginated'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/paginated',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['listEpicsPaginated'].parse(response);
};

export const getEpic: ShortcutEndpoint<'getEpic'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getEpic'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getEpic'].parse(response);
};

export const updateEpic: ShortcutEndpoint<'updateEpic'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateEpic'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateEpic'].parse(response);
};

export const deleteEpic: ShortcutEndpoint<'deleteEpic'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteEpic'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteEpic'].parse(response);
};

export const listEpicComments: ShortcutEndpoint<'listEpicComments'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listEpicComments'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listEpicComments'].parse(response);
};

export const createEpicComment: ShortcutEndpoint<'createEpicComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createEpicComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments',
		ctx.key,
		{
			method: 'POST',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createEpicComment'].parse(response);
};

export const createEpicCommentComment: ShortcutEndpoint<
	'createEpicCommentComment'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createEpicCommentComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'POST',
			path: {
				'epic-public-id': parsed.path.epicPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createEpicCommentComment'].parse(
		response,
	);
};

export const getEpicComment: ShortcutEndpoint<'getEpicComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getEpicComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: {
				'epic-public-id': parsed.path.epicPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getEpicComment'].parse(response);
};

export const updateEpicComment: ShortcutEndpoint<'updateEpicComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateEpicComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: {
				'epic-public-id': parsed.path.epicPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateEpicComment'].parse(response);
};

export const deleteEpicComment: ShortcutEndpoint<'deleteEpicComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteEpicComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: {
				'epic-public-id': parsed.path.epicPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteEpicComment'].parse(response);
};

export const listEpicDocuments: ShortcutEndpoint<'listEpicDocuments'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listEpicDocuments'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/documents',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listEpicDocuments'].parse(response);
};

export const getEpicHealth: ShortcutEndpoint<'getEpicHealth'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getEpicHealth'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/health',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getEpicHealth'].parse(response);
};

export const createEpicHealth: ShortcutEndpoint<'createEpicHealth'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createEpicHealth'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/health',
		ctx.key,
		{
			method: 'POST',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createEpicHealth'].parse(response);
};

export const listEpicHealths: ShortcutEndpoint<'listEpicHealths'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listEpicHealths'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/health-history',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listEpicHealths'].parse(response);
};

export const listEpicStories: ShortcutEndpoint<'listEpicStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listEpicStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/epics/{epic-public-id}/stories',
		ctx.key,
		{
			method: 'GET',
			path: { 'epic-public-id': parsed.path.epicPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['listEpicStories'].parse(response);
};

export const getExternalLinkStories: ShortcutEndpoint<
	'getExternalLinkStories'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['getExternalLinkStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/external-link/stories',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['getExternalLinkStories'].parse(
		response,
	);
};

export const listFiles: ShortcutEndpoint<'listFiles'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['listFiles'].parse(input);
	const response = await makeShortcutRequest('/api/v3/files', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listFiles'].parse(response);
};

export const uploadFiles: ShortcutEndpoint<'uploadFiles'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['uploadFiles'].parse(input);
	const response = await makeShortcutRequest('/api/v3/files', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: undefined,
		formData: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['uploadFiles'].parse(response);
};

export const getFile: ShortcutEndpoint<'getFile'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/files/{file-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'file-public-id': parsed.path.filePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getFile'].parse(response);
};

export const updateFile: ShortcutEndpoint<'updateFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/files/{file-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'file-public-id': parsed.path.filePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateFile'].parse(response);
};

export const deleteFile: ShortcutEndpoint<'deleteFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/files/{file-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'file-public-id': parsed.path.filePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteFile'].parse(response);
};

export const listGroups: ShortcutEndpoint<'listGroups'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listGroups'].parse(input);
	const response = await makeShortcutRequest('/api/v3/groups', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['listGroups'].parse(response);
};

export const createGroup: ShortcutEndpoint<'createGroup'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createGroup'].parse(input);
	const response = await makeShortcutRequest('/api/v3/groups', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createGroup'].parse(response);
};

export const getGroup: ShortcutEndpoint<'getGroup'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getGroup'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/groups/{group-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'group-public-id': parsed.path.groupPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getGroup'].parse(response);
};

export const updateGroup: ShortcutEndpoint<'updateGroup'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateGroup'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/groups/{group-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'group-public-id': parsed.path.groupPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateGroup'].parse(response);
};

export const listGroupStories: ShortcutEndpoint<'listGroupStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listGroupStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/groups/{group-public-id}/stories',
		ctx.key,
		{
			method: 'GET',
			path: { 'group-public-id': parsed.path.groupPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['listGroupStories'].parse(response);
};

export const updateHealth: ShortcutEndpoint<'updateHealth'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateHealth'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/health/{health-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'health-public-id': parsed.path.healthPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateHealth'].parse(response);
};

export const listIterations: ShortcutEndpoint<'listIterations'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listIterations'].parse(input);
	const response = await makeShortcutRequest('/api/v3/iterations', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listIterations'].parse(response);
};

export const createIteration: ShortcutEndpoint<'createIteration'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createIteration'].parse(input);
	const response = await makeShortcutRequest('/api/v3/iterations', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createIteration'].parse(response);
};

export const disableIterations: ShortcutEndpoint<'disableIterations'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['disableIterations'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/disable',
		ctx.key,
		{ method: 'PUT', path: {}, query: undefined },
	);
	return ShortcutEndpointOutputSchemas['disableIterations'].parse(response);
};

export const enableIterations: ShortcutEndpoint<'enableIterations'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['enableIterations'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/enable',
		ctx.key,
		{ method: 'PUT', path: {}, query: undefined },
	);
	return ShortcutEndpointOutputSchemas['enableIterations'].parse(response);
};

export const getIteration: ShortcutEndpoint<'getIteration'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getIteration'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/{iteration-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'iteration-public-id': parsed.path.iterationPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getIteration'].parse(response);
};

export const updateIteration: ShortcutEndpoint<'updateIteration'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateIteration'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/{iteration-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'iteration-public-id': parsed.path.iterationPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateIteration'].parse(response);
};

export const deleteIteration: ShortcutEndpoint<'deleteIteration'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteIteration'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/{iteration-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'iteration-public-id': parsed.path.iterationPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteIteration'].parse(response);
};

export const listIterationStories: ShortcutEndpoint<
	'listIterationStories'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listIterationStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/iterations/{iteration-public-id}/stories',
		ctx.key,
		{
			method: 'GET',
			path: { 'iteration-public-id': parsed.path.iterationPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['listIterationStories'].parse(response);
};

export const getKeyResult: ShortcutEndpoint<'getKeyResult'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getKeyResult'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/key-results/{key-result-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'key-result-public-id': parsed.path.keyResultPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getKeyResult'].parse(response);
};

export const updateKeyResult: ShortcutEndpoint<'updateKeyResult'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateKeyResult'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/key-results/{key-result-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'key-result-public-id': parsed.path.keyResultPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateKeyResult'].parse(response);
};

export const listLabels: ShortcutEndpoint<'listLabels'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listLabels'].parse(input);
	const response = await makeShortcutRequest('/api/v3/labels', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['listLabels'].parse(response);
};

export const createLabel: ShortcutEndpoint<'createLabel'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createLabel'].parse(input);
	const response = await makeShortcutRequest('/api/v3/labels', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createLabel'].parse(response);
};

export const getLabel: ShortcutEndpoint<'getLabel'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getLabel'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/labels/{label-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'label-public-id': parsed.path.labelPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getLabel'].parse(response);
};

export const updateLabel: ShortcutEndpoint<'updateLabel'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateLabel'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/labels/{label-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'label-public-id': parsed.path.labelPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateLabel'].parse(response);
};

export const deleteLabel: ShortcutEndpoint<'deleteLabel'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteLabel'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/labels/{label-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'label-public-id': parsed.path.labelPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteLabel'].parse(response);
};

export const listLabelEpics: ShortcutEndpoint<'listLabelEpics'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listLabelEpics'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/labels/{label-public-id}/epics',
		ctx.key,
		{
			method: 'GET',
			path: { 'label-public-id': parsed.path.labelPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listLabelEpics'].parse(response);
};

export const listLabelStories: ShortcutEndpoint<'listLabelStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listLabelStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/labels/{label-public-id}/stories',
		ctx.key,
		{
			method: 'GET',
			path: { 'label-public-id': parsed.path.labelPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['listLabelStories'].parse(response);
};

export const listLinkedFiles: ShortcutEndpoint<'listLinkedFiles'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listLinkedFiles'].parse(input);
	const response = await makeShortcutRequest('/api/v3/linked-files', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listLinkedFiles'].parse(response);
};

export const createLinkedFile: ShortcutEndpoint<'createLinkedFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createLinkedFile'].parse(input);
	const response = await makeShortcutRequest('/api/v3/linked-files', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createLinkedFile'].parse(response);
};

export const getLinkedFile: ShortcutEndpoint<'getLinkedFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getLinkedFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/linked-files/{linked-file-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'linked-file-public-id': parsed.path.linkedFilePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getLinkedFile'].parse(response);
};

export const updateLinkedFile: ShortcutEndpoint<'updateLinkedFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateLinkedFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/linked-files/{linked-file-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'linked-file-public-id': parsed.path.linkedFilePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateLinkedFile'].parse(response);
};

export const deleteLinkedFile: ShortcutEndpoint<'deleteLinkedFile'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteLinkedFile'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/linked-files/{linked-file-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'linked-file-public-id': parsed.path.linkedFilePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteLinkedFile'].parse(response);
};

export const getCurrentMemberInfo: ShortcutEndpoint<
	'getCurrentMemberInfo'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['getCurrentMemberInfo'].parse(input);
	const response = await makeShortcutRequest('/api/v3/member', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['getCurrentMemberInfo'].parse(response);
};

export const listMembers: ShortcutEndpoint<'listMembers'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listMembers'].parse(input);
	const response = await makeShortcutRequest('/api/v3/members', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['listMembers'].parse(response);
};

export const getMember: ShortcutEndpoint<'getMember'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getMember'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/members/{member-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'member-public-id': parsed.path.memberPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['getMember'].parse(response);
};

export const listMilestones: ShortcutEndpoint<'listMilestones'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listMilestones'].parse(input);
	const response = await makeShortcutRequest('/api/v3/milestones', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listMilestones'].parse(response);
};

export const createMilestone: ShortcutEndpoint<'createMilestone'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createMilestone'].parse(input);
	const response = await makeShortcutRequest('/api/v3/milestones', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createMilestone'].parse(response);
};

export const getMilestone: ShortcutEndpoint<'getMilestone'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getMilestone'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/milestones/{milestone-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'milestone-public-id': parsed.path.milestonePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getMilestone'].parse(response);
};

export const updateMilestone: ShortcutEndpoint<'updateMilestone'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateMilestone'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/milestones/{milestone-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'milestone-public-id': parsed.path.milestonePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateMilestone'].parse(response);
};

export const deleteMilestone: ShortcutEndpoint<'deleteMilestone'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteMilestone'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/milestones/{milestone-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'milestone-public-id': parsed.path.milestonePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteMilestone'].parse(response);
};

export const listMilestoneEpics: ShortcutEndpoint<
	'listMilestoneEpics'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listMilestoneEpics'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/milestones/{milestone-public-id}/epics',
		ctx.key,
		{
			method: 'GET',
			path: { 'milestone-public-id': parsed.path.milestonePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listMilestoneEpics'].parse(response);
};

export const listObjectives: ShortcutEndpoint<'listObjectives'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listObjectives'].parse(input);
	const response = await makeShortcutRequest('/api/v3/objectives', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listObjectives'].parse(response);
};

export const createObjective: ShortcutEndpoint<'createObjective'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createObjective'].parse(input);
	const response = await makeShortcutRequest('/api/v3/objectives', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createObjective'].parse(response);
};

export const getObjective: ShortcutEndpoint<'getObjective'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getObjective'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getObjective'].parse(response);
};

export const updateObjective: ShortcutEndpoint<'updateObjective'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateObjective'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateObjective'].parse(response);
};

export const deleteObjective: ShortcutEndpoint<'deleteObjective'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteObjective'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteObjective'].parse(response);
};

export const listObjectiveEpics: ShortcutEndpoint<
	'listObjectiveEpics'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listObjectiveEpics'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}/epics',
		ctx.key,
		{
			method: 'GET',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listObjectiveEpics'].parse(response);
};

export const getObjectiveHealth: ShortcutEndpoint<
	'getObjectiveHealth'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['getObjectiveHealth'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}/health',
		ctx.key,
		{
			method: 'GET',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getObjectiveHealth'].parse(response);
};

export const createObjectiveHealth: ShortcutEndpoint<
	'createObjectiveHealth'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createObjectiveHealth'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}/health',
		ctx.key,
		{
			method: 'POST',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createObjectiveHealth'].parse(response);
};

export const listObjectiveHealths: ShortcutEndpoint<
	'listObjectiveHealths'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['listObjectiveHealths'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/objectives/{objective-public-id}/health-history',
		ctx.key,
		{
			method: 'GET',
			path: { 'objective-public-id': parsed.path.objectivePublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listObjectiveHealths'].parse(response);
};

export const listProjects: ShortcutEndpoint<'listProjects'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listProjects'].parse(input);
	const response = await makeShortcutRequest('/api/v3/projects', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listProjects'].parse(response);
};

export const createProject: ShortcutEndpoint<'createProject'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createProject'].parse(input);
	const response = await makeShortcutRequest('/api/v3/projects', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createProject'].parse(response);
};

export const getProject: ShortcutEndpoint<'getProject'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getProject'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/projects/{project-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'project-public-id': parsed.path.projectPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getProject'].parse(response);
};

export const updateProject: ShortcutEndpoint<'updateProject'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateProject'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/projects/{project-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'project-public-id': parsed.path.projectPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateProject'].parse(response);
};

export const deleteProject: ShortcutEndpoint<'deleteProject'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteProject'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/projects/{project-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'project-public-id': parsed.path.projectPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteProject'].parse(response);
};

export const listStories: ShortcutEndpoint<'listStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/projects/{project-public-id}/stories',
		ctx.key,
		{
			method: 'GET',
			path: { 'project-public-id': parsed.path.projectPublicId },
			query: parsed.query,
		},
	);
	return ShortcutEndpointOutputSchemas['listStories'].parse(response);
};

export const listRepositories: ShortcutEndpoint<'listRepositories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listRepositories'].parse(input);
	const response = await makeShortcutRequest('/api/v3/repositories', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listRepositories'].parse(response);
};

export const getRepository: ShortcutEndpoint<'getRepository'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getRepository'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/repositories/{repo-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'repo-public-id': parsed.path.repoPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getRepository'].parse(response);
};

export const search: ShortcutEndpoint<'search'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['search'].parse(input);
	const response = await makeShortcutRequest('/api/v3/search', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['search'].parse(response);
};

export const searchDocuments: ShortcutEndpoint<'searchDocuments'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchDocuments'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/search/documents',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['searchDocuments'].parse(response);
};

export const searchEpics: ShortcutEndpoint<'searchEpics'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchEpics'].parse(input);
	const response = await makeShortcutRequest('/api/v3/search/epics', ctx.key, {
		method: 'GET',
		path: {},
		query: parsed.query,
	});
	return ShortcutEndpointOutputSchemas['searchEpics'].parse(response);
};

export const searchIterations: ShortcutEndpoint<'searchIterations'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchIterations'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/search/iterations',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['searchIterations'].parse(response);
};

export const searchMilestones: ShortcutEndpoint<'searchMilestones'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchMilestones'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/search/milestones',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['searchMilestones'].parse(response);
};

export const searchObjectives: ShortcutEndpoint<'searchObjectives'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchObjectives'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/search/objectives',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['searchObjectives'].parse(response);
};

export const searchStories: ShortcutEndpoint<'searchStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['searchStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/search/stories',
		ctx.key,
		{ method: 'GET', path: {}, query: parsed.query },
	);
	return ShortcutEndpointOutputSchemas['searchStories'].parse(response);
};

export const createStory: ShortcutEndpoint<'createStory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createStory'].parse(input);
	const response = await makeShortcutRequest('/api/v3/stories', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createStory'].parse(response);
};

export const createMultipleStories: ShortcutEndpoint<
	'createMultipleStories'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createMultipleStories'].parse(input);
	const response = await makeShortcutRequest('/api/v3/stories/bulk', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createMultipleStories'].parse(response);
};

export const updateMultipleStories: ShortcutEndpoint<
	'updateMultipleStories'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['updateMultipleStories'].parse(input);
	const response = await makeShortcutRequest('/api/v3/stories/bulk', ctx.key, {
		method: 'PUT',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['updateMultipleStories'].parse(response);
};

export const deleteMultipleStories: ShortcutEndpoint<
	'deleteMultipleStories'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['deleteMultipleStories'].parse(input);
	const response = await makeShortcutRequest('/api/v3/stories/bulk', ctx.key, {
		method: 'DELETE',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['deleteMultipleStories'].parse(response);
};

export const createStoryFromTemplate: ShortcutEndpoint<
	'createStoryFromTemplate'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createStoryFromTemplate'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/from-template',
		ctx.key,
		{ method: 'POST', path: {}, query: undefined, body: parsed.body },
	);
	return ShortcutEndpointOutputSchemas['createStoryFromTemplate'].parse(
		response,
	);
};

export const queryStories: ShortcutEndpoint<'queryStories'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['queryStories'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/search',
		ctx.key,
		{ method: 'POST', path: {}, query: undefined, body: parsed.body },
	);
	return ShortcutEndpointOutputSchemas['queryStories'].parse(response);
};

export const getStory: ShortcutEndpoint<'getStory'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getStory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getStory'].parse(response);
};

export const updateStory: ShortcutEndpoint<'updateStory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateStory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateStory'].parse(response);
};

export const deleteStory: ShortcutEndpoint<'deleteStory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteStory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteStory'].parse(response);
};

export const listStoryComment: ShortcutEndpoint<'listStoryComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listStoryComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments',
		ctx.key,
		{
			method: 'GET',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listStoryComment'].parse(response);
};

export const createStoryComment: ShortcutEndpoint<
	'createStoryComment'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createStoryComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments',
		ctx.key,
		{
			method: 'POST',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createStoryComment'].parse(response);
};

export const getStoryComment: ShortcutEndpoint<'getStoryComment'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getStoryComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getStoryComment'].parse(response);
};

export const updateStoryComment: ShortcutEndpoint<
	'updateStoryComment'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['updateStoryComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateStoryComment'].parse(response);
};

export const deleteStoryComment: ShortcutEndpoint<
	'deleteStoryComment'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['deleteStoryComment'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteStoryComment'].parse(response);
};

export const createStoryReaction: ShortcutEndpoint<
	'createStoryReaction'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['createStoryReaction'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
		ctx.key,
		{
			method: 'POST',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['createStoryReaction'].parse(response);
};

export const deleteStoryReaction: ShortcutEndpoint<
	'deleteStoryReaction'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['deleteStoryReaction'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
		ctx.key,
		{
			method: 'DELETE',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteStoryReaction'].parse(response);
};

export const unlinkCommentThreadFromSlack: ShortcutEndpoint<
	'unlinkCommentThreadFromSlack'
> = async (ctx, input) => {
	const parsed =
		ShortcutEndpointInputSchemas['unlinkCommentThreadFromSlack'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/unlink-from-slack',
		ctx.key,
		{
			method: 'POST',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'comment-public-id': parsed.path.commentPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['unlinkCommentThreadFromSlack'].parse(
		response,
	);
};

export const storyHistory: ShortcutEndpoint<'storyHistory'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['storyHistory'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/history',
		ctx.key,
		{
			method: 'GET',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['storyHistory'].parse(response);
};

export const listStorySubTasks: ShortcutEndpoint<'listStorySubTasks'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listStorySubTasks'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/sub-tasks',
		ctx.key,
		{
			method: 'GET',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['listStorySubTasks'].parse(response);
};

export const createTask: ShortcutEndpoint<'createTask'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createTask'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/tasks',
		ctx.key,
		{
			method: 'POST',
			path: { 'story-public-id': parsed.path.storyPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['createTask'].parse(response);
};

export const getTask: ShortcutEndpoint<'getTask'> = async (ctx, input) => {
	const parsed = ShortcutEndpointInputSchemas['getTask'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'task-public-id': parsed.path.taskPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getTask'].parse(response);
};

export const updateTask: ShortcutEndpoint<'updateTask'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateTask'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'task-public-id': parsed.path.taskPublicId,
			},
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateTask'].parse(response);
};

export const deleteTask: ShortcutEndpoint<'deleteTask'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteTask'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: {
				'story-public-id': parsed.path.storyPublicId,
				'task-public-id': parsed.path.taskPublicId,
			},
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteTask'].parse(response);
};

export const createStoryLink: ShortcutEndpoint<'createStoryLink'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['createStoryLink'].parse(input);
	const response = await makeShortcutRequest('/api/v3/story-links', ctx.key, {
		method: 'POST',
		path: {},
		query: undefined,
		body: parsed.body,
	});
	return ShortcutEndpointOutputSchemas['createStoryLink'].parse(response);
};

export const getStoryLink: ShortcutEndpoint<'getStoryLink'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getStoryLink'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/story-links/{story-link-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'story-link-public-id': parsed.path.storyLinkPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getStoryLink'].parse(response);
};

export const updateStoryLink: ShortcutEndpoint<'updateStoryLink'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['updateStoryLink'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/story-links/{story-link-public-id}',
		ctx.key,
		{
			method: 'PUT',
			path: { 'story-link-public-id': parsed.path.storyLinkPublicId },
			query: undefined,
			body: parsed.body,
		},
	);
	return ShortcutEndpointOutputSchemas['updateStoryLink'].parse(response);
};

export const deleteStoryLink: ShortcutEndpoint<'deleteStoryLink'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['deleteStoryLink'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/story-links/{story-link-public-id}',
		ctx.key,
		{
			method: 'DELETE',
			path: { 'story-link-public-id': parsed.path.storyLinkPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['deleteStoryLink'].parse(response);
};

export const listWorkflows: ShortcutEndpoint<'listWorkflows'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['listWorkflows'].parse(input);
	const response = await makeShortcutRequest('/api/v3/workflows', ctx.key, {
		method: 'GET',
		path: {},
		query: undefined,
	});
	return ShortcutEndpointOutputSchemas['listWorkflows'].parse(response);
};

export const getWorkflow: ShortcutEndpoint<'getWorkflow'> = async (
	ctx,
	input,
) => {
	const parsed = ShortcutEndpointInputSchemas['getWorkflow'].parse(input);
	const response = await makeShortcutRequest(
		'/api/v3/workflows/{workflow-public-id}',
		ctx.key,
		{
			method: 'GET',
			path: { 'workflow-public-id': parsed.path.workflowPublicId },
			query: undefined,
		},
	);
	return ShortcutEndpointOutputSchemas['getWorkflow'].parse(response);
};
