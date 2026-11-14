import { makeShortcutRequest } from './client';
import {
	createCategory,
	createDoc,
	createEntityTemplate,
	createEpic,
	createEpicComment,
	createEpicCommentComment,
	createEpicHealth,
	createGroup,
	createIteration,
	createLabel,
	createLinkedFile,
	createMilestone,
	createMultipleStories,
	createObjective,
	createObjectiveHealth,
	createProject,
	createStory,
	createStoryComment,
	createStoryFromTemplate,
	createStoryLink,
	createStoryReaction,
	createTask,
	deleteCategory,
	deleteCustomField,
	deleteDoc,
	deleteEntityTemplate,
	deleteEpic,
	deleteEpicComment,
	deleteFile,
	deleteIteration,
	deleteLabel,
	deleteLinkedFile,
	deleteMilestone,
	deleteMultipleStories,
	deleteObjective,
	deleteProject,
	deleteStory,
	deleteStoryComment,
	deleteStoryLink,
	deleteStoryReaction,
	deleteTask,
	disableIterations,
	disableStoryTemplates,
	enableIterations,
	enableStoryTemplates,
	getCategory,
	getCurrentMemberInfo,
	getCustomField,
	getDoc,
	getEntityTemplate,
	getEpic,
	getEpicComment,
	getEpicHealth,
	getEpicWorkflow,
	getExternalLinkStories,
	getFile,
	getGroup,
	getIteration,
	getKeyResult,
	getLabel,
	getLinkedFile,
	getMember,
	getMilestone,
	getObjective,
	getObjectiveHealth,
	getProject,
	getRepository,
	getStory,
	getStoryComment,
	getStoryLink,
	getTask,
	getWorkflow,
	linkDocumentToEpic,
	listCategories,
	listCategoryMilestones,
	listCategoryObjectives,
	listCustomFields,
	listDocs,
	listDocumentEpics,
	listEntityTemplates,
	listEpicComments,
	listEpicDocuments,
	listEpicHealths,
	listEpicStories,
	listEpics,
	listEpicsPaginated,
	listFiles,
	listGroupStories,
	listGroups,
	listIterationStories,
	listIterations,
	listLabelEpics,
	listLabelStories,
	listLabels,
	listLinkedFiles,
	listMembers,
	listMilestoneEpics,
	listMilestones,
	listObjectiveEpics,
	listObjectiveHealths,
	listObjectives,
	listProjects,
	listRepositories,
	listStories,
	listStoryComment,
	listStorySubTasks,
	listWorkflows,
	queryStories,
	search,
	searchDocuments,
	searchEpics,
	searchIterations,
	searchMilestones,
	searchObjectives,
	searchStories,
	storyHistory,
	unlinkCommentThreadFromSlack,
	unlinkDocumentFromEpic,
	updateCategory,
	updateCustomField,
	updateDoc,
	updateEntityTemplate,
	updateEpic,
	updateEpicComment,
	updateFile,
	updateGroup,
	updateHealth,
	updateIteration,
	updateKeyResult,
	updateLabel,
	updateLinkedFile,
	updateMilestone,
	updateMultipleStories,
	updateObjective,
	updateProject,
	updateStory,
	updateStoryComment,
	updateStoryLink,
	updateTask,
	uploadFiles,
} from './endpoints/operations';
import { ShortcutEndpointInputSchemas } from './endpoints/types';
import { ShortcutTestInputs } from './test-fixtures';

jest.mock('./client', () => ({ makeShortcutRequest: jest.fn() }));
const requestMock = jest.mocked(makeShortcutRequest);
const ctx = { key: 'unit-test-token' };

beforeEach(() => requestMock.mockReset());

