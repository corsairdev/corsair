import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import type { CheckInsCreateInput } from './types';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

function checkInsPath(projectId: string, suffix = ''): string {
	const base = `/projects/${segment(projectId)}/check_ins`;
	return suffix ? `${base}/${suffix}` : base;
}

/** The writable check-in fields, shared by create, update and replace. */
type CheckInWriteBody = Partial<
	Pick<
		CheckInsCreateInput,
		| 'name'
		| 'slug'
		| 'schedule_type'
		| 'report_period'
		| 'grace_period'
		| 'cron_schedule'
		| 'cron_timezone'
	>
>;

/** The fields a check-in write sends, dropping the ones the caller left out. */
function writeBody(parsed: CheckInWriteBody): CheckInWriteBody {
	const body: CheckInWriteBody = {};
	for (const key of [
		'name',
		'slug',
		'schedule_type',
		'report_period',
		'grace_period',
		'cron_schedule',
		'cron_timezone',
	] as const) {
		// A field the caller left out keeps its value; a null resets it.
		if (key in parsed) Object.assign(body, { [key]: parsed[key] });
	}
	return body;
}

export const checkInsList: HoneybadgerEndpoints['checkInsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.list',
			input: Inputs['checkIns.list'],
			output: Outputs['checkIns.list'],
		},
		input,
		({ project_id, page, per_page }) => ({
			method: 'GET',
			path: checkInsPath(project_id),
			query: { page, per_page },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const checkInsGet: HoneybadgerEndpoints['checkInsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checkIns.get',
			input: Inputs['checkIns.get'],
			output: Outputs['checkIns.get'],
		},
		input,
		({ project_id, check_in_id }) => ({
			method: 'GET',
			path: checkInsPath(project_id, segment(check_in_id)),
		}),
		{ log: ({ check_in_id }) => ({ checkInId: check_in_id }) },
	);

export const checkInsCreate: HoneybadgerEndpoints['checkInsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.create',
			input: Inputs['checkIns.create'],
			output: Outputs['checkIns.create'],
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: checkInsPath(parsed.project_id),
			body: writeBody(parsed),
			// A slug is unique per project, so a replay fails on the second
			// attempt rather than creating a second check-in, but it still fails.
			replayable: false,
		}),
		{
			log: ({ slug, name }) => ({
				slug: slug ?? undefined,
				name: name ?? undefined,
			}),
		},
	);

export const checkInsUpdate: HoneybadgerEndpoints['checkInsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.update',
			input: Inputs['checkIns.update'],
			output: Outputs['checkIns.update'],
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: checkInsPath(parsed.project_id, segment(parsed.check_in_id)),
			body: writeBody(parsed),
			replayable: true,
		}),
		{ log: ({ check_in_id }) => ({ checkInId: check_in_id }) },
	);

export const checkInsDelete: HoneybadgerEndpoints['checkInsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.delete',
			input: Inputs['checkIns.delete'],
			output: Outputs['checkIns.delete'],
		},
		input,
		({ project_id, check_in_id }) => ({
			method: 'DELETE',
			path: checkInsPath(project_id, segment(check_in_id)),
		}),
		{
			shape: (raw, { project_id, check_in_id }) =>
				confirmDeleted(raw, { project_id, check_in_id }),
			log: ({ check_in_id }) => ({ checkInId: check_in_id }),
		},
	);

export const checkInsReplace: HoneybadgerEndpoints['checkInsReplace'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.replace',
			input: Inputs['checkIns.replace'],
			output: Outputs['checkIns.replace'],
		},
		input,
		({ project_id, check_ins }) => ({
			method: 'PUT',
			path: checkInsPath(project_id, 'bulk_update'),
			body: {
				check_ins: check_ins.map((entry) => ({
					...writeBody(entry),
					slug: entry.slug,
				})),
			},
			// This deletes every check-in the list does not name, so a replay that
			// runs after someone added one would delete that one too.
			replayable: false,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const checkInsEvents: HoneybadgerEndpoints['checkInsEvents'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkIns.events',
			input: Inputs['checkIns.events'],
			output: Outputs['checkIns.events'],
		},
		input,
		({ project_id, check_in_id, limit, created_before }) => ({
			method: 'GET',
			path: checkInsPath(project_id, `${segment(check_in_id)}/events`),
			query: { limit, created_before },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
