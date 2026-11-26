import type { MailerLiteContext, MailerLiteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MailerLiteEndpointInputSchemas as Inputs,
	MailerLiteEndpointOutputSchemas as Outputs,
} from './types';

export const list: MailerLiteEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/campaigns',
			query: {
				'filter[status]': parsed.filterStatus,
				'filter[type]': parsed.filterType,
				'filter[date_from]': parsed.filterDateFrom,
				'filter[date_to]': parsed.filterDateTo,
				'filter[folder]': parsed.filterFolder,
				'filter[subject]': parsed.filterSubject,
				limit: parsed.limit,
				page: parsed.page,
			},
			replayable: true,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const create: MailerLiteEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		({
			name,
			type,
			language_id,
			emails,
			groups,
			segments,
			ab_settings,
			resend_settings,
			multivariate_settings,
			settings,
		}) => ({
			method: 'POST',
			path: '/campaigns',
			body: {
				name,
				type,
				language_id,
				emails,
				groups,
				segments,
				ab_settings,
				resend_settings,
				multivariate_settings,
				settings,
			},
			// Draft only: nothing is sent until campaigns.schedule runs.
			replayable: false,
		}),
		{ log: (_, result) => ({ campaignId: result.data.id }) },
	);

export const schedule: MailerLiteEndpoints['campaignsSchedule'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.schedule',
			input: Inputs.campaignsSchedule,
			output: Outputs.campaignsSchedule,
		},
		input,
		({ campaignId, delivery, schedule, resend, sending_time_test_schedule }) => ({
			method: 'POST',
			path: `/campaigns/${segment(campaignId)}/schedule`,
			body: { delivery, schedule, resend, sending_time_test_schedule },
			// Sends real email to every recipient. An instant delivery answers
			// status sent in this response, so a blind replay could mail the list
			// twice.
			replayable: false,
		}),
		{ log: (_, result) => ({ campaignId: result.data.id, status: result.data.status }) },
	);

export const cancel: MailerLiteEndpoints['campaignsCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.cancel',
			input: Inputs.campaignsCancel,
			output: Outputs.campaignsCancel,
		},
		input,
		({ campaignId }) => ({
			method: 'POST',
			path: `/campaigns/${segment(campaignId)}/cancel`,
			replayable: false,
		}),
		{ log: (_, result) => ({ campaignId: result.data.id, status: result.data.status }) },
	);

export const activity: MailerLiteEndpoints['campaignsActivity'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.activity',
			input: Inputs.campaignsActivity,
			output: Outputs.campaignsActivity,
		},
		input,
		(parsed) => ({
			// Docs specify GET. The official mailerlite-nodejs SDK sends POST for
			// this route; the docs win, and the GET route was verified live.
			method: 'GET',
			path: `/campaigns/${segment(parsed.campaignId)}/reports/subscriber-activity`,
			query: {
				'filter[type]': parsed.filterType,
				'filter[search]': parsed.filterSearch,
				limit: parsed.limit,
				sort: parsed.sort,
				page: parsed.page,
				include: parsed.include,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				total: result.meta.total ?? undefined,
			}),
		},
	);
