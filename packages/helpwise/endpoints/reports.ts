import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { makeHelpwiseRequest } from '../client';
import type {
	ReportsGetOverallResponse,
	ReportsGetTagsResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const getOverall: HelpwiseEndpoint<'reports.getOverall'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['reports.getOverall'].parse(input);

	const query: Record<string, string | number | number[] | undefined> = {
		start: parsedInput.start,
		end: parsedInput.end,
	};
	if (parsedInput.inboxId !== undefined) query.inboxId = parsedInput.inboxId;
	if (parsedInput.tagId && parsedInput.tagId.length > 0) {
		query['tagId[]'] = parsedInput.tagId;
	}
	if (parsedInput.isBusinessHours !== undefined) {
		query.isBusinessHours = parsedInput.isBusinessHours;
	}

	const response = await makeHelpwiseRequest<ReportsGetOverallResponse>(
		'/reports',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['reports.getOverall'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.reports.getOverall',
		{},
		'completed',
	);
	return parsed;
};

export const getTags: HelpwiseEndpoint<'reports.getTags'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['reports.getTags'].parse(input);

	const query: Record<string, string | number | number[] | undefined> = {
		start: parsedInput.start,
		end: parsedInput.end,
	};
	if (parsedInput.tagId && parsedInput.tagId.length > 0) {
		query['tagId[]'] = parsedInput.tagId;
	}
	if (parsedInput.isBusinessHours !== undefined) {
		query.isBusinessHours = parsedInput.isBusinessHours;
	}

	const response = await makeHelpwiseRequest<ReportsGetTagsResponse>(
		`/inboxes/${encodeURIComponent(parsedInput.inboxId)}/reports/tags`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['reports.getTags'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.reports.getTags',
		{ inboxId: parsedInput.inboxId },
		'completed',
	);
	return parsed;
};
