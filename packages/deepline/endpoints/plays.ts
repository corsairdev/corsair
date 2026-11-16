import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	GetPlayInputSchema,
	GetPlayOutputSchema,
	GetPlaysActivityInputSchema,
	GetPlaysActivityOutputSchema,
	ListPlaysInputSchema,
	ListPlaysOutputSchema,
	StartPlayRunInputSchema,
	StartPlayRunOutputSchema,
} from './types';
export const run = defineEndpoint({
	event: 'deepline.plays.run',
	input: StartPlayRunInputSchema,
	output: StartPlayRunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/run`, ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				input: input.input,
				revisionId: input.revisionId,
				force: input.force,
				forceToolRefresh: input.forceToolRefresh,
				maxCredits: input.maxCredits,
				maxConcurrentExternalCalls: input.maxConcurrentExternalCalls,
				maxConcurrentRows: input.maxConcurrentRows,
				waitForCompletionMs: input.waitForCompletionMs,
				terminalStatus: input.terminalStatus,
			},
		}),
});
export const list = defineEndpoint({
	event: 'deepline.plays.list',
	input: ListPlaysInputSchema,
	output: ListPlaysOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays`, ctx.key, {
			method: 'GET',
			query: {
				summary_only: input.summary_only,
				grep: input.search,
				inventory_paginated: input.search?.trim() ? undefined : '1',
				cursor: input.cursor,
				origin: input.origin,
				limit: input.limit,
			},
		}),
});
export const activity = defineEndpoint({
	event: 'deepline.plays.activity',
	input: GetPlaysActivityInputSchema,
	output: GetPlaysActivityOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/activity`, ctx.key, {
			method: 'POST',
			body: {
				timeZone: input.timeZone,
				days: input.days,
				endDate: input.endDate,
				groupBy: input.groupBy,
			},
		}),
});
export const get = defineEndpoint({
	event: 'deepline.plays.get',
	input: GetPlayInputSchema,
	output: GetPlayOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}`, ctx.key, {
			method: 'GET',
		}),
});
