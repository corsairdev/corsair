import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	GetRecentResultsForAllGroupsInputSchema,
	GetRecentResultsForAllGroupsOutputSchema,
	GetRecentResultsForAllLinksInputSchema,
	GetRecentResultsForAllLinksOutputSchema,
	GetRecentResultsForGroupExamInputSchema,
	GetRecentResultsForGroupExamOutputSchema,
	GetRecentResultsForLinkExamInputSchema,
	GetRecentResultsForLinkExamOutputSchema,
} from './types';

export const getRecentResultsForAllGroups: ClassmarkerEndpoints['getRecentResultsForAllGroups'] =
	async (ctx, input) => {
		const parsedInput = GetRecentResultsForAllGroupsInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'getRecentResultsForAllGroups',
			path: '/v1/groups/recent_results.json',
			input: parsedInput,
			inputSchema: GetRecentResultsForAllGroupsInputSchema,
			outputSchema: GetRecentResultsForAllGroupsOutputSchema,
			query: {
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
		});
	};

export const getRecentResultsForAllLinks: ClassmarkerEndpoints['getRecentResultsForAllLinks'] =
	async (ctx, input) => {
		const parsedInput = GetRecentResultsForAllLinksInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'getRecentResultsForAllLinks',
			path: '/v1/links/recent_results.json',
			input: parsedInput,
			inputSchema: GetRecentResultsForAllLinksInputSchema,
			outputSchema: GetRecentResultsForAllLinksOutputSchema,
			query: {
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
		});
	};

export const getRecentResultsForGroupExam: ClassmarkerEndpoints['getRecentResultsForGroupExam'] =
	async (ctx, input) => {
		const parsedInput = GetRecentResultsForGroupExamInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'getRecentResultsForGroupExam',
			path: `/v1/groups/${parsedInput.group_id}/tests/${parsedInput.test_id}/recent_results.json`,
			input: parsedInput,
			inputSchema: GetRecentResultsForGroupExamInputSchema,
			outputSchema: GetRecentResultsForGroupExamOutputSchema,
			query: {
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
			logPayload: {
				group_id: parsedInput.group_id,
				test_id: parsedInput.test_id,
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
		});
	};

export const getRecentResultsForLinkExam: ClassmarkerEndpoints['getRecentResultsForLinkExam'] =
	async (ctx, input) => {
		const parsedInput = GetRecentResultsForLinkExamInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'getRecentResultsForLinkExam',
			path: `/v1/links/${parsedInput.link_id}/tests/${parsedInput.test_id}/recent_results.json`,
			input: parsedInput,
			inputSchema: GetRecentResultsForLinkExamInputSchema,
			outputSchema: GetRecentResultsForLinkExamOutputSchema,
			query: {
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
			logPayload: {
				link_id: parsedInput.link_id,
				test_id: parsedInput.test_id,
				finishedAfterTimestamp: parsedInput.finishedAfterTimestamp,
				limit: parsedInput.limit,
			},
		});
	};
