import type { TwoCaptchaEndpoints } from '..';
import { call } from './call';
import {
	TwoCaptchaEndpointInputSchemas,
	TwoCaptchaEndpointOutputSchemas,
} from './types';

/** https://2captcha.com/api-docs/get-balance */
export const getBalance: TwoCaptchaEndpoints['accountBalance'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.balance',
			method: 'getBalance',
			input: TwoCaptchaEndpointInputSchemas.getBalance,
			output: TwoCaptchaEndpointOutputSchemas.getBalance,
		},
		input,
		() => ({}),
	);

/**
 * Reports an answer the site accepted. https://2captcha.com/api-docs/report-correct
 */
export const reportCorrect: TwoCaptchaEndpoints['accountReportCorrect'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'account.reportCorrect',
				method: 'reportCorrect',
				input: TwoCaptchaEndpointInputSchemas.reportCorrect,
				output: TwoCaptchaEndpointOutputSchemas.reportCorrect,
			},
			input,
			(parsed) => ({ taskId: parsed.task_id }),
			{ log: (parsed) => ({ task_id: parsed.task_id }) },
		);

/**
 * Reports an answer the site rejected. 2Captcha reviews the complaint and may
 * refund the task; it does not solve it again. A report cannot be taken back.
 * https://2captcha.com/api-docs/report-incorrect
 */
export const reportIncorrect: TwoCaptchaEndpoints['accountReportIncorrect'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'account.reportIncorrect',
				method: 'reportIncorrect',
				input: TwoCaptchaEndpointInputSchemas.reportIncorrect,
				output: TwoCaptchaEndpointOutputSchemas.reportIncorrect,
			},
			input,
			(parsed) => ({ taskId: parsed.task_id }),
			{ log: (parsed) => ({ task_id: parsed.task_id }) },
		);
