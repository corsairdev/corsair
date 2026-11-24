import type { MopinionEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MopinionEndpointInputSchemas as Inputs,
	mopinionFilterQuery,
	MopinionEndpointOutputSchemas as Outputs,
} from './types';

/** Reads basic info on one dataset. */
export const get: MopinionEndpoints['datasetsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.get',
			input: Inputs.datasetsGet,
			output: Outputs.datasetsGet,
		},
		input,
		({ datasetId }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetId)}`,
		}),
		{
			log: ({ datasetId }) => ({ datasetId }),
		},
	);

/** Lists the feedback items of a dataset, one page at a time. */
export const feedback: MopinionEndpoints['datasetsFeedback'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasets.feedback',
			input: Inputs.datasetsFeedback,
			output: Outputs.datasetsFeedback,
		},
		input,
		({ datasetId, page, limit, sort, order, filters }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetId)}/feedback`,
			query: {
				page,
				limit,
				sort,
				order,
				...mopinionFilterQuery(filters),
			},
		}),
		{
			log: ({ datasetId }) => ({ datasetId }),
		},
	);

/** Reads one feedback item of a dataset. */
export const feedbackItem: MopinionEndpoints['datasetsFeedbackItem'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasets.feedbackItem',
			input: Inputs.datasetsFeedbackItem,
			output: Outputs.datasetsFeedbackItem,
		},
		input,
		({ datasetId, feedbackId }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetId)}/feedback/${segment(feedbackId)}`,
		}),
		{
			log: ({ datasetId, feedbackId }) => ({ datasetId, feedbackId }),
		},
	);

/** Reads the field definitions of a dataset. */
export const fields: MopinionEndpoints['datasetsFields'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.fields',
			input: Inputs.datasetsFields,
			output: Outputs.datasetsFields,
		},
		input,
		({ datasetId }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetId)}/fields`,
		}),
		{
			log: ({ datasetId }) => ({ datasetId }),
		},
	);
