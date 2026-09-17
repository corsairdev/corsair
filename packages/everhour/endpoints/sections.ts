import { makeEverhourRequest } from '../client';
import type { EverhourSection } from '../schema/database';

export const listSections = async (
	ctx: any,
	options: { projectId: string },
) => {
	return makeEverhourRequest<EverhourSection[]>(
		`/projects/${options.projectId}/sections`,
		ctx.key,
	);
};

export const getSection = async (ctx: any, options: { sectionId: string }) => {
	return makeEverhourRequest<EverhourSection>(
		`/sections/${options.sectionId}`,
		ctx.key,
	);
};

export const createSection = async (
	ctx: any,
	options: {
		projectId: string;
		name: string;
		status?: 'open' | 'archived';
		collapsed?: boolean;
	},
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

export const deleteSection = async (
	ctx: any,
	options: { sectionId: string },
) => {
	return makeEverhourRequest<void>(`/sections/${options.sectionId}`, ctx.key, {
		method: 'DELETE',
	});
};
