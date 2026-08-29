import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryExpense } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryExpenseSchema,
} from './types';

/**
 * List expenses, optionally filtered by date range.
 *
 * API: GET /api/v2/expenses
 * Docs: https://www.clientary.com/api/expenses
 */
export const list: ClientaryEndpoints['expensesList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.expensesList>
	>('expenses', apiKey, domain, {
		query: {
			from_date: input.from_date,
			to_date: input.to_date,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.expensesList.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.expenses.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List expenses belonging to a single client.
 *
 * API: GET /api/v2/clients/:client_id/expenses
 * Docs: https://www.clientary.com/api/expenses
 */
export const listForClient: ClientaryEndpoints['expensesListForClient'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.expensesListForClient>
		>(`clients/${input.client_id}/expenses`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.expensesListForClient.parse(response);

		await logEventFromContext(
			ctx,
			'clientary.expenses.listForClient',
			{ client_id: input.client_id },
			'completed',
		);
		return parsed;
	};

/**
 * List expenses belonging to a single project.
 *
 * API: GET /api/v2/projects/:project_id/expenses
 * Docs: https://www.clientary.com/api/expenses
 */
export const listForProject: ClientaryEndpoints['expensesListForProject'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.expensesListForProject>
		>(`projects/${input.project_id}/expenses`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.expensesListForProject.parse(response);

		await logEventFromContext(
			ctx,
			'clientary.expenses.listForProject',
			{ project_id: input.project_id },
			'completed',
		);
		return parsed;
	};

/**
 * Get a single expense by ID.
 *
 * API: GET /api/v2/expenses/:id
 * Docs: https://www.clientary.com/api/expenses
 */
export const get: ClientaryEndpoints['expensesGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryExpense>(
		`expenses/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryExpenseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.expenses.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new expense.
 *
 * API: POST /api/v2/expenses
 * Docs: https://www.clientary.com/api/expenses
 */
export const create: ClientaryEndpoints['expensesCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryExpense>(
		'expenses',
		apiKey,
		domain,
		{ method: 'POST', body: { expense: { ...input } } },
	);

	const parsed = ClientaryExpenseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.expenses.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing expense.
 *
 * API: PUT /api/v2/expenses/:id
 * Docs: https://www.clientary.com/api/expenses
 */
export const update: ClientaryEndpoints['expensesUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryExpense>(
		`expenses/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { expense: { ...fields } } },
	);

	const parsed = ClientaryExpenseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.expenses.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete an expense.
 *
 * API: DELETE /api/v2/expenses/:id
 * Docs: https://www.clientary.com/api/expenses
 */
export const remove: ClientaryEndpoints['expensesDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	// any/unknown: DELETE response body is untyped and discarded; the plugin
	// synthesizes the DeleteSuccess response from the requested id.
	await makeClientaryRequest<unknown>(`expenses/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.expenses.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
