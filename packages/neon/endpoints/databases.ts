import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonEndpoints, NeonContext } from '../index';
import type {
	DatabasesListResponse,
	Database,
} from './types';

export const list: NeonEndpoints['databasesList'] = async (ctx, input) => {
	const { projectId, branchId } = input;
	const endpoint = `/projects/${projectId}/branches/${branchId}/databases`;
	const result = await makeNeonRequest<DatabasesListResponse>(endpoint, ctx);

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result?.databases && db?.databases) {
		try {
			for (const database of result.databases) {
				await db.databases.upsertByEntityId(database.id.toString(), {
					...database,
					projectId,
					branchId,
				});
			}
		} catch (error) {
			console.warn('Failed to save databases to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.databases.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: NeonEndpoints['databasesCreate'] = async (ctx, input) => {
	const { projectId, branchId, ...body } = input;
	const endpoint = `/projects/${projectId}/branches/${branchId}/databases`;
	const result = await makeNeonRequest<Database>(endpoint, ctx, {
		method: 'POST',
		body: { database: body },
	});

	const db = (ctx as NeonContext & { db?: any }).db;
	if (result && db?.databases) {
		try {
			await db.databases.upsertByEntityId(result.id.toString(), {
				...result,
				projectId,
				branchId,
			});
		} catch (error) {
			console.warn('Failed to save database to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'neon.databases.create',
		{ ...input },
		'completed',
	);
	return result;
};
