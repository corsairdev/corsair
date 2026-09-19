import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Lists all workplace roles - built-in and custom. */
export const list: DopplerEndpoints['workplaceRolesList'] = async (ctx) => {
	const result = await dopplerCall<{
		roles: DopplerEndpointOutputs['workplaceRolesList'];
	}>(ctx, 'workplace/roles');

	await logEventFromContext(
		ctx,
		'doppler.workplaceRoles.list',
		{ returned: result.roles.length },
		'completed',
	);
	return result.roles;
};

/** Retrieves a single workplace role by its identifier. */
export const get: DopplerEndpoints['workplaceRolesGet'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		role: DopplerEndpointOutputs['workplaceRolesGet'];
	}>(ctx, `workplace/roles/role/${seg(input.role)}`);

	await logEventFromContext(
		ctx,
		'doppler.workplaceRoles.get',
		auditPayload(input, ['role']),
		'completed',
	);
	return result.role;
};

/** Lists every permission identifier that can be granted to a workplace role. */
export const listPermissions: DopplerEndpoints['workplaceRolesListPermissions'] =
	async (ctx) => {
		const result = await dopplerCall<{
			permissions: DopplerEndpointOutputs['workplaceRolesListPermissions'];
		}>(ctx, 'workplace/permissions');

		await logEventFromContext(
			ctx,
			'doppler.workplaceRoles.listPermissions',
			{ returned: result.permissions.length },
			'completed',
		);
		return result.permissions;
	};
