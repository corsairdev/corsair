import type { TalentHREndpoints } from '..';
import { call } from './call';
import {
	EmploymentStatusOptionsResponseSchema,
	ReferenceListInputSchema,
} from './types';

export const employmentStatuses: TalentHREndpoints['referenceDataEmploymentStatuses'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'referenceData.employmentStatuses',
				input: ReferenceListInputSchema,
				output: EmploymentStatusOptionsResponseSchema,
			},
			input,
			() => ({ method: 'GET', path: '/employment-statuses' }),
		);
	};
