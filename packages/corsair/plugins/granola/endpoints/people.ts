import { logEventFromContext } from '../../utils/events';
import type { GranolaEndpoints } from '..';
import { makeGranolaRequest } from '../client';
import type { GranolaEndpointOutputs } from './types';

export const get: GranolaEndpoints['peopleGet'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['peopleGet']>(
		`v1/people/${input.person_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.person && ctx.db.people) {
		try {
			await ctx.db.people.upsertByEntityId(result.person.id, {
				...result.person,
				created_at: result.person.created_at ? new Date(result.person.created_at) : undefined,
				updated_at: result.person.updated_at ? new Date(result.person.updated_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save person to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.people.get', { ...input }, 'completed');
	return result;
};

export const list: GranolaEndpoints['peopleList'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['peopleList']>(
		'v1/people',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				cursor: input.cursor,
				query: input.query,
			},
		},
	);

	if (result.people && ctx.db.people) {
		try {
			for (const person of result.people) {
				await ctx.db.people.upsertByEntityId(person.id, {
					...person,
					created_at: person.created_at ? new Date(person.created_at) : undefined,
					updated_at: person.updated_at ? new Date(person.updated_at) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save people to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.people.list', { ...input }, 'completed');
	return result;
};

export const create: GranolaEndpoints['peopleCreate'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['peopleCreate']>(
		'v1/people',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				email: input.email,
				company: input.company,
				role: input.role,
			},
		},
	);

	if (result.person && ctx.db.people) {
		try {
			await ctx.db.people.upsertByEntityId(result.person.id, {
				...result.person,
				created_at: result.person.created_at ? new Date(result.person.created_at) : undefined,
				updated_at: result.person.updated_at ? new Date(result.person.updated_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save person to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.people.create', { ...input }, 'completed');
	return result;
};

export const update: GranolaEndpoints['peopleUpdate'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['peopleUpdate']>(
		`v1/people/${input.person_id}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				email: input.email,
				company: input.company,
				role: input.role,
			},
		},
	);

	if (result.person && ctx.db.people) {
		try {
			await ctx.db.people.upsertByEntityId(result.person.id, {
				...result.person,
				created_at: result.person.created_at ? new Date(result.person.created_at) : undefined,
				updated_at: result.person.updated_at ? new Date(result.person.updated_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to update person in database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.people.update', { ...input }, 'completed');
	return result;
};
