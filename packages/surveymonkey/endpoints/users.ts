import type { SurveymonkeyEndpoints } from '..';
import { call } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The token's own account. A SurveyMonkey token only reaches the account that
 * authorized it, so this is the cheapest way to confirm a connection works and
 * to read the account type, which decides whether response details are readable.
 */
export const getMe: SurveymonkeyEndpoints['usersGetMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.getMe',
			input: Inputs.usersGetMe,
			output: Outputs.usersGetMe,
		},
		input,
		() => ({ method: 'GET', path: '/users/me' }),
		{
			log: (_, result) => ({
				userId: result.id,
				accountType: result.account_type ?? undefined,
			}),
		},
	);
