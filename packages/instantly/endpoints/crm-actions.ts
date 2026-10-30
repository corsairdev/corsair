import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const listPhoneNumbers: InstantlyEndpoints['crmActionsListPhoneNumbers'] =
	(ctx, input) =>
		call(
			ctx,
			'crmActionsListPhoneNumbers',
			'crmActions.listPhoneNumbers',
			input,
			() => ({ method: 'GET', path: '/crm-actions/phone-numbers' }),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const deletePhoneNumber: InstantlyEndpoints['crmActionsDeletePhoneNumber'] =
	(ctx, input) =>
		call(
			ctx,
			'crmActionsDeletePhoneNumber',
			'crmActions.deletePhoneNumber',
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/crm-actions/phone-numbers/${segment(id)}`,
			}),
			{ log: ({ id }) => ({ id }) },
		);
