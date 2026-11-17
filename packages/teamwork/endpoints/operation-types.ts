export type TeamworkJsonValue =
	| null
	| boolean
	| number
	| string
	| TeamworkJsonValue[]
	| { [key: string]: TeamworkJsonValue };
export const TEAMWORK_OPERATION_IDS = [
	'projects.list',
	'projects.listStarred',
	'projects.get',
	'projects.create',
	'projects.update',
	'projects.delete',
	'projects.clone',
	'projects.star',
	'projects.getStats',
	'projects.getRates',
	'projects.setRates',
	'projects.convertTentative',
	'projects.listTaskPredecessors',
	'projectMetrics.billable',
	'projectMetrics.health',
	'projectMetrics.invoices',
	'projectMetrics.unbilled',
	'projectTemplates.list',
	'projectTemplates.get',
	'projectTemplates.listRequiredCustomFields',
	'projectTemplates.create',
	'projectCategories.list',
	'projectCategories.get',
	'projectCategories.create',
	'projectCategories.update',
	'projectCategories.delete',
	'projectUpdates.list',
	'projectUpdates.create',
	'projectUpdates.update',
	'projectUpdates.delete',
	'projectUpdates.request',
	'projectPeople.list',
	'projectPeople.get',
	'projectPeople.getPermissions',
	'projectPeople.add',
	'projectPeople.remove',
	'projectRoles.list',
	'projectRoles.get',
	'projectRoles.update',
	'projectRoles.delete',
	'tasks.list',
	'tasks.get',
	'tasks.create',
	'tasks.createSubtask',
	'tasks.update',
	'tasks.delete',
	'tasks.complete',
	'tasks.uncomplete',
	'tasks.quickAdd',
	'tasks.quickAddSubtasks',
	'tasks.reorder',
	'tasks.move',
	'tasks.copy',
	'tasks.setEstimate',
	'tasks.listDependencies',
	'tasks.listPredecessors',
	'tasks.listRecurring',
	'tasks.countCompleted',
	'tasks.countLate',
	'tasks.timeReport',
	'personalTasks.list',
	'personalTasks.get',
	'personalTasks.create',
	'taskReminders.list',
	'taskReminders.create',
	'taskReminders.update',
	'taskReminders.delete',
	'tasklists.list',
	'tasklists.get',
	'tasklists.create',
	'tasklists.update',
	'tasklists.delete',
	'tasklists.listTemplates',
	'tasklists.reorder',
	'tasklists.copy',
	'tasklists.move',
	'milestones.list',
	'milestones.get',
	'milestones.create',
	'milestones.update',
	'milestones.delete',
	'milestones.complete',
	'milestones.uncomplete',
	'milestones.listByDeadline',
	'people.list',
	'people.get',
	'people.me',
	'people.create',
	'people.update',
	'people.delete',
	'people.listDeleted',
	'people.myStats',
	'people.addToProjects',
	'people.performance',
	'people.utilization',
	'people.taskCompletion',
	'statuses.list',
	'statuses.timeline',
	'statuses.getMine',
	'statuses.getForPerson',
	'statuses.create',
	'statuses.update',
	'statuses.delete',
	'companies.list',
	'companies.listForProject',
	'companies.get',
	'companies.create',
	'companies.update',
	'companies.delete',
	'companies.setRates',
	'companies.convertCurrency',
	'companies.addDomains',
	'companies.updateDomain',
	'companies.deleteDomain',
	'comments.list',
	'comments.get',
	'comments.listNotified',
	'comments.create',
	'comments.update',
	'comments.delete',
	'comments.markRead',
	'files.listForProject',
	'files.listForTask',
	'files.addToProject',
	'files.addToTask',
	'files.addVersion',
	'files.delete',
	'files.getShareLink',
	'files.copy',
	'fileCategories.list',
	'fileCategories.get',
	'fileCategories.create',
	'fileCategories.update',
	'fileCategories.delete',
	'links.list',
	'links.listForProject',
	'links.get',
	'links.create',
	'links.update',
	'links.delete',
	'linkCategories.list',
	'linkCategories.get',
	'linkCategories.create',
	'linkCategories.delete',
	'notebooks.list',
	'notebooks.get',
	'notebooks.create',
	'notebooks.update',
	'notebooks.delete',
	'notebooks.lock',
	'notebooks.unlock',
	'notebooks.copy',
	'notebooks.move',
	'notebooks.listVersions',
	'notebooks.getVersion',
	'notebooks.compareVersions',
	'notebooks.deleteVersions',
	'notebookCategories.list',
	'notebookCategories.get',
	'notebookCategories.create',
	'notebookCategories.update',
	'notebookCategories.delete',
	'boardColumns.list',
	'boardColumns.get',
	'boardColumns.create',
	'boardColumns.update',
	'boardColumns.delete',
	'boardCards.list',
	'boardCards.get',
	'boardCards.update',
	'boardCards.move',
	'boardCards.delete',
	'portfolioBoards.list',
	'portfolioBoards.create',
	'portfolioBoards.update',
	'portfolioBoards.delete',
	'portfolioColumns.list',
	'portfolioColumns.get',
	'portfolioColumns.create',
	'portfolioColumns.delete',
	'portfolioCards.list',
	'portfolioCards.get',
	'portfolioCards.add',
	'portfolioCards.move',
	'portfolioCards.delete',
	'teams.list',
	'teams.get',
	'teams.create',
	'teams.update',
	'teams.delete',
	'teams.setMembers',
	'teams.listSubteams',
	'teams.listMemberIds',
	'teams.createForProject',
	'teams.listForProject',
	'teams.listForCompany',
	'teams.listForPerson',
	'time.list',
	'time.get',
	'time.create',
	'time.createForTask',
	'time.update',
	'time.delete',
	'time.totals',
	'time.estimatedTotals',
	'time.loggedByPerson',
	'time.byCompany',
	'time.report',
	'time.reportTotals',
	'time.reportByType',
	'time.validate',
	'timers.list',
	'timers.listMine',
	'timers.get',
	'timers.create',
	'timers.update',
	'timers.pause',
	'timers.resume',
	'timers.complete',
	'timers.delete',
	'timers.undelete',
] as const;

