import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['statusPagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'statusPages.list',
			input: Inputs.statusPagesList,
			output: Outputs.statusPagesList,
		},
		input,
		({ limit, cursor }) => ({
			method: 'GET',
			path: '/psps',
			query: { limit, cursor },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const get: UptimeRobotEndpoints['statusPagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'statusPages.get',
			input: Inputs.statusPagesGet,
			output: Outputs.statusPagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/psps/${segment(id)}` }),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const create: UptimeRobotEndpoints['statusPagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'statusPages.create',
			input: Inputs.statusPagesCreate,
			output: Outputs.statusPagesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/psps', body }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				urlKey: result.urlKey ?? undefined,
			}),
		},
	);

export const remove: UptimeRobotEndpoints['statusPagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'statusPages.delete',
			input: Inputs.statusPagesDelete,
			output: Outputs.statusPagesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/psps/${segment(id)}` }),
		{
			// UptimeRobot documents a 200 with no body here.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

export const announcements: UptimeRobotEndpoints['statusPagesAnnouncements'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'statusPages.announcements',
			input: Inputs.statusPagesAnnouncements,
			output: Outputs.statusPagesAnnouncements,
		},
		input,
		({ pspId, limit, cursor, status }) => ({
			method: 'GET',
			path: `/psps/${segment(pspId)}/announcements`,
			query: { limit, cursor, status },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const createAnnouncement: UptimeRobotEndpoints['statusPagesCreateAnnouncement'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'statusPages.createAnnouncement',
				input: Inputs.statusPagesCreateAnnouncement,
				output: Outputs.statusPagesCreateAnnouncement,
			},
			input,
			({ pspId, ...body }) => ({
				method: 'POST',
				path: `/psps/${segment(pspId)}/announcements`,
				body,
			}),
			{
				log: (parsed, result) => ({
					psp: parsed.pspId,
					id: result.id ?? undefined,
					status: parsed.status,
				}),
			},
		);
