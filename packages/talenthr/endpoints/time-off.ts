import type { TalentHREndpoints } from '..';
import { call } from './call';
import {
	DeletedResponseSchema,
	TimeOffBudgetsInputSchema,
	TimeOffBudgetsResponseSchema,
	TimeOffCreateInputSchema,
	TimeOffCreateResponseSchema,
	TimeOffListInputSchema,
	TimeOffListResponseSchema,
	TimeOffRemoveInputSchema,
	TimeOffReplyInputSchema,
	TimeOffTypesInputSchema,
	TimeOffTypesResponseSchema,
} from './types';

export const list: TalentHREndpoints['timeOffList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'timeOff.list',
			input: TimeOffListInputSchema,
			output: TimeOffListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/employees/${parsed.employeeId}/time-off-requests`,
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				sort: parsed.sort,
			},
		}),
	);
};

export const create: TalentHREndpoints['timeOffCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'timeOff.create',
			input: TimeOffCreateInputSchema,
			output: TimeOffCreateResponseSchema,
		},
		input,
		// The route is documented as multipart/form-data, so every value goes in
		// as text. amount_options is a JSON string inside one part.
		(parsed) => ({
			method: 'POST',
			path: `/employees/${parsed.employeeId}/time-off-requests-advanced`,
			formData: {
				start_date: parsed.start_date,
				end_date: parsed.end_date,
				timeoff_type_id: String(parsed.timeoff_type_id),
				preapproved:
					parsed.preapproved === undefined
						? undefined
						: String(parsed.preapproved),
				note: parsed.note,
				amount_options:
					parsed.amountOptions === undefined
						? undefined
						: JSON.stringify(parsed.amountOptions),
			},
		}),
	);
};

export const remove: TalentHREndpoints['timeOffRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'timeOff.remove',
			input: TimeOffRemoveInputSchema,
			output: DeletedResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/employees/${parsed.employeeId}/time-off-requests/${parsed.timeOffRequestId}`,
		}),
	);
};

export const reply: TalentHREndpoints['timeOffReply'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'timeOff.reply',
			input: TimeOffReplyInputSchema,
			output: DeletedResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/employees/${parsed.employeeId}/time-off-requests/${parsed.timeOffRequestId}/reply`,
			body: { accept: parsed.accept },
		}),
	);
};

export const types: TalentHREndpoints['timeOffTypes'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'timeOff.types',
			input: TimeOffTypesInputSchema,
			output: TimeOffTypesResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/time-off-types' }),
	);
};

export const budgets: TalentHREndpoints['timeOffBudgets'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'timeOff.budgets',
			input: TimeOffBudgetsInputSchema,
			output: TimeOffBudgetsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/employees/${parsed.employeeId}/time-off-budgets`,
		}),
	);
};
