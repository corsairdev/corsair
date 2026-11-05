import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignDeal,
	ActiveCampaignDealCustomFieldMeta,
	ActiveCampaignDealGroup,
	ActiveCampaignDealRole,
	ActiveCampaignDealStage,
	ActiveCampaignDealTask,
	ActiveCampaignDealTaskType,
	ActiveCampaignTaskOutcome,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { persistRow } from './persist';
import { makeResource } from './resource';
import {
	AC_PAGE_SIZE_MAX,
	buildPaginationQuery,
	compactQuery,
	resolveAccount,
} from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * The CRM resources. Everything here follows ActiveCampaign's standard REST
 * shape, so the handlers come from `makeResource` and only the strings differ.
 *
 * Two asymmetries are deliberate, and both match the OSS catalog rather than
 * the API: there is no create-deal operation (the catalog lists retrieve,
 * update and delete but no create), and deal activities are read-only.
 */

const deals = makeResource({
	path: 'deals',
	one: 'deal',
	many: 'deals',
	event: 'activecampaign.deals',
	entity: ActiveCampaignDeal,
	store: 'deals',
	label: 'deal',
	logKeys: ['id', 'limit', 'offset', 'status', 'stage', 'group', 'owner'],
	queryMap: {
		search: 'filters[search]',
		search_field: 'filters[search_field]',
		title: 'filters[title]',
		stage: 'filters[stage]',
		group: 'filters[group]',
		status: 'filters[status]',
		owner: 'filters[owner]',
		nextdate_range: 'filters[nextdate_range]',
		tag: 'filters[tag]',
		tasktype: 'filters[tasktype]',
		created_before: 'filters[created_before]',
		created_after: 'filters[created_after]',
		updated_before: 'filters[updated_before]',
		updated_after: 'filters[updated_after]',
		organization: 'filters[organization]',
		minimum_value: 'filters[minimum_value]',
		maximum_value: 'filters[maximum_value]',
		score_greater_than: 'filters[score_greater_than]',
		score_less_than: 'filters[score_less_than]',
		score: 'filters[score]',
		order_id: 'orders[id]',
		order_title: 'orders[title]',
		order_value: 'orders[value]',
		order_created: 'orders[cdate]',
		order_updated: 'orders[mdate]',
		order_contact_name: 'orders[contact_name]',
		order_contact_orgname: 'orders[contact_orgname]',
		order_next_action: 'orders[next-action]',
	},
	bodyKeys: [
		'title',
		'description',
		'value',
		'currency',
		'group',
		'stage',
		'owner',
		'contact',
		'organization',
		'status',
		'percent',
		'fields',
	],
});

const dealGroups = makeResource({
	path: 'dealGroups',
	one: 'dealGroup',
	many: 'dealGroups',
	event: 'activecampaign.dealGroups',
	entity: ActiveCampaignDealGroup,
	store: 'dealGroups',
	label: 'dealGroup',
	queryMap: { title: 'filters[title]' },
	bodyKeys: [
		'title',
		'currency',
		'allgroups',
		'autoassign',
		'allusers',
		'users',
		'groups',
	],
});

const dealStages = makeResource({
	path: 'dealStages',
	one: 'dealStage',
	many: 'dealStages',
	event: 'activecampaign.dealStages',
	entity: ActiveCampaignDealStage,
	store: 'dealStages',
	label: 'dealStage',
	queryMap: {
		title: 'filters[title]',
		group: 'filters[d_groupid]',
		order_title: 'orders[title]',
	},
	bodyKeys: ['title', 'group', 'order', 'width', 'color', 'cardRegion1'],
});

const dealTasks = makeResource({
	path: 'dealTasks',
	one: 'dealTask',
	many: 'dealTasks',
	event: 'activecampaign.dealTasks',
	entity: ActiveCampaignDealTask,
	store: 'dealTasks',
	label: 'dealTask',
	logKeys: ['id', 'limit', 'offset', 'relid', 'reltype', 'dealTasktype'],
	queryMap: {
		title: 'filters[title]',
		reltype: 'filters[reltype]',
		relid: 'filters[relid]',
		status: 'filters[status]',
		note: 'filters[note]',
		duedate: 'filters[duedate]',
		dealTasktype: 'filters[d_tasktypeid]',
		userid: 'filters[userid]',
		due_after: 'filters[due_after]',
		due_before: 'filters[due_before]',
		duedate_range: 'filters[duedate_range]',
		assignee_userid: 'filters[assignee_userid]',
		outcome_id: 'filters[outcome_id]',
	},
	bodyKeys: [
		'title',
		'relid',
		'reltype',
		'dealTasktype',
		'ownerType',
		'status',
		'note',
		'duedate',
		'edate',
		'assignee',
		'triggerAutomationOnCreate',
		'doneAutomation',
		'outcomeId',
		'outcomeInfo',
	],
});

