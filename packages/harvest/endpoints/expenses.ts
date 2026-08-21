import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestExpenseCategoryEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

/**
 * Expenses themselves are transactional and are not cached; the categories they
 * are filed under are reference data and are.
 */

/**
 * Records an expense against a project.
 *
 * Harvest prices an expense either from `units` — multiplied by the category's
 * unit rate — or from an explicit `total_cost`, and rejects a request carrying
 * neither. The input schema enforces that up front so the failure is a
 * validation error rather than a round trip.
 */
export const create: HarvestEndpoints['expensesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['expensesCreate']>(
		ctx,
		'expenses',
		{
			method: 'POST',
			body: compactBody({
				project_id: input.project_id,
				expense_category_id: input.expense_category_id,
				spent_date: input.spent_date,
				user_id: input.user_id,
				units: input.units,
				total_cost: input.total_cost,
				notes: input.notes,
				billable: input.billable,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'harvest.expenses.create',
		// `notes` describes the purchase in free text and is left out.
		{
			project_id: input.project_id,
			expense_category_id: input.expense_category_id,
			expense_id: result.id,
		},
		'completed',
	);
	return result;
};

/**
 * Updates an expense.
 *
 * `delete_receipt: true` removes an attached receipt; there is no separate
 * endpoint for it.
 */
export const update: HarvestEndpoints['expensesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['expensesUpdate']>(
		ctx,
		`expenses/${input.expense_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				project_id: input.project_id,
				expense_category_id: input.expense_category_id,
				spent_date: input.spent_date,
				units: input.units,
				total_cost: input.total_cost,
				notes: input.notes,
				billable: input.billable,
				delete_receipt: input.delete_receipt,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'harvest.expenses.update',
		auditPayload(input, ['expense_id', 'project_id', 'expense_category_id']),
		'completed',
	);
	return result;
};

/** Lists expense categories and mirrors them into the local cache. */
export const listCategories: HarvestEndpoints['expenseCategoriesList'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['expenseCategoriesList']
	>(ctx, 'expense_categories', {
		query: compactQuery({
			is_active: input.is_active,
			updated_since: input.updated_since,
			page: input.page,
			per_page: input.per_page,
		}),
	});

	await cacheEntities(
		ctx.db.expenseCategories,
		HarvestExpenseCategoryEntity,
		result.expense_categories,
		{ label: 'expense category' },
	);

	await logEventFromContext(
		ctx,
		'harvest.expenses.listCategories',
		auditPayload(input, ['is_active', 'page', 'per_page']),
		'completed',
	);
	return result;
};