export type TeamworkOperationId = (typeof TEAMWORK_OPERATION_IDS)[number];

import type { TeamworkV1Inputs, TeamworkV1Outputs } from './operation-types-v1';
export type { TeamworkV1Inputs, TeamworkV1Outputs };

import type { TeamworkV2Inputs, TeamworkV2Outputs } from './operation-types-v2';
export type { TeamworkV2Inputs, TeamworkV2Outputs };

import type { TeamworkV3Inputs, TeamworkV3Outputs } from './operation-types-v3';
export type { TeamworkV3Inputs, TeamworkV3Outputs };
/** V1 bodies also take fields the V1 spec leaves out (see `v1Request` in openapi-schema.ts). */
type TeamworkOpenBody<T> = T extends Array<infer Item>
	? Array<TeamworkOpenBody<Item>>
	: T extends object
		? { [Key in keyof T]: TeamworkOpenBody<T[Key]> } & {
				[key: string]: TeamworkJsonValue | undefined;
			}
		: T;
/** V3 bodies: other keys allowed, and the spec's generated required lists are not enforced (see `v3Request`). */
type TeamworkOpenPartialBody<T> = T extends Array<infer Item>
	? Array<TeamworkOpenPartialBody<Item>>
	: T extends object
		? { [Key in keyof T]?: TeamworkOpenPartialBody<T[Key]> } & {
				[key: string]: TeamworkJsonValue | undefined;
			}
		: T;
// The task overlay in openapi-schema.ts keeps these bodies' required fields (name on create, taskOptions.notify).
type TeamworkV3TaskRequestId =
	| 'tasks.create'
	| 'tasks.update'
	| 'tasks.createSubtask'
	| 'personalTasks.create';
export type TeamworkEndpointInputs = {
	[Id in keyof TeamworkV1Inputs]: {
		[Field in keyof TeamworkV1Inputs[Id]]: Field extends 'body'
			? TeamworkOpenBody<TeamworkV1Inputs[Id][Field]>
			: TeamworkV1Inputs[Id][Field];
	};
} & TeamworkV2Inputs & {
		[Id in keyof TeamworkV3Inputs]: {
			[Field in keyof TeamworkV3Inputs[Id]]: Field extends 'body'
				? Id extends TeamworkV3TaskRequestId
					? TeamworkV3Inputs[Id][Field]
					: TeamworkOpenPartialBody<TeamworkV3Inputs[Id][Field]>
				: TeamworkV3Inputs[Id][Field];
		};
	};
/**
 * What a response really holds. The live run on 11-16 got null for unset
 * fields the spec types as values, and V1 booleans where the spec says string.
 * So every response field is optional and nullable, enum fields are plain
 * strings, and V1 scalars may be any JSON scalar (see the runtime schemas).
 */
type TeamworkResponse<T> = [T] extends [undefined]
	? undefined | { [key: string]: TeamworkJsonValue }
	: TeamworkResponseValue<T>;
type TeamworkResponseValue<T> = T extends Array<infer Item>
	? Array<TeamworkResponseValue<Item>>
	: T extends object
		? { [Key in keyof T]?: TeamworkResponseValue<T[Key]> | null }
		: (T extends string ? string : T) | null;
type TeamworkV1Response<T> = T extends Array<infer Item>
	? Array<TeamworkV1Response<Item>>
	: T extends object
		? { [Key in keyof T]?: TeamworkV1Response<T[Key]> | null }
		: string | number | boolean | null;
export type TeamworkEndpointOutputs = {
	[Id in keyof TeamworkV1Outputs]: TeamworkV1Response<TeamworkV1Outputs[Id]>;
} & {
	[Id in keyof TeamworkV2Outputs]: TeamworkV1Response<TeamworkV2Outputs[Id]>;
} & {
	[Id in keyof TeamworkV3Outputs]: TeamworkResponse<TeamworkV3Outputs[Id]>;
};
export type TeamworkEndpointInput = TeamworkEndpointInputs[TeamworkOperationId];
export type TeamworkEndpointOutput =
	TeamworkEndpointOutputs[TeamworkOperationId];