const dealTaskTypes = makeResource({
	// ActiveCampaign spells this path with a lowercase "t" in "Tasktype",
	// unlike dealTasks. Confirmed against the live API on 2026-08-13.
	path: 'dealTasktypes',
	one: 'dealTasktype',
	many: 'dealTasktypes',
	event: 'activecampaign.dealTaskTypes',
	entity: ActiveCampaignDealTaskType,
	store: 'dealTaskTypes',
	label: 'dealTaskType',
	bodyKeys: ['title', 'defduration', 'status', 'display_order', 'outcomes'],
});

const dealRoles = makeResource({
	path: 'dealRoles',
	one: 'dealRole',
	many: 'dealRoles',
	event: 'activecampaign.dealRoles',
	entity: ActiveCampaignDealRole,
	store: 'dealRoles',
	label: 'dealRole',
	bodyKeys: ['title'],
});

const taskOutcomes = makeResource({
	path: 'taskOutcomes',
	one: 'taskOutcome',
	many: 'taskOutcomes',
	event: 'activecampaign.taskOutcomes',
	entity: ActiveCampaignTaskOutcome,
	store: 'taskOutcomes',
	label: 'taskOutcome',
	bodyKeys: ['title', 'sentiment', 'status', 'dealTasktypes'],
});

const dealCustomFieldMeta = makeResource({
	path: 'dealCustomFieldMeta',
	one: 'dealCustomFieldMetum',
	many: 'dealCustomFieldMeta',
	event: 'activecampaign.dealCustomFieldMeta',
	entity: ActiveCampaignDealCustomFieldMeta,
	store: 'dealCustomFieldMeta',
	label: 'dealCustomFieldMeta',
	bodyKeys: [
		'fieldLabel',
		'fieldType',
		'fieldOptions',
		'fieldDefault',
		'fieldDefaultCurrency',
		'isFormVisible',
		'isRequired',
		'displayOrder',
	],
});

/**
 * Field *values* on deals. Not mirrored: a value is only meaningful alongside
 * the deal it belongs to, and the deal itself is already cached.
 */
const dealCustomFieldData = makeResource({
	path: 'dealCustomFieldData',
	one: 'dealCustomFieldDatum',
	many: 'dealCustomFieldData',
	event: 'activecampaign.dealCustomFieldData',
	label: 'dealCustomFieldData',
	logKeys: ['id', 'limit', 'offset', 'dealId', 'customFieldId'],
	queryMap: { dealId: 'filters[dealId]' },
	bodyKeys: ['dealId', 'customFieldId', 'fieldValue', 'fieldCurrency'],
});

/**
 * Secondary contacts on a deal - the contact-to-deal association, which is
 * distinct from the deal's primary contact.
 */
const contactDeals = makeResource({
	path: 'contactDeals',
	one: 'contactDeal',
	many: 'contactDeals',
	event: 'activecampaign.contactDeals',
	label: 'contactDeal',
	logKeys: ['id', 'limit', 'offset', 'contact', 'deal', 'role'],
	bodyKeys: ['contact', 'deal', 'role', 'jobTitle'],
});

// --- deals -----------------------------------------------------------------
export const list = deals.list as ActiveCampaignEndpoints['dealsList'];
export const listFiltered =
	deals.list as ActiveCampaignEndpoints['dealsListFiltered'];
export const get = deals.get as ActiveCampaignEndpoints['dealsGet'];
export const update = deals.update as ActiveCampaignEndpoints['dealsUpdate'];
export const remove = deals.remove as ActiveCampaignEndpoints['dealsDelete'];

// --- pipelines and stages --------------------------------------------------
export const listGroups =
	dealGroups.list as ActiveCampaignEndpoints['dealGroupsList'];
export const getGroup =
	dealGroups.get as ActiveCampaignEndpoints['dealGroupsGet'];
export const createGroup =
	dealGroups.create as ActiveCampaignEndpoints['dealGroupsCreate'];
export const updateGroup =
	dealGroups.update as ActiveCampaignEndpoints['dealGroupsUpdate'];
export const removeGroup =
	dealGroups.remove as ActiveCampaignEndpoints['dealGroupsDelete'];

export const listStages =
	dealStages.list as ActiveCampaignEndpoints['dealStagesList'];
export const getStage =
	dealStages.get as ActiveCampaignEndpoints['dealStagesGet'];
export const createStage =
	dealStages.create as ActiveCampaignEndpoints['dealStagesCreate'];
export const updateStage =
	dealStages.update as ActiveCampaignEndpoints['dealStagesUpdate'];
