import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	GetAllGroupsLinksExamsInputSchema,
	GetAllGroupsLinksExamsOutputSchema,
} from './types';

export const getAllGroupsLinksExams: ClassmarkerEndpoints['getAllGroupsLinksExams'] =
	async (ctx, input) =>
		runClassmarkerEndpoint(ctx, {
			operation: 'getAllGroupsLinksExams',
			path: '/v1.json',
			input,
			inputSchema: GetAllGroupsLinksExamsInputSchema,
			outputSchema: GetAllGroupsLinksExamsOutputSchema,
		});