describe('Shortcut REST v3 operations', () => {
	it('GET /api/v3/categories', async () => {
		const input = ShortcutEndpointInputSchemas['listCategories'].parse(
			ShortcutTestInputs['listCategories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listCategories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/categories', async () => {
		const input = ShortcutEndpointInputSchemas['createCategory'].parse(
			ShortcutTestInputs['createCategory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createCategory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createCategory'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/categories/{category-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getCategory'].parse(
			ShortcutTestInputs['getCategory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getCategory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories/{category-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'category-public-id':
						ShortcutTestInputs['getCategory'].path.categoryPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/categories/{category-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateCategory'].parse(
			ShortcutTestInputs['updateCategory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateCategory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories/{category-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'category-public-id':
						ShortcutTestInputs['updateCategory'].path.categoryPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateCategory'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/categories/{category-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteCategory'].parse(
			ShortcutTestInputs['deleteCategory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteCategory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories/{category-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'category-public-id':
						ShortcutTestInputs['deleteCategory'].path.categoryPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/categories/{category-public-id}/milestones', async () => {
		const input = ShortcutEndpointInputSchemas['listCategoryMilestones'].parse(
			ShortcutTestInputs['listCategoryMilestones'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listCategoryMilestones(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories/{category-public-id}/milestones',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'category-public-id':
						ShortcutTestInputs['listCategoryMilestones'].path.categoryPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/categories/{category-public-id}/objectives', async () => {
		const input = ShortcutEndpointInputSchemas['listCategoryObjectives'].parse(
			ShortcutTestInputs['listCategoryObjectives'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listCategoryObjectives(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/categories/{category-public-id}/objectives',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'category-public-id':
						ShortcutTestInputs['listCategoryObjectives'].path.categoryPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/custom-fields', async () => {
		const input = ShortcutEndpointInputSchemas['listCustomFields'].parse(
			ShortcutTestInputs['listCustomFields'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listCustomFields(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/custom-fields',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/custom-fields/{custom-field-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getCustomField'].parse(
			ShortcutTestInputs['getCustomField'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getCustomField(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/custom-fields/{custom-field-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'custom-field-public-id':
						ShortcutTestInputs['getCustomField'].path.customFieldPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/custom-fields/{custom-field-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateCustomField'].parse(
			ShortcutTestInputs['updateCustomField'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateCustomField(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/custom-fields/{custom-field-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'custom-field-public-id':
						ShortcutTestInputs['updateCustomField'].path.customFieldPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateCustomField'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/custom-fields/{custom-field-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteCustomField'].parse(
			ShortcutTestInputs['deleteCustomField'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteCustomField(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/custom-fields/{custom-field-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'custom-field-public-id':
						ShortcutTestInputs['deleteCustomField'].path.customFieldPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/documents', async () => {
		const input = ShortcutEndpointInputSchemas['listDocs'].parse(
			ShortcutTestInputs['listDocs'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listDocs(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/documents', async () => {
		const input = ShortcutEndpointInputSchemas['createDoc'].parse(
			ShortcutTestInputs['createDoc'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createDoc(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createDoc'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/documents/{doc-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getDoc'].parse(
			ShortcutTestInputs['getDoc'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getDoc(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'doc-public-id': ShortcutTestInputs['getDoc'].path.docPublicId,
				},
				query: ShortcutTestInputs['getDoc'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/documents/{doc-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateDoc'].parse(
			ShortcutTestInputs['updateDoc'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateDoc(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'doc-public-id': ShortcutTestInputs['updateDoc'].path.docPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateDoc'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/documents/{doc-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteDoc'].parse(
			ShortcutTestInputs['deleteDoc'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteDoc(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'doc-public-id': ShortcutTestInputs['deleteDoc'].path.docPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['deleteDoc'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/documents/{doc-public-id}/epics', async () => {
		const input = ShortcutEndpointInputSchemas['listDocumentEpics'].parse(
			ShortcutTestInputs['listDocumentEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listDocumentEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'doc-public-id':
						ShortcutTestInputs['listDocumentEpics'].path.docPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/documents/{doc-public-id}/epics/{epic-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['linkDocumentToEpic'].parse(
			ShortcutTestInputs['linkDocumentToEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(linkDocumentToEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'doc-public-id':
						ShortcutTestInputs['linkDocumentToEpic'].path.docPublicId,
					'epic-public-id':
						ShortcutTestInputs['linkDocumentToEpic'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/documents/{doc-public-id}/epics/{epic-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['unlinkDocumentFromEpic'].parse(
			ShortcutTestInputs['unlinkDocumentFromEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(unlinkDocumentFromEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/documents/{doc-public-id}/epics/{epic-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'doc-public-id':
						ShortcutTestInputs['unlinkDocumentFromEpic'].path.docPublicId,
					'epic-public-id':
						ShortcutTestInputs['unlinkDocumentFromEpic'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/entity-templates', async () => {
		const input = ShortcutEndpointInputSchemas['listEntityTemplates'].parse(
			ShortcutTestInputs['listEntityTemplates'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEntityTemplates(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/entity-templates', async () => {
		const input = ShortcutEndpointInputSchemas['createEntityTemplate'].parse(
			ShortcutTestInputs['createEntityTemplate'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createEntityTemplate(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createEntityTemplate'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/entity-templates/disable', async () => {
		const input = ShortcutEndpointInputSchemas['disableStoryTemplates'].parse(
			ShortcutTestInputs['disableStoryTemplates'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(disableStoryTemplates(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates/disable',
			'unit-test-token',
			{ method: 'PUT', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/entity-templates/enable', async () => {
		const input = ShortcutEndpointInputSchemas['enableStoryTemplates'].parse(
			ShortcutTestInputs['enableStoryTemplates'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(enableStoryTemplates(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates/enable',
			'unit-test-token',
			{ method: 'PUT', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/entity-templates/{entity-template-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getEntityTemplate'].parse(
			ShortcutTestInputs['getEntityTemplate'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getEntityTemplate(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates/{entity-template-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'entity-template-public-id':
						ShortcutTestInputs['getEntityTemplate'].path.entityTemplatePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/entity-templates/{entity-template-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateEntityTemplate'].parse(
			ShortcutTestInputs['updateEntityTemplate'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateEntityTemplate(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates/{entity-template-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'entity-template-public-id':
						ShortcutTestInputs['updateEntityTemplate'].path
							.entityTemplatePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateEntityTemplate'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/entity-templates/{entity-template-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteEntityTemplate'].parse(
			ShortcutTestInputs['deleteEntityTemplate'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteEntityTemplate(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/entity-templates/{entity-template-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'entity-template-public-id':
						ShortcutTestInputs['deleteEntityTemplate'].path
							.entityTemplatePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epic-workflow', async () => {
		const input = ShortcutEndpointInputSchemas['getEpicWorkflow'].parse(
			ShortcutTestInputs['getEpicWorkflow'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getEpicWorkflow(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epic-workflow',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics', async () => {
		const input = ShortcutEndpointInputSchemas['listEpics'].parse(
			ShortcutTestInputs['listEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['listEpics'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/epics', async () => {
		const input = ShortcutEndpointInputSchemas['createEpic'].parse(
			ShortcutTestInputs['createEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createEpic'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/paginated', async () => {
		const input = ShortcutEndpointInputSchemas['listEpicsPaginated'].parse(
			ShortcutTestInputs['listEpicsPaginated'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpicsPaginated(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/paginated',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['listEpicsPaginated'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getEpic'].parse(
			ShortcutTestInputs['getEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id': ShortcutTestInputs['getEpic'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/epics/{epic-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateEpic'].parse(
			ShortcutTestInputs['updateEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'epic-public-id': ShortcutTestInputs['updateEpic'].path.epicPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateEpic'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/epics/{epic-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteEpic'].parse(
			ShortcutTestInputs['deleteEpic'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteEpic(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'epic-public-id': ShortcutTestInputs['deleteEpic'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/comments', async () => {
		const input = ShortcutEndpointInputSchemas['listEpicComments'].parse(
			ShortcutTestInputs['listEpicComments'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpicComments(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['listEpicComments'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/epics/{epic-public-id}/comments', async () => {
		const input = ShortcutEndpointInputSchemas['createEpicComment'].parse(
			ShortcutTestInputs['createEpicComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createEpicComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'epic-public-id':
						ShortcutTestInputs['createEpicComment'].path.epicPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createEpicComment'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/epics/{epic-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas[
			'createEpicCommentComment'
		].parse(ShortcutTestInputs['createEpicCommentComment']);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createEpicCommentComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'epic-public-id':
						ShortcutTestInputs['createEpicCommentComment'].path.epicPublicId,
					'comment-public-id':
						ShortcutTestInputs['createEpicCommentComment'].path.commentPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createEpicCommentComment'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getEpicComment'].parse(
			ShortcutTestInputs['getEpicComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getEpicComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['getEpicComment'].path.epicPublicId,
					'comment-public-id':
						ShortcutTestInputs['getEpicComment'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/epics/{epic-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateEpicComment'].parse(
			ShortcutTestInputs['updateEpicComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateEpicComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'epic-public-id':
						ShortcutTestInputs['updateEpicComment'].path.epicPublicId,
					'comment-public-id':
						ShortcutTestInputs['updateEpicComment'].path.commentPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateEpicComment'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/epics/{epic-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteEpicComment'].parse(
			ShortcutTestInputs['deleteEpicComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteEpicComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'epic-public-id':
						ShortcutTestInputs['deleteEpicComment'].path.epicPublicId,
					'comment-public-id':
						ShortcutTestInputs['deleteEpicComment'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/documents', async () => {
		const input = ShortcutEndpointInputSchemas['listEpicDocuments'].parse(
			ShortcutTestInputs['listEpicDocuments'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpicDocuments(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/documents',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['listEpicDocuments'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/health', async () => {
		const input = ShortcutEndpointInputSchemas['getEpicHealth'].parse(
			ShortcutTestInputs['getEpicHealth'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getEpicHealth(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/health',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['getEpicHealth'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/epics/{epic-public-id}/health', async () => {
		const input = ShortcutEndpointInputSchemas['createEpicHealth'].parse(
			ShortcutTestInputs['createEpicHealth'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createEpicHealth(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/health',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'epic-public-id':
						ShortcutTestInputs['createEpicHealth'].path.epicPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createEpicHealth'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/health-history', async () => {
		const input = ShortcutEndpointInputSchemas['listEpicHealths'].parse(
			ShortcutTestInputs['listEpicHealths'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpicHealths(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/health-history',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['listEpicHealths'].path.epicPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/epics/{epic-public-id}/stories', async () => {
		const input = ShortcutEndpointInputSchemas['listEpicStories'].parse(
			ShortcutTestInputs['listEpicStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listEpicStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/epics/{epic-public-id}/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'epic-public-id':
						ShortcutTestInputs['listEpicStories'].path.epicPublicId,
				},
				query: ShortcutTestInputs['listEpicStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/external-link/stories', async () => {
		const input = ShortcutEndpointInputSchemas['getExternalLinkStories'].parse(
			ShortcutTestInputs['getExternalLinkStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getExternalLinkStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/external-link/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['getExternalLinkStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/files', async () => {
		const input = ShortcutEndpointInputSchemas['listFiles'].parse(
			ShortcutTestInputs['listFiles'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listFiles(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/files',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/files', async () => {
		const input = ShortcutEndpointInputSchemas['uploadFiles'].parse({
			...ShortcutTestInputs['uploadFiles'],
			body: {
				...ShortcutTestInputs['uploadFiles'].body,
				file0: new Blob(['sample']),
			},
		});
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(uploadFiles(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/files',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: undefined,
				formData: {
					...ShortcutTestInputs['uploadFiles'],
					body: {
						...ShortcutTestInputs['uploadFiles'].body,
						file0: new Blob(['sample']),
					},
				}.body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/files/{file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getFile'].parse(
			ShortcutTestInputs['getFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/files/{file-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'file-public-id': ShortcutTestInputs['getFile'].path.filePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/files/{file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateFile'].parse(
			ShortcutTestInputs['updateFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/files/{file-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'file-public-id': ShortcutTestInputs['updateFile'].path.filePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateFile'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/files/{file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteFile'].parse(
			ShortcutTestInputs['deleteFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/files/{file-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'file-public-id': ShortcutTestInputs['deleteFile'].path.filePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/groups', async () => {
		const input = ShortcutEndpointInputSchemas['listGroups'].parse(
			ShortcutTestInputs['listGroups'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listGroups(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/groups',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['listGroups'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/groups', async () => {
		const input = ShortcutEndpointInputSchemas['createGroup'].parse(
			ShortcutTestInputs['createGroup'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createGroup(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/groups',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createGroup'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/groups/{group-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getGroup'].parse(
			ShortcutTestInputs['getGroup'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getGroup(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/groups/{group-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'group-public-id': ShortcutTestInputs['getGroup'].path.groupPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/groups/{group-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateGroup'].parse(
			ShortcutTestInputs['updateGroup'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateGroup(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/groups/{group-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'group-public-id':
						ShortcutTestInputs['updateGroup'].path.groupPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateGroup'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/groups/{group-public-id}/stories', async () => {
		const input = ShortcutEndpointInputSchemas['listGroupStories'].parse(
			ShortcutTestInputs['listGroupStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listGroupStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/groups/{group-public-id}/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'group-public-id':
						ShortcutTestInputs['listGroupStories'].path.groupPublicId,
				},
				query: ShortcutTestInputs['listGroupStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/health/{health-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateHealth'].parse(
			ShortcutTestInputs['updateHealth'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateHealth(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/health/{health-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'health-public-id':
						ShortcutTestInputs['updateHealth'].path.healthPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateHealth'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/iterations', async () => {
		const input = ShortcutEndpointInputSchemas['listIterations'].parse(
			ShortcutTestInputs['listIterations'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listIterations(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/iterations', async () => {
		const input = ShortcutEndpointInputSchemas['createIteration'].parse(
			ShortcutTestInputs['createIteration'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createIteration(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createIteration'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/iterations/disable', async () => {
		const input = ShortcutEndpointInputSchemas['disableIterations'].parse(
			ShortcutTestInputs['disableIterations'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(disableIterations(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/disable',
			'unit-test-token',
			{ method: 'PUT', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/iterations/enable', async () => {
		const input = ShortcutEndpointInputSchemas['enableIterations'].parse(
			ShortcutTestInputs['enableIterations'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(enableIterations(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/enable',
			'unit-test-token',
			{ method: 'PUT', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/iterations/{iteration-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getIteration'].parse(
			ShortcutTestInputs['getIteration'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getIteration(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/{iteration-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'iteration-public-id':
						ShortcutTestInputs['getIteration'].path.iterationPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/iterations/{iteration-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateIteration'].parse(
			ShortcutTestInputs['updateIteration'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateIteration(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/{iteration-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'iteration-public-id':
						ShortcutTestInputs['updateIteration'].path.iterationPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateIteration'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/iterations/{iteration-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteIteration'].parse(
			ShortcutTestInputs['deleteIteration'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteIteration(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/{iteration-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'iteration-public-id':
						ShortcutTestInputs['deleteIteration'].path.iterationPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/iterations/{iteration-public-id}/stories', async () => {
		const input = ShortcutEndpointInputSchemas['listIterationStories'].parse(
			ShortcutTestInputs['listIterationStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listIterationStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/iterations/{iteration-public-id}/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'iteration-public-id':
						ShortcutTestInputs['listIterationStories'].path.iterationPublicId,
				},
				query: ShortcutTestInputs['listIterationStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/key-results/{key-result-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getKeyResult'].parse(
			ShortcutTestInputs['getKeyResult'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getKeyResult(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/key-results/{key-result-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'key-result-public-id':
						ShortcutTestInputs['getKeyResult'].path.keyResultPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/key-results/{key-result-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateKeyResult'].parse(
			ShortcutTestInputs['updateKeyResult'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateKeyResult(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/key-results/{key-result-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'key-result-public-id':
						ShortcutTestInputs['updateKeyResult'].path.keyResultPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateKeyResult'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/labels', async () => {
		const input = ShortcutEndpointInputSchemas['listLabels'].parse(
			ShortcutTestInputs['listLabels'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listLabels(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['listLabels'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/labels', async () => {
		const input = ShortcutEndpointInputSchemas['createLabel'].parse(
			ShortcutTestInputs['createLabel'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createLabel(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createLabel'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/labels/{label-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getLabel'].parse(
			ShortcutTestInputs['getLabel'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getLabel(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels/{label-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'label-public-id': ShortcutTestInputs['getLabel'].path.labelPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/labels/{label-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateLabel'].parse(
			ShortcutTestInputs['updateLabel'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateLabel(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels/{label-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'label-public-id':
						ShortcutTestInputs['updateLabel'].path.labelPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateLabel'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/labels/{label-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteLabel'].parse(
			ShortcutTestInputs['deleteLabel'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteLabel(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels/{label-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'label-public-id':
						ShortcutTestInputs['deleteLabel'].path.labelPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/labels/{label-public-id}/epics', async () => {
		const input = ShortcutEndpointInputSchemas['listLabelEpics'].parse(
			ShortcutTestInputs['listLabelEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listLabelEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels/{label-public-id}/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'label-public-id':
						ShortcutTestInputs['listLabelEpics'].path.labelPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/labels/{label-public-id}/stories', async () => {
		const input = ShortcutEndpointInputSchemas['listLabelStories'].parse(
			ShortcutTestInputs['listLabelStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listLabelStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/labels/{label-public-id}/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'label-public-id':
						ShortcutTestInputs['listLabelStories'].path.labelPublicId,
				},
				query: ShortcutTestInputs['listLabelStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/linked-files', async () => {
		const input = ShortcutEndpointInputSchemas['listLinkedFiles'].parse(
			ShortcutTestInputs['listLinkedFiles'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listLinkedFiles(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/linked-files',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/linked-files', async () => {
		const input = ShortcutEndpointInputSchemas['createLinkedFile'].parse(
			ShortcutTestInputs['createLinkedFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createLinkedFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/linked-files',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createLinkedFile'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/linked-files/{linked-file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getLinkedFile'].parse(
			ShortcutTestInputs['getLinkedFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getLinkedFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/linked-files/{linked-file-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'linked-file-public-id':
						ShortcutTestInputs['getLinkedFile'].path.linkedFilePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/linked-files/{linked-file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateLinkedFile'].parse(
			ShortcutTestInputs['updateLinkedFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateLinkedFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/linked-files/{linked-file-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'linked-file-public-id':
						ShortcutTestInputs['updateLinkedFile'].path.linkedFilePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateLinkedFile'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/linked-files/{linked-file-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteLinkedFile'].parse(
			ShortcutTestInputs['deleteLinkedFile'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteLinkedFile(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/linked-files/{linked-file-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'linked-file-public-id':
						ShortcutTestInputs['deleteLinkedFile'].path.linkedFilePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/member', async () => {
		const input = ShortcutEndpointInputSchemas['getCurrentMemberInfo'].parse(
			ShortcutTestInputs['getCurrentMemberInfo'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getCurrentMemberInfo(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/member',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/members', async () => {
		const input = ShortcutEndpointInputSchemas['listMembers'].parse(
			ShortcutTestInputs['listMembers'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listMembers(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/members',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['listMembers'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/members/{member-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getMember'].parse(
			ShortcutTestInputs['getMember'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getMember(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/members/{member-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'member-public-id':
						ShortcutTestInputs['getMember'].path.memberPublicId,
				},
				query: ShortcutTestInputs['getMember'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/milestones', async () => {
		const input = ShortcutEndpointInputSchemas['listMilestones'].parse(
			ShortcutTestInputs['listMilestones'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listMilestones(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/milestones', async () => {
		const input = ShortcutEndpointInputSchemas['createMilestone'].parse(
			ShortcutTestInputs['createMilestone'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createMilestone(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createMilestone'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/milestones/{milestone-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getMilestone'].parse(
			ShortcutTestInputs['getMilestone'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getMilestone(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones/{milestone-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'milestone-public-id':
						ShortcutTestInputs['getMilestone'].path.milestonePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/milestones/{milestone-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateMilestone'].parse(
			ShortcutTestInputs['updateMilestone'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateMilestone(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones/{milestone-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'milestone-public-id':
						ShortcutTestInputs['updateMilestone'].path.milestonePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateMilestone'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/milestones/{milestone-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteMilestone'].parse(
			ShortcutTestInputs['deleteMilestone'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteMilestone(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones/{milestone-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'milestone-public-id':
						ShortcutTestInputs['deleteMilestone'].path.milestonePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/milestones/{milestone-public-id}/epics', async () => {
		const input = ShortcutEndpointInputSchemas['listMilestoneEpics'].parse(
			ShortcutTestInputs['listMilestoneEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listMilestoneEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/milestones/{milestone-public-id}/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'milestone-public-id':
						ShortcutTestInputs['listMilestoneEpics'].path.milestonePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/objectives', async () => {
		const input = ShortcutEndpointInputSchemas['listObjectives'].parse(
			ShortcutTestInputs['listObjectives'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listObjectives(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/objectives', async () => {
		const input = ShortcutEndpointInputSchemas['createObjective'].parse(
			ShortcutTestInputs['createObjective'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createObjective(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createObjective'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/objectives/{objective-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getObjective'].parse(
			ShortcutTestInputs['getObjective'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getObjective(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'objective-public-id':
						ShortcutTestInputs['getObjective'].path.objectivePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/objectives/{objective-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateObjective'].parse(
			ShortcutTestInputs['updateObjective'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateObjective(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'objective-public-id':
						ShortcutTestInputs['updateObjective'].path.objectivePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateObjective'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/objectives/{objective-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteObjective'].parse(
			ShortcutTestInputs['deleteObjective'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteObjective(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'objective-public-id':
						ShortcutTestInputs['deleteObjective'].path.objectivePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/objectives/{objective-public-id}/epics', async () => {
		const input = ShortcutEndpointInputSchemas['listObjectiveEpics'].parse(
			ShortcutTestInputs['listObjectiveEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listObjectiveEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'objective-public-id':
						ShortcutTestInputs['listObjectiveEpics'].path.objectivePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/objectives/{objective-public-id}/health', async () => {
		const input = ShortcutEndpointInputSchemas['getObjectiveHealth'].parse(
			ShortcutTestInputs['getObjectiveHealth'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getObjectiveHealth(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}/health',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'objective-public-id':
						ShortcutTestInputs['getObjectiveHealth'].path.objectivePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/objectives/{objective-public-id}/health', async () => {
		const input = ShortcutEndpointInputSchemas['createObjectiveHealth'].parse(
			ShortcutTestInputs['createObjectiveHealth'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createObjectiveHealth(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}/health',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'objective-public-id':
						ShortcutTestInputs['createObjectiveHealth'].path.objectivePublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createObjectiveHealth'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/objectives/{objective-public-id}/health-history', async () => {
		const input = ShortcutEndpointInputSchemas['listObjectiveHealths'].parse(
			ShortcutTestInputs['listObjectiveHealths'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listObjectiveHealths(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/objectives/{objective-public-id}/health-history',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'objective-public-id':
						ShortcutTestInputs['listObjectiveHealths'].path.objectivePublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/projects', async () => {
		const input = ShortcutEndpointInputSchemas['listProjects'].parse(
			ShortcutTestInputs['listProjects'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listProjects(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/projects', async () => {
		const input = ShortcutEndpointInputSchemas['createProject'].parse(
			ShortcutTestInputs['createProject'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createProject(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createProject'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/projects/{project-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getProject'].parse(
			ShortcutTestInputs['getProject'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getProject(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects/{project-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'project-public-id':
						ShortcutTestInputs['getProject'].path.projectPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/projects/{project-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateProject'].parse(
			ShortcutTestInputs['updateProject'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateProject(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects/{project-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'project-public-id':
						ShortcutTestInputs['updateProject'].path.projectPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateProject'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/projects/{project-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteProject'].parse(
			ShortcutTestInputs['deleteProject'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteProject(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects/{project-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'project-public-id':
						ShortcutTestInputs['deleteProject'].path.projectPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/projects/{project-public-id}/stories', async () => {
		const input = ShortcutEndpointInputSchemas['listStories'].parse(
			ShortcutTestInputs['listStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/projects/{project-public-id}/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'project-public-id':
						ShortcutTestInputs['listStories'].path.projectPublicId,
				},
				query: ShortcutTestInputs['listStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/repositories', async () => {
		const input = ShortcutEndpointInputSchemas['listRepositories'].parse(
			ShortcutTestInputs['listRepositories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listRepositories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/repositories',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/repositories/{repo-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getRepository'].parse(
			ShortcutTestInputs['getRepository'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getRepository(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/repositories/{repo-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'repo-public-id':
						ShortcutTestInputs['getRepository'].path.repoPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search', async () => {
		const input = ShortcutEndpointInputSchemas['search'].parse(
			ShortcutTestInputs['search'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(search(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['search'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/documents', async () => {
		const input = ShortcutEndpointInputSchemas['searchDocuments'].parse(
			ShortcutTestInputs['searchDocuments'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchDocuments(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/documents',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchDocuments'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/epics', async () => {
		const input = ShortcutEndpointInputSchemas['searchEpics'].parse(
			ShortcutTestInputs['searchEpics'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchEpics(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/epics',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchEpics'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/iterations', async () => {
		const input = ShortcutEndpointInputSchemas['searchIterations'].parse(
			ShortcutTestInputs['searchIterations'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchIterations(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/iterations',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchIterations'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/milestones', async () => {
		const input = ShortcutEndpointInputSchemas['searchMilestones'].parse(
			ShortcutTestInputs['searchMilestones'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchMilestones(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/milestones',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchMilestones'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/objectives', async () => {
		const input = ShortcutEndpointInputSchemas['searchObjectives'].parse(
			ShortcutTestInputs['searchObjectives'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchObjectives(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/objectives',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchObjectives'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/search/stories', async () => {
		const input = ShortcutEndpointInputSchemas['searchStories'].parse(
			ShortcutTestInputs['searchStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(searchStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/search/stories',
			'unit-test-token',
			{
				method: 'GET',
				path: {},
				query: ShortcutTestInputs['searchStories'].query,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories', async () => {
		const input = ShortcutEndpointInputSchemas['createStory'].parse(
			ShortcutTestInputs['createStory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createStory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createStory'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/bulk', async () => {
		const input = ShortcutEndpointInputSchemas['createMultipleStories'].parse(
			ShortcutTestInputs['createMultipleStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createMultipleStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/bulk',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createMultipleStories'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/stories/bulk', async () => {
		const input = ShortcutEndpointInputSchemas['updateMultipleStories'].parse(
			ShortcutTestInputs['updateMultipleStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateMultipleStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/bulk',
			'unit-test-token',
			{
				method: 'PUT',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['updateMultipleStories'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/stories/bulk', async () => {
		const input = ShortcutEndpointInputSchemas['deleteMultipleStories'].parse(
			ShortcutTestInputs['deleteMultipleStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteMultipleStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/bulk',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['deleteMultipleStories'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/from-template', async () => {
		const input = ShortcutEndpointInputSchemas['createStoryFromTemplate'].parse(
			ShortcutTestInputs['createStoryFromTemplate'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createStoryFromTemplate(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/from-template',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createStoryFromTemplate'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/search', async () => {
		const input = ShortcutEndpointInputSchemas['queryStories'].parse(
			ShortcutTestInputs['queryStories'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(queryStories(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/search',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['queryStories'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getStory'].parse(
			ShortcutTestInputs['getStory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getStory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id': ShortcutTestInputs['getStory'].path.storyPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/stories/{story-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateStory'].parse(
			ShortcutTestInputs['updateStory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateStory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'story-public-id':
						ShortcutTestInputs['updateStory'].path.storyPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateStory'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/stories/{story-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteStory'].parse(
			ShortcutTestInputs['deleteStory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteStory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'story-public-id':
						ShortcutTestInputs['deleteStory'].path.storyPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}/comments', async () => {
		const input = ShortcutEndpointInputSchemas['listStoryComment'].parse(
			ShortcutTestInputs['listStoryComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listStoryComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id':
						ShortcutTestInputs['listStoryComment'].path.storyPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/{story-public-id}/comments', async () => {
		const input = ShortcutEndpointInputSchemas['createStoryComment'].parse(
			ShortcutTestInputs['createStoryComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createStoryComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'story-public-id':
						ShortcutTestInputs['createStoryComment'].path.storyPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createStoryComment'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getStoryComment'].parse(
			ShortcutTestInputs['getStoryComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getStoryComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id':
						ShortcutTestInputs['getStoryComment'].path.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['getStoryComment'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/stories/{story-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateStoryComment'].parse(
			ShortcutTestInputs['updateStoryComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateStoryComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'story-public-id':
						ShortcutTestInputs['updateStoryComment'].path.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['updateStoryComment'].path.commentPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateStoryComment'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/stories/{story-public-id}/comments/{comment-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteStoryComment'].parse(
			ShortcutTestInputs['deleteStoryComment'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteStoryComment(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'story-public-id':
						ShortcutTestInputs['deleteStoryComment'].path.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['deleteStoryComment'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions', async () => {
		const input = ShortcutEndpointInputSchemas['createStoryReaction'].parse(
			ShortcutTestInputs['createStoryReaction'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createStoryReaction(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'story-public-id':
						ShortcutTestInputs['createStoryReaction'].path.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['createStoryReaction'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions', async () => {
		const input = ShortcutEndpointInputSchemas['deleteStoryReaction'].parse(
			ShortcutTestInputs['deleteStoryReaction'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteStoryReaction(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'story-public-id':
						ShortcutTestInputs['deleteStoryReaction'].path.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['deleteStoryReaction'].path.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/{story-public-id}/comments/{comment-public-id}/unlink-from-slack', async () => {
		const input = ShortcutEndpointInputSchemas[
			'unlinkCommentThreadFromSlack'
		].parse(ShortcutTestInputs['unlinkCommentThreadFromSlack']);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(unlinkCommentThreadFromSlack(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/comments/{comment-public-id}/unlink-from-slack',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'story-public-id':
						ShortcutTestInputs['unlinkCommentThreadFromSlack'].path
							.storyPublicId,
					'comment-public-id':
						ShortcutTestInputs['unlinkCommentThreadFromSlack'].path
							.commentPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}/history', async () => {
		const input = ShortcutEndpointInputSchemas['storyHistory'].parse(
			ShortcutTestInputs['storyHistory'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(storyHistory(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/history',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id':
						ShortcutTestInputs['storyHistory'].path.storyPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}/sub-tasks', async () => {
		const input = ShortcutEndpointInputSchemas['listStorySubTasks'].parse(
			ShortcutTestInputs['listStorySubTasks'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listStorySubTasks(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/sub-tasks',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id':
						ShortcutTestInputs['listStorySubTasks'].path.storyPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/stories/{story-public-id}/tasks', async () => {
		const input = ShortcutEndpointInputSchemas['createTask'].parse(
			ShortcutTestInputs['createTask'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createTask(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/tasks',
			'unit-test-token',
			{
				method: 'POST',
				path: {
					'story-public-id':
						ShortcutTestInputs['createTask'].path.storyPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['createTask'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/stories/{story-public-id}/tasks/{task-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getTask'].parse(
			ShortcutTestInputs['getTask'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getTask(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-public-id': ShortcutTestInputs['getTask'].path.storyPublicId,
					'task-public-id': ShortcutTestInputs['getTask'].path.taskPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/stories/{story-public-id}/tasks/{task-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateTask'].parse(
			ShortcutTestInputs['updateTask'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateTask(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'story-public-id':
						ShortcutTestInputs['updateTask'].path.storyPublicId,
					'task-public-id': ShortcutTestInputs['updateTask'].path.taskPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateTask'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/stories/{story-public-id}/tasks/{task-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteTask'].parse(
			ShortcutTestInputs['deleteTask'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteTask(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/stories/{story-public-id}/tasks/{task-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'story-public-id':
						ShortcutTestInputs['deleteTask'].path.storyPublicId,
					'task-public-id': ShortcutTestInputs['deleteTask'].path.taskPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('POST /api/v3/story-links', async () => {
		const input = ShortcutEndpointInputSchemas['createStoryLink'].parse(
			ShortcutTestInputs['createStoryLink'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(createStoryLink(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/story-links',
			'unit-test-token',
			{
				method: 'POST',
				path: {},
				query: undefined,
				body: ShortcutTestInputs['createStoryLink'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/story-links/{story-link-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getStoryLink'].parse(
			ShortcutTestInputs['getStoryLink'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getStoryLink(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/story-links/{story-link-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'story-link-public-id':
						ShortcutTestInputs['getStoryLink'].path.storyLinkPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('PUT /api/v3/story-links/{story-link-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['updateStoryLink'].parse(
			ShortcutTestInputs['updateStoryLink'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(updateStoryLink(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/story-links/{story-link-public-id}',
			'unit-test-token',
			{
				method: 'PUT',
				path: {
					'story-link-public-id':
						ShortcutTestInputs['updateStoryLink'].path.storyLinkPublicId,
				},
				query: undefined,
				body: ShortcutTestInputs['updateStoryLink'].body,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('DELETE /api/v3/story-links/{story-link-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['deleteStoryLink'].parse(
			ShortcutTestInputs['deleteStoryLink'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(deleteStoryLink(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/story-links/{story-link-public-id}',
			'unit-test-token',
			{
				method: 'DELETE',
				path: {
					'story-link-public-id':
						ShortcutTestInputs['deleteStoryLink'].path.storyLinkPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/workflows', async () => {
		const input = ShortcutEndpointInputSchemas['listWorkflows'].parse(
			ShortcutTestInputs['listWorkflows'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(listWorkflows(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/workflows',
			'unit-test-token',
			{ method: 'GET', path: {}, query: undefined, body: undefined },
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
	it('GET /api/v3/workflows/{workflow-public-id}', async () => {
		const input = ShortcutEndpointInputSchemas['getWorkflow'].parse(
			ShortcutTestInputs['getWorkflow'],
		);
		requestMock.mockResolvedValueOnce(Symbol('invalid provider response'));
		await expect(getWorkflow(ctx, input)).rejects.toThrow();
		expect(requestMock).toHaveBeenCalledWith(
			'/api/v3/workflows/{workflow-public-id}',
			'unit-test-token',
			{
				method: 'GET',
				path: {
					'workflow-public-id':
						ShortcutTestInputs['getWorkflow'].path.workflowPublicId,
				},
				query: undefined,
				body: undefined,
			},
		);
		expect(requestMock).toHaveBeenCalledTimes(1);
	});
});