export const removeStage =
	dealStages.remove as ActiveCampaignEndpoints['dealStagesDelete'];

// --- tasks -----------------------------------------------------------------
export const listTasks =
	dealTasks.list as ActiveCampaignEndpoints['dealTasksList'];
export const getTask = dealTasks.get as ActiveCampaignEndpoints['dealTasksGet'];
export const createTask =
	dealTasks.create as ActiveCampaignEndpoints['dealTasksCreate'];
export const updateTask =
	dealTasks.update as ActiveCampaignEndpoints['dealTasksUpdate'];
export const removeTask =
	dealTasks.remove as ActiveCampaignEndpoints['dealTasksDelete'];

export const listTaskTypes =
	dealTaskTypes.list as ActiveCampaignEndpoints['dealTaskTypesList'];
export const getTaskType =
	dealTaskTypes.get as ActiveCampaignEndpoints['dealTaskTypesGet'];
export const createTaskType =
	dealTaskTypes.create as ActiveCampaignEndpoints['dealTaskTypesCreate'];
export const updateTaskType =
	dealTaskTypes.update as ActiveCampaignEndpoints['dealTaskTypesUpdate'];

export const listOutcomes =
	taskOutcomes.list as ActiveCampaignEndpoints['taskOutcomesList'];
export const getOutcome =
	taskOutcomes.get as ActiveCampaignEndpoints['taskOutcomesGet'];
export const createOutcome =
	taskOutcomes.create as ActiveCampaignEndpoints['taskOutcomesCreate'];

// --- roles and secondary contacts ------------------------------------------
export const listRoles =
	dealRoles.list as ActiveCampaignEndpoints['dealRolesList'];
export const createRole =
	dealRoles.create as ActiveCampaignEndpoints['dealRolesCreate'];
export const removeRole =
	dealRoles.remove as ActiveCampaignEndpoints['dealRolesDelete'];

export const listSecondaryContacts =
	contactDeals.list as ActiveCampaignEndpoints['contactDealsList'];
export const getSecondaryContact =
	contactDeals.get as ActiveCampaignEndpoints['contactDealsGet'];
export const addSecondaryContact =
	contactDeals.create as ActiveCampaignEndpoints['contactDealsCreate'];
export const updateSecondaryContact =
	contactDeals.update as ActiveCampaignEndpoints['contactDealsUpdate'];
export const removeSecondaryContact =
	contactDeals.remove as ActiveCampaignEndpoints['contactDealsDelete'];

// --- deal custom fields ----------------------------------------------------
export const listFieldMeta =
	dealCustomFieldMeta.list as ActiveCampaignEndpoints['dealCustomFieldMetaList'];
export const getFieldMeta =
	dealCustomFieldMeta.get as ActiveCampaignEndpoints['dealCustomFieldMetaGet'];
export const createFieldMeta =
	dealCustomFieldMeta.create as ActiveCampaignEndpoints['dealCustomFieldMetaCreate'];
export const updateFieldMeta =
	dealCustomFieldMeta.update as ActiveCampaignEndpoints['dealCustomFieldMetaUpdate'];
export const removeFieldMeta =
	dealCustomFieldMeta.remove as ActiveCampaignEndpoints['dealCustomFieldMetaDelete'];

export const listFieldData =
	dealCustomFieldData.list as ActiveCampaignEndpoints['dealCustomFieldDataList'];
export const getFieldData =
	dealCustomFieldData.get as ActiveCampaignEndpoints['dealCustomFieldDataGet'];
export const updateFieldData =
	dealCustomFieldData.update as ActiveCampaignEndpoints['dealCustomFieldDataUpdate'];
export const removeFieldData =
	dealCustomFieldData.remove as ActiveCampaignEndpoints['dealCustomFieldDataDelete'];

// ---------------------------------------------------------------------------
// Operations that do not fit the standard resource shape
// ---------------------------------------------------------------------------

/**
 * Deal activity feed. Read-only and never mirrored - activities are appended
 * continuously and are only meaningful against a time range.
 */
