import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeTeamworkRequest } from '../client';
import type { TeamworkContext } from '../index';
import {
	getTeamworkInputSchema,
	getTeamworkOutputSchema,
} from './openapi-schema';
import type {
	TeamworkEndpointInputs,
	TeamworkEndpointOutputs,
	TeamworkOperationId,
} from './operation-types';
import { TEAMWORK_OPERATION_IDS } from './operation-types';
import type { TeamworkOperationDefinition } from './types';
import { teamworkOperations } from './types';

export type TeamworkOperationEndpoint<Id extends TeamworkOperationId> =
	CorsairEndpoint<
		TeamworkContext,
		TeamworkEndpointInputs[Id],
		TeamworkEndpointOutputs[Id]
	>;

export async function resolveTeamworkSiteName(
	siteNameOverride: string | undefined,
	keys: Pick<TeamworkContext['keys'], 'get_site_name'> | undefined,
): Promise<string> {
	const siteName = siteNameOverride ?? (await keys?.get_site_name()) ?? '';
	if (!siteName) throw new Error('A Teamwork site name is required');
	return siteName;
}

function findOperation(id: TeamworkOperationId): TeamworkOperationDefinition {
	const operation = teamworkOperations.find((candidate) => candidate.id === id);
	if (!operation) throw new Error('Teamwork operation is unavailable');
	return operation;
}

// `unknown` is necessary because each OpenAPI query parameter has its own scalar or array value type.
export function serializeTeamworkQuery(
	operation: TeamworkOperationDefinition,
	query: Record<string, unknown>,
): Record<string, unknown> {
	const serialized = { ...query };
	for (const parameter of operation.parameters) {
		if (parameter.in !== 'query' || parameter.type !== 'array') continue;
		const value = serialized[parameter.name];
		if (!Array.isArray(value) || parameter.collectionFormat === 'multi')
			continue;
		const collectionFormat = parameter.collectionFormat ?? 'csv';
		const separator =
			collectionFormat === 'csv'
				? ','
				: collectionFormat === 'ssv'
					? ' '
					: collectionFormat === 'tsv'
						? '\t'
						: collectionFormat === 'pipes'
							? '|'
							: undefined;
		if (separator === undefined) {
			throw new Error('Unsupported Teamwork query collection format');
		}
		serialized[parameter.name] = value
			.map((item) => String(item))
			.join(separator);
	}
	return serialized;
}

export function createTeamworkOperationEndpoint<Id extends TeamworkOperationId>(
	id: Id,
): TeamworkOperationEndpoint<Id> {
	const operation = findOperation(id);
	return async (ctx, input) => {
		const inputSchema = getTeamworkInputSchema(id);
		// Every response field is optional, so sparse `fields[...]` selections parse too.
		const outputSchema = getTeamworkOutputSchema(id);
		const parsedInput = inputSchema.safeParse(input);
		if (!parsedInput.success) {
			throw new Error('Invalid Teamwork endpoint input');
		}
		// Send what was validated, not the caller's object, which could change during the awaits below.
		// `unknown` is necessary because path, query and body shapes differ per operation; each was just validated.
		const valid = parsedInput.data as {
			path?: Record<string, unknown>;
			query?: Record<string, unknown>;
			body?: unknown;
		};

		const siteName = await resolveTeamworkSiteName(
			ctx.options.siteName,
			ctx.keys,
		);
		const response = await makeTeamworkRequest({
			apiKey: ctx.key,
			siteName,
			version: operation.version,
			method: operation.method,
			path: operation.path,
			pathParameters: valid.path ?? {},
			query: serializeTeamworkQuery(operation, valid.query ?? {}),
			body: valid.body,
		});

		// `unknown` is necessary because provider response JSON is narrowed by the documented output schema.
		const typedOutputSchema = z.custom<TeamworkEndpointOutputs[Id]>(
			(candidate: unknown) => outputSchema.safeParse(candidate).success,
		);
		let parsedOutput: TeamworkEndpointOutputs[Id];
		try {
			parsedOutput = typedOutputSchema.parse(response);
		} catch {
			throw new Error('Teamwork response did not match its documented schema');
		}

		await logEventFromContext(
			ctx,
			'teamwork.operation',
			{ operationId: operation.id },
			'completed',
		);
		return parsedOutput;
	};
}

