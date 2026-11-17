import type { TaveEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	JobsCreateInputSchema,
	JobsCreateResponseSchema,
	JobsGetInputSchema,
	JobsGetResponseSchema,
	JobsListInputSchema,
	JobsListResponseSchema,
	JobsPaymentsInputSchema,
	JobsRemoveInputSchema,
	JobsUpdateInputSchema,
	JobsUpdateResponseSchema,
	PaymentsListResponseSchema,
} from './types';

export const list: TaveEndpoints['jobsList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'jobs.list',
			input: JobsListInputSchema,
			output: JobsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/job',
			query: {
				page: parsed.page,
				pageSize: parsed.pageSize,
				sortBy: parsed.sortBy,
				includeClosed: parsed.includeClosed,
				expand: parsed.expand,
				// The API takes the stages comma-separated in one parameter.
				stage: parsed.stage?.join(','),
				leadStatusId: parsed.leadStatusId,
				eventDateFrom: parsed.eventDateFrom,
				eventDateTo: parsed.eventDateTo,
				staleBefore: parsed.staleBefore,
			},
		}),
	);
};

export const get: TaveEndpoints['jobsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'jobs.get',
			input: JobsGetInputSchema,
			output: JobsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/job/${segment(parsed.jobId)}`,
		}),
	);
};

export const create: TaveEndpoints['jobsCreate'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'jobs.create',
			input: JobsCreateInputSchema,
			output: JobsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/job',
			body: parsed,
		}),
	);
};

export const update: TaveEndpoints['jobsUpdate'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'jobs.update',
			input: JobsUpdateInputSchema,
			output: JobsUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { jobId, ...changes } = parsed;
			return { method: 'PUT', path: `/job/${segment(jobId)}`, body: changes };
		},
	);
};

export const remove: TaveEndpoints['jobsRemove'] = async (ctx, input) => {
	return callDelete(
		ctx,
		{ event: 'jobs.remove', input: JobsRemoveInputSchema },
		input,
		(parsed) => ({ method: 'DELETE', path: `/job/${segment(parsed.jobId)}` }),
	);
};

export const payments: TaveEndpoints['jobsPayments'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'jobs.payments',
			input: JobsPaymentsInputSchema,
			output: PaymentsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/job/${segment(parsed.jobId)}/payment`,
		}),
	);
};