export const listActivities: ActiveCampaignEndpoints['dealActivitiesList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['dealActivitiesList']
		>('dealActivities', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({
					deal: input.deal,
					exclude: input.exclude,
					'filters[data_type]': input.data_type,
					'filters[data_id]': input.data_id,
				}),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.dealActivities.list',
			listAuditPayload(
				input,
				['deal', 'exclude', 'data_type', 'data_id', 'limit', 'offset'],
				response.dealActivities?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

/**
 * Reassigns many deals to new owners in one call.
 *
 * Requires deal-management, pipeline and reassign permissions. The whole batch
 * is one request, so a retry would re-apply every reassignment - it is listed
 * as non-idempotent for that reason.
 */
export const updateOwnersBulk: ActiveCampaignEndpoints['dealsUpdateOwnersBulk'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['dealsUpdateOwnersBulk']
		>('deals/bulkUpdate', ctx.key, account, {
			method: 'PATCH',
			body: { deals: input.deals },
		});

		await logEventFromContext(
			ctx,
			'activecampaign.deals.updateOwnersBulk',
			{ dealCount: input.deals.length, fields: ['deals'] },
			'completed',
		);
		return response;
	};

/**
 * Moves every deal in one stage to another stage.
 *
 * Both stages must belong to the same pipeline; ActiveCampaign answers 422
 * otherwise, which the validation handler surfaces without a retry.
 */
export const moveStageDeals: ActiveCampaignEndpoints['dealStagesMoveDeals'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['dealStagesMoveDeals']
		>(`dealStages/${input.id}/deals`, ctx.key, account, {
			method: 'PUT',
			body: { deals: { stage: input.stage } },
		});

		await logEventFromContext(
			ctx,
			'activecampaign.dealStages.moveDeals',
			auditPayload(input, ['id', 'stage']),
			'completed',
		);
		return response;
	};

/**
 * Deletes a pipeline stage, optionally moving its deals first.
 *
 * `action_type: 'Move'` requires both `new_pipeline_id` and `new_stage_id`;
 * the input schema enforces that pairing with a refinement, because deleting a
 * stage without relocating its deals destroys them.
 */
export const removeStageWithDeals: ActiveCampaignEndpoints['dealStagesDeleteWithDeals'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);

		if (input.action_type === 'Move') {
			await makeActiveCampaignRequest<unknown>(
				`dealStages/${input.id}/deals`,
				ctx.key,
				account,
				{ method: 'PUT', body: { deals: { stage: input.new_stage_id } } },
			);
		}

		await makeActiveCampaignRequest<unknown>(
			`dealStages/${input.id}`,
			ctx.key,
			account,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'activecampaign.dealStages.deleteWithDeals',
			auditPayload(input, [
				'id',
				'action_type',
				'new_pipeline_id',
				'new_stage_id',
			]),
			'completed',
		);
		return { id: input.id };
	};

/**
 * Tasks against a contact.
 *
 * ActiveCampaign has no `/tasks` collection - it answers 404 - so contact
 * tasks are deal tasks with `reltype: 'Subscriber'`. Exposed as contact-facing
 * operations because that is how the catalog lists them.
 */
export const createContactTask: ActiveCampaignEndpoints['contactTasksCreate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactTasksCreate']
		>('dealTasks', ctx.key, account, {
			method: 'POST',
			body: {
				dealTask: {
					title: input.title,
					relid: input.contactId,
					reltype: 'Subscriber',
					dealtasktype: input.taskTypeId,
					duedate: input.dueDate,
					...(input.note !== undefined && { note: input.note }),
					...(input.assignee !== undefined && { assignee: input.assignee }),
				},
			},
		});

		await persistRow(
			ctx.db.dealTasks,
			ActiveCampaignDealTask,
			response.dealTask,
			'dealTask',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.contactTasks.create',
			auditPayload(input, ['contactId', 'taskTypeId', 'dueDate', 'assignee']),
			'completed',
		);
		return response;
	};

/**
 * Finds contact tasks by title, optionally narrowed to one contact.
 *
 * The collection has no title filter, so matching happens here; the title is
 * caller-supplied text and only the match count is logged.
 */
export const findContactTask: ActiveCampaignEndpoints['contactTasksFind'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		type DealTaskRow = {
			title?: string;
			relid?: string;
			reltype?: string;
		};
		const dealTasks: DealTaskRow[] = [];
		for (let offset = 0; ; ) {
			const page = await makeActiveCampaignRequest<{
				dealTasks?: DealTaskRow[];
			}>('dealTasks', ctx.key, account, {
				method: 'GET',
				query: compactQuery({
					'filters[reltype]': 'Subscriber',
					'filters[relid]': input.contactId,
					limit: AC_PAGE_SIZE_MAX,
					offset,
				}),
			});
			const rows = page.dealTasks ?? [];
			dealTasks.push(...rows);
			if (rows.length < AC_PAGE_SIZE_MAX) break;
			offset += rows.length;
		}

		const matches = dealTasks.filter(
			(t) => t.title === input.title && t.reltype === 'Subscriber',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.contactTasks.find',
			{
				contactId: input.contactId,
				matched: matches.length,
				fields: ['title'],
			},
			'completed',
		);
		return {
			dealTasks: matches,
		} as ActiveCampaignEndpointOutputs['contactTasksFind'];
	};
