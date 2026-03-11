import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import type { SentryEndpointOutputs } from './types';
import { makeSentryRequest } from '../client';

export const get: SentryEndpoints['projectsGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['projectsGet']
	>(
		`projects/${input.organizationSlug}/${input.projectSlug}/`,
		ctx.key,
		{ method: 'GET' },
	);

	if (response && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(response.id, {
				...response,
				organization: response.organization?.slug,
				team: response.team?.slug,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.projects.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['projectsList'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['projectsList']
	>(`organizations/${input.organizationSlug}/projects/`, ctx.key, {
		method: 'GET',
		query: {
			cursor: input.cursor,
		},
	});

	if (response && ctx.db.projects) {
		try {
			for (const project of response) {
				await ctx.db.projects.upsertByEntityId(project.id, {
					...project,
					organization: project.organization?.slug,
					team: project.team?.slug,
					dateCreated: project.dateCreated
						? new Date(project.dateCreated)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save projects to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SentryEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const { organizationSlug, teamSlug, ...createData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['projectsCreate']
	>(`teams/${organizationSlug}/${teamSlug}/projects/`, ctx.key, {
		method: 'POST',
		body: createData as Record<string, unknown>,
	});

	if (response && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(response.id, {
				...response,
				organization: response.organization?.slug,
				team: response.team?.slug,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.projects.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: SentryEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const { organizationSlug, projectSlug, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['projectsUpdate']
	>(`projects/${organizationSlug}/${projectSlug}/`, ctx.key, {
		method: 'PUT',
		body: updateData as Record<string, unknown>,
	});

	if (response && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(response.id, {
				...response,
				organization: response.organization?.slug,
				team: response.team?.slug,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to update project in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.projects.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteProject: SentryEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	await makeSentryRequest<void>(
		`projects/${input.organizationSlug}/${input.projectSlug}/`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.projects) {
		try {
			const entities = await ctx.db.projects.search({
				data: { slug: input.projectSlug },
			});
			for (const entity of entities) {
				await ctx.db.projects.deleteByEntityId(entity.entity_id);
			}
		} catch (error) {
			console.warn('Failed to delete project from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.projects.delete',
		{ ...input },
		'completed',
	);
	return true;
};
