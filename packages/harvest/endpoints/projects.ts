import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestProjectEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'project';

/** Lists projects, mirroring each page into the local cache. */
export const list: HarvestEndpoints['projectsList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['projectsList']>(
		ctx,
		'projects',
		{
			query: compactQuery({
				is_active: input.is_active,
				client_id: input.client_id,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.projects, HarvestProjectEntity, result.projects, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.projects.list',
		auditPayload(input, ['is_active', 'client_id', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/** Retrieves one project by id. */
export const get: HarvestEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['projectsGet']>(
		ctx,
		`projects/${input.project_id}`,
	);

	await cacheEntity(ctx.db.projects, HarvestProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.projects.get',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a project.
 *
 * `is_billable`, `bill_by` and `budget_by` are required by Harvest even for a
 * non-billable project, so they are required here rather than defaulted — a
 * guessed billing mode is the kind of mistake that is invisible until an
 * invoice is wrong.
 */
export const create: HarvestEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['projectsCreate']>(
		ctx,
		'projects',
		{
			method: 'POST',
			body: compactBody({
				client_id: input.client_id,
				name: input.name,
				code: input.code,
				is_active: input.is_active,
				is_billable: input.is_billable,
				is_fixed_fee: input.is_fixed_fee,
				bill_by: input.bill_by,
				budget_by: input.budget_by,
				hourly_rate: input.hourly_rate,
				budget: input.budget,
				budget_is_monthly: input.budget_is_monthly,
				notify_when_over_budget: input.notify_when_over_budget,
				over_budget_notification_percentage:
					input.over_budget_notification_percentage,
				show_budget_to_all: input.show_budget_to_all,
				cost_budget: input.cost_budget,
				cost_budget_include_expenses: input.cost_budget_include_expenses,
				fee: input.fee,
				notes: input.notes,
				starts_on: input.starts_on,
				ends_on: input.ends_on,
			}),
		},
	);

	await cacheEntity(ctx.db.projects, HarvestProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.projects.create',
		{ client_id: input.client_id, project_id: result.id },
		'completed',
	);
	return result;
};

/** Updates a project. Omitted fields are left unchanged. */
export const update: HarvestEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['projectsUpdate']>(
		ctx,
		`projects/${input.project_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				client_id: input.client_id,
				name: input.name,
				code: input.code,
				is_active: input.is_active,
				is_billable: input.is_billable,
				is_fixed_fee: input.is_fixed_fee,
				bill_by: input.bill_by,
				budget_by: input.budget_by,
				hourly_rate: input.hourly_rate,
				budget: input.budget,
				budget_is_monthly: input.budget_is_monthly,
				notify_when_over_budget: input.notify_when_over_budget,
				over_budget_notification_percentage:
					input.over_budget_notification_percentage,
				show_budget_to_all: input.show_budget_to_all,
				cost_budget: input.cost_budget,
				cost_budget_include_expenses: input.cost_budget_include_expenses,
				fee: input.fee,
				notes: input.notes,
				starts_on: input.starts_on,
				ends_on: input.ends_on,
			}),
		},
	);

	await cacheEntity(ctx.db.projects, HarvestProjectEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.projects.update',
		auditPayload(input, ['project_id', 'client_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a project.
 *
 * This also removes the project's time entries and expenses. Invoices already
 * raised against it survive. Archiving instead — `update` with
 * `is_active: false` — keeps the history and is usually what is wanted.
 */
export const remove: HarvestEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(ctx, `projects/${input.project_id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.projects, input.project_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.projects.delete',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return { success: true, id: input.project_id };
};
