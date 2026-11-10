import type { ReamazeEndpoints } from '..';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['staffList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'staff.list',
			input: Inputs.staffList,
			output: Outputs.staffList,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/staff',
			query: queryOf({ page }),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'staff list'),
				staff: unwrapList(raw, 'staff', 'staff list'),
			}),
			log: (_, result) => ({ count: result.staff.length }),
		},
	);

export const create: ReamazeEndpoints['staffCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'staff.create',
			input: Inputs.staffCreate,
			output: Outputs.staffCreate,
		},
		input,
		({ name, email, password }) => ({
			method: 'POST',
			path: '/staff',
			body: { staff: { name, email, password } },
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created staff user'),
			log: (parsed) => ({ email: parsed.email }),
		},
	);
