import type { RampEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape, singleShape } from './shape';
import {
	RampEndpointInputSchemas as Inputs,
	RampEndpointOutputSchemas as Outputs,
} from './types';

export const list: RampEndpoints['reimbursementsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reimbursements.list',
			input: Inputs.reimbursementsList,
			output: Outputs.reimbursementsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/reimbursements',
			query: queryOf({
				direction: parsed.direction,
				state: parsed.state,
				sync_status: parsed.sync_status,
				user_id: parsed.user_id,
				entity_id: parsed.entity_id,
				trip_id: parsed.trip_id,
				has_been_approved: parsed.has_been_approved,
				sync_ready: parsed.sync_ready,
				has_no_sync_commits: parsed.has_no_sync_commits,
				from_date: parsed.from_date,
				to_date: parsed.to_date,
				from_submitted_at: parsed.from_submitted_at,
				to_submitted_at: parsed.to_submitted_at,
				from_transaction_date: parsed.from_transaction_date,
				to_transaction_date: parsed.to_transaction_date,
				updated_after: parsed.updated_after,
				synced_after: parsed.synced_after,
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('reimbursements'),
			log: (_, result) => ({
				count: result.reimbursements.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const memoGet: RampEndpoints['memosGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memos.get',
			input: Inputs.memosGet,
			output: Outputs.memosGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/memos/${segment(parsed.transaction_id)}`,
		}),
		{
			shape: singleShape('memo'),
			log: (parsed) => ({ transactionId: parsed.transaction_id }),
		},
	);

export const memoCreate: RampEndpoints['memosCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memos.create',
			input: Inputs.memosCreate,
			output: Outputs.memosCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/memos/${segment(parsed.transaction_id)}`,
			body: { memo: parsed.memo },
		}),
		{
			shape: singleShape('memo'),
			// The memo text is caller business data, so only the id is logged.
			log: (parsed) => ({
				transactionId: parsed.transaction_id,
				length: parsed.memo.length,
			}),
		},
	);

export const departmentsList: RampEndpoints['departmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'departments.list',
			input: Inputs.departmentsList,
			output: Outputs.departmentsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/departments',
			query: queryOf({
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('departments'),
			log: (_, result) => ({
				count: result.departments.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const departmentsCreate: RampEndpoints['departmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'departments.create',
			input: Inputs.departmentsCreate,
			output: Outputs.departmentsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/departments',
			body: { name: parsed.name },
		}),
		{
			shape: singleShape('department'),
			log: (_, result) => ({ departmentId: result.department.id ?? '' }),
		},
	);

export const usersList: RampEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/users',
			query: queryOf({
				email: parsed.email,
				role: parsed.role,
				status: parsed.status,
				employee_id: parsed.employee_id,
				entity_id: parsed.entity_id,
				department_id: parsed.department_id,
				location_id: parsed.location_id,
				start: parsed.start,
				page_size: parsed.page_size,
			}),
		}),
		{
			shape: pagedShape('users'),
			log: (_, result) => ({
				count: result.users.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const usersGet: RampEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/users/${segment(parsed.user_id)}`,
		}),
		{
			shape: singleShape('user'),
			log: (_, result) => ({ userId: result.user.id ?? '' }),
		},
	);

export const businessGet: RampEndpoints['businessGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'business.get',
			input: Inputs.businessGet,
			output: Outputs.businessGet,
		},
		input,
		() => ({ method: 'GET', path: '/business' }),
		{
			shape: singleShape('business'),
			log: (_, result) => ({ businessId: result.business.id ?? '' }),
		},
	);
