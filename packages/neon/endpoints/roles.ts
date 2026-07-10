import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonEndpoints, NeonContext } from '../index';
import type {
	RolesListResponse,
	Role,
} from './types';

export const list: NeonEndpoints['rolesList'] = async (ctx, input) => {
	const { projectId, branchId } = input;
	const endpoint = `/projects/${projectId}/branches/${branchId}/roles`;
	const result = await makeNeonRequest<RolesListResponse>(endpoint, ctx);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result?.roles && db?.roles) {
		try {
			for (const role of result.roles) {
				await db.roles.upsertByEntityId(role.name, {
					...role,
					projectId,
					branchId,
				});
			}
		} catch (error) {
			console.warn('Failed to save roles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.roles.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: NeonEndpoints['rolesCreate'] = async (ctx, input) => {
	const { projectId, branchId, ...body } = input;
	const endpoint = `/projects/${projectId}/branches/${branchId}/roles`;
	const result = await makeNeonRequest<Role>(endpoint, ctx, {
		method: 'POST',
		body: { role: body },
	});

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.roles) {
		try {
			await db.roles.upsertByEntityId(result.name, {
				...result,
				projectId,
				branchId,
			});
		} catch (error) {
			console.warn('Failed to save role to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.roles.create',
		{ ...input },
		'completed',
	);
	return result;
};
