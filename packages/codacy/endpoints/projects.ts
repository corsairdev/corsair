import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type { ListProjectsInput, ListProjectsResponse } from './types';

export const Projects = {
	listProjects: async (
		ctx: CodacyContext,
		input: ListProjectsInput,
	): Promise<ListProjectsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/projects';

		return makeCodacyRequest<ListProjectsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
};
