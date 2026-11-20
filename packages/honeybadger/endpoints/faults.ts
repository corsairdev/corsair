import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeleted } from './call';
import type { FaultsResolveInput, FaultsUpdateInput } from './types';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

const projects = '/projects';

function faultPath(projectId: string, faultId: string): string {
	return `${projects}/${segment(projectId)}/faults/${segment(faultId)}`;
}

export const list: HoneybadgerEndpoints['faultsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.list',
			input: Inputs['faults.list'],
			output: Outputs['faults.list'],
		},
		input,
		({
			project_id,
			q,
			order,
			sort,
			created_after,
			occurred_after,
			occurred_before,
			page,
			per_page,
		}) => ({
			method: 'GET',
			path: `${projects}/${segment(project_id)}/faults`,
			query: {
				q,
				order,
				sort,
				created_after,
				occurred_after,
				occurred_before,
				page,
				per_page,
			},
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: HoneybadgerEndpoints['faultsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.get',
			input: Inputs['faults.get'],
			output: Outputs['faults.get'],
		},
		input,
		({ project_id, fault_id }) => ({
			method: 'GET',
			path: faultPath(project_id, fault_id),
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const update: HoneybadgerEndpoints['faultsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.update',
			input: Inputs['faults.update'],
			output: Outputs['faults.update'],
		},
		input,
		(parsed) => {
			const body: Partial<
				Pick<
					FaultsUpdateInput,
					'resolved' | 'ignored' | 'assignee_id' | 'tags' | 'resolve_on_deploy'
				>
			> = {};
			for (const key of [
				'resolved',
				'ignored',
				'assignee_id',
				'tags',
				'resolve_on_deploy',
			] as const) {
				// A field the caller left out stays unchanged; a null clears it.
				if (key in parsed) Object.assign(body, { [key]: parsed[key] });
			}
			return {
				method: 'PATCH',
				path: faultPath(parsed.project_id, parsed.fault_id),
				body,
				replayable: true,
			};
		},
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const remove: HoneybadgerEndpoints['faultsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.delete',
			input: Inputs['faults.delete'],
			output: Outputs['faults.delete'],
		},
		input,
		({ project_id, fault_id }) => ({
			method: 'DELETE',
			path: faultPath(project_id, fault_id),
		}),
		{
			shape: (raw, { project_id, fault_id }) =>
				confirmDeleted(raw, { project_id, fault_id }),
			log: ({ fault_id }) => ({ faultId: fault_id }),
		},
	);

/**
 * The four bulk state changes share one request shape: a selector in the body
 * and a count back. Resolve, ignore, unresolve and unignore differ only in the
 * action segment.
 */
function bulkStateChange(
	action: 'resolve' | 'unresolve' | 'ignore' | 'unignore',
) {
	return (ctx: Parameters<typeof call>[0], input: FaultsResolveInput) =>
		call(
			ctx,
			{
				event: `faults.${action}`,
				input: Inputs[`faults.${action}`],
				output: Outputs[`faults.${action}`],
			},
			input,
			({
				project_id,
				fault_ids,
				all,
				dry_run,
				q,
				created_after,
				occurred_after,
				occurred_before,
			}) => ({
				method: 'POST',
				path: `${projects}/${segment(project_id)}/faults/${action}`,
				body: {
					fault_ids,
					all,
					dry_run,
					q,
					created_after,
					occurred_after,
					occurred_before,
				},
				// Bulk selection is relative to "now", so repeating it can match a
				// different set of faults than the first attempt did.
				replayable: false,
			}),
			{ log: (_, result) => ({ count: result.data.count }) },
		);
}

export const resolve: HoneybadgerEndpoints['faultsResolve'] =
	bulkStateChange('resolve');
export const unresolve: HoneybadgerEndpoints['faultsUnresolve'] =
	bulkStateChange('unresolve');
export const ignore: HoneybadgerEndpoints['faultsIgnore'] =
	bulkStateChange('ignore');
export const unignore: HoneybadgerEndpoints['faultsUnignore'] =
	bulkStateChange('unignore');

export const summary: HoneybadgerEndpoints['faultsSummary'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.summary',
			input: Inputs['faults.summary'],
			output: Outputs['faults.summary'],
		},
		input,
		({ project_id, q, created_after, occurred_after, occurred_before }) => ({
			method: 'GET',
			path: `${projects}/${segment(project_id)}/faults/summary`,
			query: { q, created_after, occurred_after, occurred_before },
		}),
		{ log: (_, result) => ({ total: result.data.total }) },
	);

export const assign: HoneybadgerEndpoints['faultsAssign'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.assign',
			input: Inputs['faults.assign'],
			output: Outputs['faults.assign'],
		},
		input,
		({ project_id, fault_id, assignee_id }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/assign`,
			body: { assignee_id },
			replayable: true,
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const unassign: HoneybadgerEndpoints['faultsUnassign'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.unassign',
			input: Inputs['faults.unassign'],
			output: Outputs['faults.unassign'],
		},
		input,
		({ project_id, fault_id }) => ({
			method: 'DELETE',
			path: `${faultPath(project_id, fault_id)}/assign`,
			// Removing an assignment that is already gone leaves it gone.
			replayable: true,
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const merge: HoneybadgerEndpoints['faultsMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.merge',
			input: Inputs['faults.merge'],
			output: Outputs['faults.merge'],
		},
		input,
		({ project_id, fault_id, target_fault_id }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/merge`,
			body: { target_fault_id },
			// The merge runs in the background, so a second request would queue a
			// second merge of a fault that is already moving.
			replayable: false,
		}),
		{
			log: ({ fault_id, target_fault_id }) => ({
				faultId: fault_id,
				targetFaultId: target_fault_id,
			}),
		},
	);

