import type { MopinionEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MopinionEndpointInputSchemas as Inputs,
	mopinionFilterQuery,
	MopinionEndpointOutputSchemas as Outputs,
} from './types';

/** Reads basic info on one report. */
export const get: MopinionEndpoints['reportsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.get',
			input: Inputs.reportsGet,
			output: Outputs.reportsGet,
		},
		input,
		({ reportId }) => ({
			replayable: true,
			method: 'GET',
			path: `/reports/${segment(reportId)}`,
		}),
		{
			log: ({ reportId }) => ({ reportId }),
		},
	);

/** Lists the feedback items collected by a report, one page at a time. */
export const feedback: MopinionEndpoints['reportsFeedback'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.feedback',
			input: Inputs.reportsFeedback,
			output: Outputs.reportsFeedback,
		},
		input,
		({ reportId, page, limit, sort, order, filters }) => ({
			replayable: true,
			method: 'GET',
			path: `/reports/${segment(reportId)}/feedback`,
			query: {
				page,
				limit,
				sort,
				order,
				...mopinionFilterQuery(filters),
			},
		}),
		{
			log: ({ reportId }) => ({ reportId }),
		},
	);

/** Reads one feedback item of a report. */
export const feedbackItem: MopinionEndpoints['reportsFeedbackItem'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.feedbackItem',
			input: Inputs.reportsFeedbackItem,
			output: Outputs.reportsFeedbackItem,
		},
		input,
		({ reportId, feedbackId }) => ({
			replayable: true,
			method: 'GET',
			path: `/reports/${segment(reportId)}/feedback/${segment(feedbackId)}`,
		}),
		{
			log: ({ reportId, feedbackId }) => ({ reportId, feedbackId }),
		},
	);

/** Reads the field definitions of a report. */
export const fields: MopinionEndpoints['reportsFields'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.fields',
			input: Inputs.reportsFields,
			output: Outputs.reportsFields,
		},
		input,
		({ reportId }) => ({
			replayable: true,
			method: 'GET',
			path: `/reports/${segment(reportId)}/fields`,
		}),
		{
			log: ({ reportId }) => ({ reportId }),
		},
	);
