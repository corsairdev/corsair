import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonEndpoints, NeonContext } from '../index';
import type {
	BranchesListResponse,
	Branch,
} from './types';

export const list: NeonEndpoints['branchesList'] = async (ctx, input) => {
	const { projectId } = input;
	const endpoint = `/projects/${projectId}/branches`;
	const result = await makeNeonRequest<BranchesListResponse>(endpoint, ctx);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result?.branches && db?.branches) {
		try {
			for (const branch of result.branches) {
				await db.branches.upsertByEntityId(branch.id, {
					...branch,
					projectId,
				});
			}
		} catch (error) {
			console.warn('Failed to save branches to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.branches.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: NeonEndpoints['branchesGet'] = async (ctx, input) => {
	const { projectId, branchId } = input;
	const endpoint = `/projects/${projectId}/branches/${branchId}`;
	const result = await makeNeonRequest<Branch>(endpoint, ctx);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.branches) {
		try {
			await db.branches.upsertByEntityId(result.id, {
				...result,
				projectId,
			});
		} catch (error) {
			console.warn('Failed to save branch to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.branches.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: NeonEndpoints['branchesCreate'] = async (ctx, input) => {
	const { projectId, ...body } = input;
	const endpoint = `/projects/${projectId}/branches`;
	const result = await makeNeonRequest<Branch>(endpoint, ctx, {
		method: 'POST',
		body: { branch: body },
	});

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.branches) {
		try {
			await db.branches.upsertByEntityId(result.id, {
				...result,
				projectId,
			});
		} catch (error) {
			console.warn('Failed to save branch to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.branches.create',
		{ ...input },
		'completed',
	);
	return result;
};