export const pauseRecording: HoneybadgerEndpoints['faultsPauseRecording'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'faults.pauseRecording',
			input: Inputs['faults.pauseRecording'],
			output: Outputs['faults.pauseRecording'],
		},
		input,
		({ project_id, fault_id, time }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/pause_recording`,
			body: { time },
			// Pausing again replaces the end time, so a replay extends the pause.
			replayable: false,
		}),
		{ log: ({ fault_id, time }) => ({ faultId: fault_id, time }) },
	);

export const resumeRecording: HoneybadgerEndpoints['faultsResumeRecording'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'faults.resumeRecording',
			input: Inputs['faults.resumeRecording'],
			output: Outputs['faults.resumeRecording'],
		},
		input,
		({ project_id, fault_id }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/resume_recording`,
			// A fault that is not paused is left as it is, so repeating this is
			// what it already means.
			replayable: true,
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const snooze: HoneybadgerEndpoints['faultsSnooze'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.snooze',
			input: Inputs['faults.snooze'],
			output: Outputs['faults.snooze'],
		},
		input,
		({ project_id, fault_id, time, count }) => ({
			method: 'POST',
			path: `${faultPath(project_id, fault_id)}/snooze`,
			body: { time, count },
			// A new snooze replaces the existing one, so a replay restarts it.
			replayable: false,
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const unsnooze: HoneybadgerEndpoints['faultsUnsnooze'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'faults.unsnooze',
			input: Inputs['faults.unsnooze'],
			output: Outputs['faults.unsnooze'],
		},
		input,
		({ project_id, fault_id }) => ({
			method: 'DELETE',
			path: `${faultPath(project_id, fault_id)}/snooze`,
			replayable: true,
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);

export const affectedUsers: HoneybadgerEndpoints['faultsAffectedUsers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'faults.affectedUsers',
			input: Inputs['faults.affectedUsers'],
			output: Outputs['faults.affectedUsers'],
		},
		input,
		({ project_id, fault_id, q }) => ({
			method: 'GET',
			path: `${faultPath(project_id, fault_id)}/affected_users`,
			query: { q },
		}),
		// The affected user can be an email address, so only the count is logged.
		{ log: (_, result) => ({ users: result.data.length }) },
	);

export const occurrences: HoneybadgerEndpoints['faultsOccurrences'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'faults.occurrences',
			input: Inputs['faults.occurrences'],
			output: Outputs['faults.occurrences'],
		},
		input,
		({ project_id, fault_id, occurred_after, occurred_before, q }) => ({
			method: 'GET',
			path: `${faultPath(project_id, fault_id)}/occurrences`,
			query: { occurred_after, occurred_before, q },
		}),
		{ log: ({ fault_id }) => ({ faultId: fault_id }) },
	);
