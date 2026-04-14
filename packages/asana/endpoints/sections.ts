import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['sectionsGet'] = async (ctx, input) => {
	const { section_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsGet']>(
		`sections/${section_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.sections) {
		try {
			await ctx.db.sections.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save section to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.sections.get',
		{ section_gid },
		'completed',
	);
	return result;
};

export const list: AsanaEndpoints['sectionsList'] = async (ctx, input) => {
	const { project_gid, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsList']>(
		`projects/${project_gid}/sections`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.sections) {
		try {
			for (const section of result.data) {
				if (section.gid) {
					await ctx.db.sections.upsertByEntityId(section.gid, { ...section });
				}
			}
		} catch (error) {
			console.warn('Failed to save sections to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.sections.list',
		{ project_gid },
		'completed',
	);
	return result;
};

export const create: AsanaEndpoints['sectionsCreate'] = async (ctx, input) => {
	const { project_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsCreate']>(
		`projects/${project_gid}/sections`,
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.sections) {
		try {
			await ctx.db.sections.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save section to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.sections.create',
		{ project_gid, name: data.name },
		'completed',
	);
	return result;
};

export const update: AsanaEndpoints['sectionsUpdate'] = async (ctx, input) => {
	const { section_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsUpdate']>(
		`sections/${section_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.sections) {
		try {
			await ctx.db.sections.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to update section in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.sections.update',
		{ section_gid },
		'completed',
	);
	return result;
};

export const deleteSection: AsanaEndpoints['sectionsDelete'] = async (
	ctx,
	input,
) => {
	const { section_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsDelete']>(
		`sections/${section_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.sections.delete',
		{ section_gid },
		'completed',
	);
	return result;
};

export const insert: AsanaEndpoints['sectionsInsert'] = async (ctx, input) => {
	const { project_gid, data, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['sectionsInsert']>(
		`projects/${project_gid}/sections/insert`,
		ctx.key,
		{ method: 'POST', body: { data }, query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.sections.insert',
		{ project_gid },
		'completed',
	);
	return result;
};
