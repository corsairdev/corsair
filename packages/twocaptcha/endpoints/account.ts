import type { TwoCaptchaEndpoints } from '..';
import { call } from './call';
import {
	TwoCaptchaEndpointInputSchemas,
	TwoCaptchaEndpointOutputSchemas,
} from './types';

export const getBalance: TwoCaptchaEndpoints['accountBalance'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.balance',
			input: TwoCaptchaEndpointInputSchemas.getBalance,
			output: TwoCaptchaEndpointOutputSchemas.getBalance,
		},
		input,
		() => ({ method: 'GET', path: 'getBalance' }),
		{
			log: (_parsed, result) => ({
				balance:
					result.request === undefined ? undefined : Number(result.request),
			}),
		},
	);

/** Reports a token the site accepted, which improves the account's rating. */
export const reportCorrect: TwoCaptchaEndpoints['accountReportCorrect'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'account.reportCorrect',
				input: TwoCaptchaEndpointInputSchemas.reportCorrect,
				output: TwoCaptchaEndpointOutputSchemas.reportCorrect,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: 'reportCorrect',
				query: { taskId: parsed.task_id },
			}),
			{ log: (parsed) => ({ task_id: parsed.task_id }) },
		);

/**
 * Reports a token the site rejected. The provider refunds the task and asks the
 * same kind again, so this is the only way to recover a mis-solved captcha.
 */
export const reportIncorrect: TwoCaptchaEndpoints['accountReportIncorrect'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'account.reportIncorrect',
				input: TwoCaptchaEndpointInputSchemas.reportIncorrect,
				output: TwoCaptchaEndpointOutputSchemas.reportIncorrect,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: 'reportIncorrect',
				query: { taskId: parsed.task_id },
			}),
			{ log: (parsed) => ({ task_id: parsed.task_id }) },
		);
