import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestUserEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'user';

/** Lists team members, mirroring each page into the local cache. */
export const list: HarvestEndpoints['usersList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['usersList']>(
		ctx,
		'users',
		{
			query: compactQuery({
				is_active: input.is_active,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.users, HarvestUserEntity, result.users, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.users.list',
		auditPayload(input, ['is_active', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/** Retrieves one team member by id. */
export const get: HarvestEndpoints['usersGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['usersGet']>(
		ctx,
		`users/${input.user_id}`,
	);

	await cacheEntity(ctx.db.users, HarvestUserEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.users.get',
		auditPayload(input, ['user_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a team member.
 *
 * Harvest emails an invitation to the address supplied as soon as the user is
 * created; there is no way to create one quietly and invite later. Callers
 * should treat this as an outbound message, not just a database write.
 */
export const create: HarvestEndpoints['usersCreate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['usersCreate']>(
		ctx,
		'users',
		{
			method: 'POST',
			body: compactBody({
				first_name: input.first_name,
				last_name: input.last_name,
				email: input.email,
				timezone: input.timezone,
				is_contractor: input.is_contractor,
				is_active: input.is_active,
				weekly_capacity: input.weekly_capacity,
				default_hourly_rate: input.default_hourly_rate,
				cost_rate: input.cost_rate,
				has_access_to_all_future_projects:
					input.has_access_to_all_future_projects,
				saml_exempt: input.saml_exempt,
				roles: input.roles,
				access_roles: input.access_roles,
			}),
		},
	);

	await cacheEntity(ctx.db.users, HarvestUserEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.users.create',
		// The invitee's name and email address are personal data and stay out of
		// the event log; the assigned id is enough to trace the call.
		{ user_id: result.id },
		'completed',
	);
	return result;
};

/** Updates a team member. Omitted fields are left unchanged. */
export const update: HarvestEndpoints['usersUpdate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['usersUpdate']>(
		ctx,
		`users/${input.user_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				first_name: input.first_name,
				last_name: input.last_name,
				email: input.email,
				timezone: input.timezone,
				is_contractor: input.is_contractor,
				is_active: input.is_active,
				weekly_capacity: input.weekly_capacity,
				default_hourly_rate: input.default_hourly_rate,
				cost_rate: input.cost_rate,
				has_access_to_all_future_projects:
					input.has_access_to_all_future_projects,
				saml_exempt: input.saml_exempt,
				roles: input.roles,
				access_roles: input.access_roles,
			}),
		},
	);

	await cacheEntity(ctx.db.users, HarvestUserEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'harvest.users.update',
		auditPayload(input, ['user_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a team member.
 *
 * Harvest refuses with 422 once the user has tracked time or filed expenses;
 * archiving via `update` with `is_active: false` is the alternative that keeps
 * their history intact.
 */
export const remove: HarvestEndpoints['usersDelete'] = async (ctx, input) => {
	await harvestCall<void>(ctx, `users/${input.user_id}`, { method: 'DELETE' });

	await evictEntity(ctx.db.users, input.user_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.users.delete',
		auditPayload(input, ['user_id']),
		'completed',
	);
	return { success: true, id: input.user_id };
};