export const teamworkOperationsNested = {
	projects: {
		list: createTeamworkOperationEndpoint('projects.list'),
		listStarred: createTeamworkOperationEndpoint('projects.listStarred'),
		get: createTeamworkOperationEndpoint('projects.get'),
		create: createTeamworkOperationEndpoint('projects.create'),
		update: createTeamworkOperationEndpoint('projects.update'),
		delete: createTeamworkOperationEndpoint('projects.delete'),
		clone: createTeamworkOperationEndpoint('projects.clone'),
		star: createTeamworkOperationEndpoint('projects.star'),
		getStats: createTeamworkOperationEndpoint('projects.getStats'),
		getRates: createTeamworkOperationEndpoint('projects.getRates'),
		setRates: createTeamworkOperationEndpoint('projects.setRates'),
		convertTentative: createTeamworkOperationEndpoint(
			'projects.convertTentative',
		),
		listTaskPredecessors: createTeamworkOperationEndpoint(
			'projects.listTaskPredecessors',
		),
	},
	projectMetrics: {
		billable: createTeamworkOperationEndpoint('projectMetrics.billable'),
		health: createTeamworkOperationEndpoint('projectMetrics.health'),
		invoices: createTeamworkOperationEndpoint('projectMetrics.invoices'),
		unbilled: createTeamworkOperationEndpoint('projectMetrics.unbilled'),
	},
	projectTemplates: {
		list: createTeamworkOperationEndpoint('projectTemplates.list'),
		get: createTeamworkOperationEndpoint('projectTemplates.get'),
		listRequiredCustomFields: createTeamworkOperationEndpoint(
			'projectTemplates.listRequiredCustomFields',
		),
		create: createTeamworkOperationEndpoint('projectTemplates.create'),
	},
	projectCategories: {
		list: createTeamworkOperationEndpoint('projectCategories.list'),
		get: createTeamworkOperationEndpoint('projectCategories.get'),
		create: createTeamworkOperationEndpoint('projectCategories.create'),
		update: createTeamworkOperationEndpoint('projectCategories.update'),
		delete: createTeamworkOperationEndpoint('projectCategories.delete'),
	},
	projectUpdates: {
		list: createTeamworkOperationEndpoint('projectUpdates.list'),
		create: createTeamworkOperationEndpoint('projectUpdates.create'),
		update: createTeamworkOperationEndpoint('projectUpdates.update'),
		delete: createTeamworkOperationEndpoint('projectUpdates.delete'),
		request: createTeamworkOperationEndpoint('projectUpdates.request'),
	},
	projectPeople: {
		list: createTeamworkOperationEndpoint('projectPeople.list'),
		get: createTeamworkOperationEndpoint('projectPeople.get'),
		getPermissions: createTeamworkOperationEndpoint(
			'projectPeople.getPermissions',
		),
		add: createTeamworkOperationEndpoint('projectPeople.add'),
		remove: createTeamworkOperationEndpoint('projectPeople.remove'),
	},
	projectRoles: {
		list: createTeamworkOperationEndpoint('projectRoles.list'),
		get: createTeamworkOperationEndpoint('projectRoles.get'),
		update: createTeamworkOperationEndpoint('projectRoles.update'),
		delete: createTeamworkOperationEndpoint('projectRoles.delete'),
	},
	tasks: {
		list: createTeamworkOperationEndpoint('tasks.list'),
		get: createTeamworkOperationEndpoint('tasks.get'),
		create: createTeamworkOperationEndpoint('tasks.create'),
		createSubtask: createTeamworkOperationEndpoint('tasks.createSubtask'),
		update: createTeamworkOperationEndpoint('tasks.update'),
		delete: createTeamworkOperationEndpoint('tasks.delete'),
		complete: createTeamworkOperationEndpoint('tasks.complete'),
		uncomplete: createTeamworkOperationEndpoint('tasks.uncomplete'),
		quickAdd: createTeamworkOperationEndpoint('tasks.quickAdd'),
		quickAddSubtasks: createTeamworkOperationEndpoint('tasks.quickAddSubtasks'),
		reorder: createTeamworkOperationEndpoint('tasks.reorder'),
		move: createTeamworkOperationEndpoint('tasks.move'),
		copy: createTeamworkOperationEndpoint('tasks.copy'),
		setEstimate: createTeamworkOperationEndpoint('tasks.setEstimate'),
		listDependencies: createTeamworkOperationEndpoint('tasks.listDependencies'),
		listPredecessors: createTeamworkOperationEndpoint('tasks.listPredecessors'),
		listRecurring: createTeamworkOperationEndpoint('tasks.listRecurring'),
		countCompleted: createTeamworkOperationEndpoint('tasks.countCompleted'),
		countLate: createTeamworkOperationEndpoint('tasks.countLate'),
		timeReport: createTeamworkOperationEndpoint('tasks.timeReport'),
	},
	personalTasks: {
		list: createTeamworkOperationEndpoint('personalTasks.list'),
		get: createTeamworkOperationEndpoint('personalTasks.get'),
		create: createTeamworkOperationEndpoint('personalTasks.create'),
	},
	taskReminders: {
		list: createTeamworkOperationEndpoint('taskReminders.list'),
		create: createTeamworkOperationEndpoint('taskReminders.create'),
		update: createTeamworkOperationEndpoint('taskReminders.update'),
		delete: createTeamworkOperationEndpoint('taskReminders.delete'),
	},
	tasklists: {
		list: createTeamworkOperationEndpoint('tasklists.list'),
		get: createTeamworkOperationEndpoint('tasklists.get'),
		create: createTeamworkOperationEndpoint('tasklists.create'),
		update: createTeamworkOperationEndpoint('tasklists.update'),
		delete: createTeamworkOperationEndpoint('tasklists.delete'),
		listTemplates: createTeamworkOperationEndpoint('tasklists.listTemplates'),
		reorder: createTeamworkOperationEndpoint('tasklists.reorder'),
		copy: createTeamworkOperationEndpoint('tasklists.copy'),
		move: createTeamworkOperationEndpoint('tasklists.move'),
	},
	milestones: {
		list: createTeamworkOperationEndpoint('milestones.list'),
		get: createTeamworkOperationEndpoint('milestones.get'),
		create: createTeamworkOperationEndpoint('milestones.create'),
		update: createTeamworkOperationEndpoint('milestones.update'),
		delete: createTeamworkOperationEndpoint('milestones.delete'),
		complete: createTeamworkOperationEndpoint('milestones.complete'),
		uncomplete: createTeamworkOperationEndpoint('milestones.uncomplete'),
		listByDeadline: createTeamworkOperationEndpoint(
			'milestones.listByDeadline',
		),
	},
	people: {
		list: createTeamworkOperationEndpoint('people.list'),
		get: createTeamworkOperationEndpoint('people.get'),
		me: createTeamworkOperationEndpoint('people.me'),
		create: createTeamworkOperationEndpoint('people.create'),
		update: createTeamworkOperationEndpoint('people.update'),
		delete: createTeamworkOperationEndpoint('people.delete'),
		listDeleted: createTeamworkOperationEndpoint('people.listDeleted'),
		myStats: createTeamworkOperationEndpoint('people.myStats'),
		addToProjects: createTeamworkOperationEndpoint('people.addToProjects'),
		performance: createTeamworkOperationEndpoint('people.performance'),
		utilization: createTeamworkOperationEndpoint('people.utilization'),
		taskCompletion: createTeamworkOperationEndpoint('people.taskCompletion'),
	},
	statuses: {
		list: createTeamworkOperationEndpoint('statuses.list'),
		timeline: createTeamworkOperationEndpoint('statuses.timeline'),
		getMine: createTeamworkOperationEndpoint('statuses.getMine'),
		getForPerson: createTeamworkOperationEndpoint('statuses.getForPerson'),
		create: createTeamworkOperationEndpoint('statuses.create'),
		update: createTeamworkOperationEndpoint('statuses.update'),
		delete: createTeamworkOperationEndpoint('statuses.delete'),
	},
	companies: {
		list: createTeamworkOperationEndpoint('companies.list'),
		listForProject: createTeamworkOperationEndpoint('companies.listForProject'),
		get: createTeamworkOperationEndpoint('companies.get'),
		create: createTeamworkOperationEndpoint('companies.create'),
		update: createTeamworkOperationEndpoint('companies.update'),
		delete: createTeamworkOperationEndpoint('companies.delete'),
		setRates: createTeamworkOperationEndpoint('companies.setRates'),
		convertCurrency: createTeamworkOperationEndpoint(
			'companies.convertCurrency',
		),
		addDomains: createTeamworkOperationEndpoint('companies.addDomains'),
		updateDomain: createTeamworkOperationEndpoint('companies.updateDomain'),
		deleteDomain: createTeamworkOperationEndpoint('companies.deleteDomain'),
	},
	comments: {
		list: createTeamworkOperationEndpoint('comments.list'),
		get: createTeamworkOperationEndpoint('comments.get'),
		listNotified: createTeamworkOperationEndpoint('comments.listNotified'),
		create: createTeamworkOperationEndpoint('comments.create'),
		update: createTeamworkOperationEndpoint('comments.update'),
		delete: createTeamworkOperationEndpoint('comments.delete'),
		markRead: createTeamworkOperationEndpoint('comments.markRead'),
	},
	files: {
		listForProject: createTeamworkOperationEndpoint('files.listForProject'),
		listForTask: createTeamworkOperationEndpoint('files.listForTask'),
		addToProject: createTeamworkOperationEndpoint('files.addToProject'),
		addToTask: createTeamworkOperationEndpoint('files.addToTask'),
		addVersion: createTeamworkOperationEndpoint('files.addVersion'),
		delete: createTeamworkOperationEndpoint('files.delete'),
		getShareLink: createTeamworkOperationEndpoint('files.getShareLink'),
		copy: createTeamworkOperationEndpoint('files.copy'),
	},
	fileCategories: {
		list: createTeamworkOperationEndpoint('fileCategories.list'),
		get: createTeamworkOperationEndpoint('fileCategories.get'),
		create: createTeamworkOperationEndpoint('fileCategories.create'),
		update: createTeamworkOperationEndpoint('fileCategories.update'),
		delete: createTeamworkOperationEndpoint('fileCategories.delete'),
	},
	links: {
		list: createTeamworkOperationEndpoint('links.list'),
		listForProject: createTeamworkOperationEndpoint('links.listForProject'),
		get: createTeamworkOperationEndpoint('links.get'),
		create: createTeamworkOperationEndpoint('links.create'),
		update: createTeamworkOperationEndpoint('links.update'),
		delete: createTeamworkOperationEndpoint('links.delete'),
	},
	linkCategories: {
		list: createTeamworkOperationEndpoint('linkCategories.list'),
		get: createTeamworkOperationEndpoint('linkCategories.get'),
		create: createTeamworkOperationEndpoint('linkCategories.create'),
		delete: createTeamworkOperationEndpoint('linkCategories.delete'),
	},
	notebooks: {
		list: createTeamworkOperationEndpoint('notebooks.list'),
		get: createTeamworkOperationEndpoint('notebooks.get'),
		create: createTeamworkOperationEndpoint('notebooks.create'),
		update: createTeamworkOperationEndpoint('notebooks.update'),
		delete: createTeamworkOperationEndpoint('notebooks.delete'),
		lock: createTeamworkOperationEndpoint('notebooks.lock'),
		unlock: createTeamworkOperationEndpoint('notebooks.unlock'),
		copy: createTeamworkOperationEndpoint('notebooks.copy'),
		move: createTeamworkOperationEndpoint('notebooks.move'),
		listVersions: createTeamworkOperationEndpoint('notebooks.listVersions'),
		getVersion: createTeamworkOperationEndpoint('notebooks.getVersion'),
		deleteVersions: createTeamworkOperationEndpoint('notebooks.deleteVersions'),
	},
	notebookCategories: {
		list: createTeamworkOperationEndpoint('notebookCategories.list'),
		get: createTeamworkOperationEndpoint('notebookCategories.get'),
		create: createTeamworkOperationEndpoint('notebookCategories.create'),
		update: createTeamworkOperationEndpoint('notebookCategories.update'),
		delete: createTeamworkOperationEndpoint('notebookCategories.delete'),
	},
	boardColumns: {
		list: createTeamworkOperationEndpoint('boardColumns.list'),
		get: createTeamworkOperationEndpoint('boardColumns.get'),
		create: createTeamworkOperationEndpoint('boardColumns.create'),
		update: createTeamworkOperationEndpoint('boardColumns.update'),
		delete: createTeamworkOperationEndpoint('boardColumns.delete'),
	},
	boardCards: {
		list: createTeamworkOperationEndpoint('boardCards.list'),
		get: createTeamworkOperationEndpoint('boardCards.get'),
		update: createTeamworkOperationEndpoint('boardCards.update'),
		move: createTeamworkOperationEndpoint('boardCards.move'),
		delete: createTeamworkOperationEndpoint('boardCards.delete'),
	},
	portfolioBoards: {
		list: createTeamworkOperationEndpoint('portfolioBoards.list'),
		create: createTeamworkOperationEndpoint('portfolioBoards.create'),
		update: createTeamworkOperationEndpoint('portfolioBoards.update'),
		delete: createTeamworkOperationEndpoint('portfolioBoards.delete'),
	},
	portfolioColumns: {
		list: createTeamworkOperationEndpoint('portfolioColumns.list'),
		get: createTeamworkOperationEndpoint('portfolioColumns.get'),
		create: createTeamworkOperationEndpoint('portfolioColumns.create'),
		delete: createTeamworkOperationEndpoint('portfolioColumns.delete'),
	},
	portfolioCards: {
		list: createTeamworkOperationEndpoint('portfolioCards.list'),
		get: createTeamworkOperationEndpoint('portfolioCards.get'),
		add: createTeamworkOperationEndpoint('portfolioCards.add'),
		move: createTeamworkOperationEndpoint('portfolioCards.move'),
		delete: createTeamworkOperationEndpoint('portfolioCards.delete'),
	},
	teams: {
		list: createTeamworkOperationEndpoint('teams.list'),
		get: createTeamworkOperationEndpoint('teams.get'),
		create: createTeamworkOperationEndpoint('teams.create'),
		update: createTeamworkOperationEndpoint('teams.update'),
		delete: createTeamworkOperationEndpoint('teams.delete'),
		setMembers: createTeamworkOperationEndpoint('teams.setMembers'),
		listSubteams: createTeamworkOperationEndpoint('teams.listSubteams'),
		listMemberIds: createTeamworkOperationEndpoint('teams.listMemberIds'),
		createForProject: createTeamworkOperationEndpoint('teams.createForProject'),
		listForProject: createTeamworkOperationEndpoint('teams.listForProject'),
		listForCompany: createTeamworkOperationEndpoint('teams.listForCompany'),
		listForPerson: createTeamworkOperationEndpoint('teams.listForPerson'),
	},
	time: {
		list: createTeamworkOperationEndpoint('time.list'),
		get: createTeamworkOperationEndpoint('time.get'),
		create: createTeamworkOperationEndpoint('time.create'),
		createForTask: createTeamworkOperationEndpoint('time.createForTask'),
		update: createTeamworkOperationEndpoint('time.update'),
		delete: createTeamworkOperationEndpoint('time.delete'),
		totals: createTeamworkOperationEndpoint('time.totals'),
		estimatedTotals: createTeamworkOperationEndpoint('time.estimatedTotals'),
		loggedByPerson: createTeamworkOperationEndpoint('time.loggedByPerson'),
		byCompany: createTeamworkOperationEndpoint('time.byCompany'),
		report: createTeamworkOperationEndpoint('time.report'),
		reportTotals: createTeamworkOperationEndpoint('time.reportTotals'),
		reportByType: createTeamworkOperationEndpoint('time.reportByType'),
		validate: createTeamworkOperationEndpoint('time.validate'),
	},
	timers: {
		list: createTeamworkOperationEndpoint('timers.list'),
		listMine: createTeamworkOperationEndpoint('timers.listMine'),
		get: createTeamworkOperationEndpoint('timers.get'),
		create: createTeamworkOperationEndpoint('timers.create'),
		update: createTeamworkOperationEndpoint('timers.update'),
		pause: createTeamworkOperationEndpoint('timers.pause'),
		resume: createTeamworkOperationEndpoint('timers.resume'),
		complete: createTeamworkOperationEndpoint('timers.complete'),
		delete: createTeamworkOperationEndpoint('timers.delete'),
		undelete: createTeamworkOperationEndpoint('timers.undelete'),
	},
} as const;

// `unknown` is necessary for the test-only lookup by name: a runtime string key cannot keep a literal operation id. Consumers use the nested registry, which keeps exact per-operation inputs and outputs.
export const teamworkOperationsById: Record<
	string,
	CorsairEndpoint<TeamworkContext, Record<string, unknown>, unknown>
> = Object.fromEntries(
	TEAMWORK_OPERATION_IDS.map((id) => {
		const [group, action] = id.split('.') as [string, string];
		const endpoints: Record<
			string,
			Record<
				string,
				CorsairEndpoint<TeamworkContext, Record<string, unknown>, unknown>
			>
		> = teamworkOperationsNested;
		const endpoint = endpoints[group]?.[action];
		if (!endpoint) throw new Error('Teamwork operation is unavailable');
		return [id, endpoint];
	}),
);
