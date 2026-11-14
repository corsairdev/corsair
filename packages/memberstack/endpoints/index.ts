import { logEventFromContext } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import type { z } from 'zod';
import { memberstackRequest } from '../client';
import type { MemberstackContext } from '../index';
import { inputs, outputs } from './types';

async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: MemberstackContext,
	operation: { name: string; input: Input; output: Output; empty?: boolean },
	rawInput: z.input<Input>,
	requestOptions: (input: z.output<Input>) => ApiRequestOptions,
): Promise<z.output<Output>> {
	const input = operation.input.parse(rawInput);
	const raw = await memberstackRequest(ctx.key, requestOptions(input));
	const response = operation.output.parse(
		operation.empty && raw === '' ? undefined : raw,
	);
	await logEventFromContext(
		ctx,
		`memberstack.${operation.name}`,
		{},
		'completed',
	);
	return response;
}
const segment = (value: string) => encodeURIComponent(value);
const json = (
	method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
	url: string,
	body: object,
): ApiRequestOptions => ({ method, url, body, mediaType: 'application/json' });

export const Api = {
	membersList: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersList>,
	) =>
		call(
			ctx,
			{
				name: 'membersList',
				input: inputs.membersList,
				output: outputs.membersList,
			},
			input,
			(query) => ({
				method: 'GET',
				url: '/members',
				query,
			}),
		),
	membersGet: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersGet>,
	) =>
		call(
			ctx,
			{
				name: 'membersGet',
				input: inputs.membersGet,
				output: outputs.membersGet,
			},
			input,
			({ id_or_email, include }) => ({
				method: 'GET',
				url: `/members/${segment(id_or_email)}`,
				query: { include },
			}),
		),
	membersCreate: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersCreate>,
	) =>
		call(
			ctx,
			{
				name: 'membersCreate',
				input: inputs.membersCreate,
				output: outputs.membersCreate,
			},
			input,
			(body) => json('POST', '/members', body),
		),
	membersUpdate: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersUpdate>,
	) =>
		call(
			ctx,
			{
				name: 'membersUpdate',
				input: inputs.membersUpdate,
				output: outputs.membersUpdate,
			},
			input,
			({ id, ...body }) => json('PATCH', `/members/${segment(id)}`, body),
		),
	membersDelete: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersDelete>,
	) =>
		call(
			ctx,
			{
				name: 'membersDelete',
				input: inputs.membersDelete,
				output: outputs.membersDelete,
			},
			input,
			({ id, ...body }) =>
				Object.values(body).some((v) => v !== undefined)
					? json('DELETE', `/members/${segment(id)}`, body)
					: { method: 'DELETE', url: `/members/${segment(id)}` },
		),
	membersAddPlan: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersAddPlan>,
	) =>
		call(
			ctx,
			{
				name: 'membersAddPlan',
				input: inputs.membersAddPlan,
				output: outputs.membersAddPlan,
				empty: true,
			},
			input,
			({ id, planId }) =>
				json('POST', `/members/${segment(id)}/add-plan`, { planId }),
		),
	membersRemovePlan: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersRemovePlan>,
	) =>
		call(
			ctx,
			{
				name: 'membersRemovePlan',
				input: inputs.membersRemovePlan,
				output: outputs.membersRemovePlan,
				empty: true,
			},
			input,
			({ id, planId }) =>
				json('POST', `/members/${segment(id)}/remove-plan`, { planId }),
		),
	membersVerifyToken: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.membersVerifyToken>,
	) =>
		call(
			ctx,
			{
				name: 'membersVerifyToken',
				input: inputs.membersVerifyToken,
				output: outputs.membersVerifyToken,
			},
			input,
			(body) => json('POST', '/members/verify-token', body),
		),
	tablesList: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.tablesList>,
	) =>
		call(
			ctx,
			{
				name: 'tablesList',
				input: inputs.tablesList,
				output: outputs.tablesList,
			},
			input,
			() => ({
				method: 'GET',
				url: '/v2/data-tables',
			}),
		),
	tablesGet: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.tablesGet>,
	) =>
		call(
			ctx,
			{ name: 'tablesGet', input: inputs.tablesGet, output: outputs.tablesGet },
			input,
			({ tableKey }) => ({
				method: 'GET',
				url: `/v2/data-tables/${segment(tableKey)}`,
			}),
		),
	recordsCreate: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.recordsCreate>,
	) =>
		call(
			ctx,
			{
				name: 'recordsCreate',
				input: inputs.recordsCreate,
				output: outputs.recordsCreate,
			},
			input,
			({ tableKey, ...body }) =>
				json('POST', `/v2/data-tables/${segment(tableKey)}/records`, body),
		),
	recordsQuery: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.recordsQuery>,
	) =>
		call(
			ctx,
			{
				name: 'recordsQuery',
				input: inputs.recordsQuery,
				output: outputs.recordsQuery,
			},
			input,
			({ tableKey, query }) =>
				json('POST', `/v2/data-tables/${segment(tableKey)}/records/query`, {
					query,
				}),
		),
	recordsUpdate: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.recordsUpdate>,
	) =>
		call(
			ctx,
			{
				name: 'recordsUpdate',
				input: inputs.recordsUpdate,
				output: outputs.recordsUpdate,
			},
			input,
			({ tableKey, recordId, data }) =>
				json(
					'PUT',
					`/v2/data-tables/${segment(tableKey)}/records/${segment(recordId)}`,
					{ data },
				),
		),
	recordsDelete: (
		ctx: MemberstackContext,
		input: z.input<typeof inputs.recordsDelete>,
	) =>
		call(
			ctx,
			{
				name: 'recordsDelete',
				input: inputs.recordsDelete,
				output: outputs.recordsDelete,
			},
			input,
			({ tableKey, recordId }) => ({
				method: 'DELETE',
				url: `/v2/data-tables/${segment(tableKey)}/records/${segment(recordId)}`,
			}),
		),
} as const;
