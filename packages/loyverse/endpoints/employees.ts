import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseEmployeeEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'employee';

/**
 * Employees are read-only over the API - they are managed in the back office,
 * so there is no create, update or delete here. That asymmetry is the API's, not
 * an omission.
 *
 * Employee records carry a name and email address, so only ids are logged.
 */

/** Lists employees. */
export const list: LoyverseEndpoints['employeesList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['employeesList']>(
		ctx,
		'employees',
		{ query: listQuery(input, { employee_ids: csv(input.employee_ids) }) },
	);

	await cacheEntities(
		ctx.db.employees,
		LoyverseEmployeeEntity,
		result.employees,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.employees.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one employee by id. */
export const get: LoyverseEndpoints['employeesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['employeesGet']>(
		ctx,
		`employees/${input.employee_id}`,
	);

	await cacheEntity(ctx.db.employees, LoyverseEmployeeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.employees.get',
		auditPayload(input, ['employee_id']),
		'completed',
	);
	return result;
};
