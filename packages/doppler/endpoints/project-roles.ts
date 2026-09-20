import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Lists all project-level roles - built-in and custom. */
export const list: DopplerEndpoints['projectRolesList'] = async (ctx) => {
	const result = await dopplerCall<{
		roles: DopplerEndpointOutputs['projectRolesList'];
	}>(ctx, 'projects/roles');

	await logEventFromContext(
		ctx,
		'doppler.projectRoles.list',
		{ returned: result.roles.length },
		'completed',
	);
	return result.roles;
};

/** Retrieves a single project-level role by its identifier. */
export const get: DopplerEndpoints['projectRolesGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		role: DopplerEndpointOutputs['projectRolesGet'];
	}>(ctx, `projects/roles/role/${seg(input.role)}`);

	await logEventFromContext(
		ctx,
		'doppler.projectRoles.get',
		auditPayload(input, ['role']),
		'completed',
	);
	return result.role;
};

/** Lists every permission identifier that can be granted to a project role. */
export const listPermissions: DopplerEndpoints['projectRolesListPermissions'] =
	async (ctx) => {
		const result = await dopplerCall<{
			permissions: DopplerEndpointOutputs['projectRolesListPermissions'];
		}>(ctx, 'projects/permissions');

		await logEventFromContext(
			ctx,
			'doppler.projectRoles.listPermissions',
			{ returned: result.permissions.length },
			'completed',
		);
		return result.permissions;
	};
