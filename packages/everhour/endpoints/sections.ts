import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourSection } from '../schema/database';

export const listSections: EverhourEndpoints['listSections'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourSection[]>(
		`/projects/${options.projectId}/sections`,
		ctx.key,
	);
};

export const getSection: EverhourEndpoints['getSection'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourSection>(
		`/sections/${options.sectionId}`,
		ctx.key,
	);
};

export const createSection: EverhourEndpoints['createSection'] = async (
	ctx,
	options,
) => {
	const { projectId, ...body } = options;
	return makeEverhourRequest<EverhourSection>(
		`/projects/${projectId}/sections`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);
};

export const deleteSection: EverhourEndpoints['deleteSection'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(`/sections/${options.sectionId}`, ctx.key, {
		method: 'DELETE',
	});
};
