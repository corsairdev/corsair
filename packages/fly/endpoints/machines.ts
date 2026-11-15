import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import {
	appName,
	lease,
	leaseNonce,
	machine,
	machineConfigInput,
	machineEvent,
	machineId,
	nonEmpty,
	ok,
	orgMachine,
	orgSlug,
	processStat,
	stopSignal,
} from './schemas';

const target = { app_name: appName, machine_id: machineId };
type Target = { app_name: string; machine_id: string };
const machinePath = ({ app_name, machine_id }: Target, suffix = '') =>
	`/v1/apps/${seg(app_name)}/machines/${seg(machine_id)}${suffix}`;
const nonceHeader = (nonce?: string) => ({ 'fly-machine-lease-nonce': nonce });
const stateFilter = z
	.array(z.enum(['created', 'started', 'stopped', 'suspended']))
	.min(1)
	.optional()
	.describe('Only Machines in these states');

const action = (
	suffix: string,
	description: string,
	riskLevel: 'write' | 'destructive' = 'write',
) =>
	defineOperation({
		description,
		riskLevel,
		input: z.object(target),
		output: ok,
		request: (args) => ({ method: 'POST', path: machinePath(args, suffix) }),
	});

const machineConfigFields = {
	config: machineConfigInput,
	min_secrets_version: z.number().int().optional(),
	skip_launch: z.boolean().optional().describe('Create it stopped'),
	skip_secrets: z.boolean().optional(),
};

export const machines = {
	list: defineOperation({
		description:
			"List an app's Machines (all of them; use listForOrg to page through an organization)",
		riskLevel: 'read',
		input: z.object({
			app_name: appName,
			include_deleted: z.boolean().optional(),
			region: z.string().min(1).optional(),
			state: stateFilter,
			summary: z
				.boolean()
				.optional()
				.describe('Omit config, checks and events'),
			metadata: z
				.record(z.string().min(1), z.string())
				.optional()
				.describe(
					'Only Machines whose metadata has these exact key/value pairs',
				),
		}),
		output: z.array(machine),
		request: ({ app_name, state, metadata, ...query }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}/machines`,
			query: {
				...query,
				state: state?.join(','),
				...Object.fromEntries(
					Object.entries(metadata ?? {}).map(([key, value]) => [
						`metadata.${key}`,
						value,
					]),
				),
			},
		}),
	}),
	listForOrg: defineOperation({
		description:
			'List the Machines of every app in an organization, page by page with next_cursor. Pass region: on 2026-11-16 Fly answered 400 "misfired replay" without it whenever the org had a Machine.',
		riskLevel: 'read',
		input: z.object({
			org_slug: orgSlug,
			include_deleted: z.boolean().optional(),
			region: z.string().min(1).optional(),
			state: stateFilter,
			summary: z.boolean().optional(),
			updated_after: z
				.string()
				.min(1)
				.optional()
				.describe('RFC 3339 timestamp'),
			cursor: z.string().min(1).optional(),
			limit: z.number().int().min(1).max(1000).optional(),
		}),
		output: z.object({
			machines: z.array(orgMachine),
			next_cursor: z.string().nullish(),
			last_machine_id: z.string().nullish(),
			last_updated_at: z.string().nullish(),
			error_regions: z.array(z.string()).nullish(),
		}),
		request: ({ org_slug, state, ...query }) => ({
			method: 'GET',
			path: `/v1/orgs/${seg(org_slug)}/machines`,
			query: { ...query, state: state?.join(',') },
		}),
	}),
	create: defineOperation({
		description:
			'Create (and by default start) a Machine. Fly bills it while it runs and for its root filesystem.',
		riskLevel: 'destructive',
		input: z.object({
			app_name: appName,
			name: z.string().min(1).optional(),
			region: z
				.string()
				.min(1)
				.optional()
				.describe('Region code such as iad, or a region group such as eu'),
			...machineConfigFields,
			lease_ttl: z
				.number()
				.int()
				.positive()
				.optional()
				.describe(
					'Take a lease for this many seconds; the nonce comes back in nonce',
				),
			skip_service_registration: z
				.boolean()
				.optional()
				.describe('Create it cordoned'),
		}),
		output: machine,
		request: ({ app_name, ...body }) => ({
			method: 'POST',
			path: `/v1/apps/${seg(app_name)}/machines`,
			body,
		}),
	}),
	get: defineOperation({
		description: 'Get a Machine',
		riskLevel: 'read',
		input: z.object({
			...target,
			version: z
				.string()
				.min(1)
				.optional()
				.describe('Return this older version of the Machine'),
			include_leases: z.boolean().optional(),
		}),
		output: machine,
		request: ({ app_name, machine_id, ...query }) => ({
			method: 'GET',
			path: machinePath({ app_name, machine_id }),
			query,
		}),
	}),
	update: defineOperation({
		description:
			"Replace a Machine's whole configuration (image, size, services…). A larger size bills more.",
		riskLevel: 'destructive',
		input: z.object({
			...target,
			...machineConfigFields,
			current_version: z
				.string()
				.min(1)
				.optional()
				.describe(
					'Reject the update if the Machine changed since this version',
				),
			lease_nonce: leaseNonce.optional(),
		}),
		output: machine,
		request: ({ app_name, machine_id, lease_nonce, ...body }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }),
			body,
			headers: nonceHeader(lease_nonce),
		}),
	}),
	delete: defineOperation({
		description:
			'Permanently destroy a Machine. It must be stopped unless force is true.',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({
			...target,
			force: z.boolean().optional().describe('Kill it first if it is running'),
			lease_nonce: leaseNonce.optional(),
		}),
		output: ok,
		request: ({ app_name, machine_id, force, lease_nonce }) => ({
			method: 'DELETE',
			path: machinePath({ app_name, machine_id }),
			query: { force },
			headers: nonceHeader(lease_nonce),
		}),
	}),
	start: defineOperation({
		description: 'Start a stopped or suspended Machine',
		riskLevel: 'write',
		input: z.object(target),
		output: z.object({
			previous_state: z.string().nullish(),
			migrated: z.boolean().nullish(),
			new_host: z.string().nullish(),
		}),
		request: (args) => ({ method: 'POST', path: machinePath(args, '/start') }),
	}),
	stop: defineOperation({
		description: 'Stop a Machine, optionally with a signal and timeout',
		riskLevel: 'write',
		input: z.object({
			...target,
			signal: stopSignal.optional(),
			timeout: z
				.string()
				.min(1)
				.optional()
				.describe('Go duration to wait before killing it, such as 10s'),
		}),
		output: ok,
		request: ({ app_name, machine_id, signal, timeout }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, '/stop'),
			body: { signal, timeout },
		}),
	}),
	restart: defineOperation({
		description: 'Restart a Machine',
		riskLevel: 'write',
		input: z.object({
			...target,
			signal: stopSignal.optional(),
			timeout: z
				.string()
				.min(1)
				.optional()
				.describe('Go duration or seconds to wait before killing it'),
		}),
		output: ok,
		request: ({ app_name, machine_id, ...query }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, '/restart'),
			query,
		}),
	}),
	suspend: action(
		'/suspend',
		'Suspend a Machine so the next start can resume it from a memory snapshot',
	),
	signal: defineOperation({
		description: "Send a Unix signal to a Machine's main process",
		riskLevel: 'write',
		input: z.object({
			...target,
			signal: z.enum([
				'SIGABRT',
				'SIGALRM',
				'SIGFPE',
				'SIGHUP',
				'SIGILL',
				'SIGINT',
				'SIGKILL',
				'SIGPIPE',
				'SIGQUIT',
				'SIGSEGV',
				'SIGTERM',
				'SIGTRAP',
				'SIGUSR1',
				'SIGUSR2',
			]),
		}),
		output: ok,
		request: ({ app_name, machine_id, signal }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, '/signal'),
			body: { signal },
		}),
	}),
	wait: defineOperation({
		description:
			'Wait (up to 60 seconds) for a Machine to reach a state, such as started or stopped',
		riskLevel: 'read',
		input: z.object({
			...target,
			state: z
				.array(
					z.enum([
						'started',
						'stopped',
						'suspended',
						'destroyed',
						'failed',
						'archived',
						'settled',
					]),
				)
				.min(1)
				.optional()
				.describe('Defaults to started'),
			timeout: z.number().int().min(1).max(60).optional().describe('Seconds'),
			version: z.string().min(1).optional(),
			from_event_id: z.string().min(1).optional(),
		}),
		output: z.object({
			ok: z.boolean().nullish(),
			state: z.string().nullish(),
			event_id: z.string().nullish(),
			version: z.string().nullish(),
		}),
		request: ({ app_name, machine_id, state, timeout, ...query }) => ({
			method: 'GET',
			path: machinePath({ app_name, machine_id }, '/wait'),
			query: { ...query, timeout, state: state?.join(',') },
			timeoutMs: ((timeout ?? 60) + 15) * 1000,
		}),
	}),
	cordon: action(
		'/cordon',
		'Cordon a Machine so Fly Proxy stops routing requests to it',
	),
	uncordon: action(
		'/uncordon',
		'Uncordon a Machine so Fly Proxy routes requests to it again',
	),
	exec: defineOperation({
		description:
			'Run a command inside a running Machine and return its stdout, stderr and exit code',
		// Arbitrary commands can change or delete anything on the Machine.
		riskLevel: 'destructive',
		input: z.object({
			...target,
			command: z
				.array(z.string())
				.min(1)
				.describe(
					'Program and its arguments; run directly, not through a shell',
				),
			stdin: z.string().optional(),
			container: z.string().min(1).optional(),
			timeout: z
				.number()
				.int()
				.min(1)
				.max(600)
				.optional()
				.describe('Seconds; defaults to 10'),
		}),
		output: z.object({
			stdout: z.string().nullish(),
			stderr: z.string().nullish(),
			exit_code: z.number().int().nullish(),
			exit_signal: z.number().int().nullish(),
		}),
		request: ({ app_name, machine_id, timeout, ...body }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, '/exec'),
			body: { ...body, timeout },
			timeoutMs: ((timeout ?? 10) + 20) * 1000,
		}),
	}),
	getLease: defineOperation({
		description: 'Get the lease currently held on a Machine',
		riskLevel: 'read',
		input: z.object(target),
		output: z.object({ status: z.string().nullish(), data: lease.nullish() }),
		request: (args) => ({ method: 'GET', path: machinePath(args, '/lease') }),
	}),
	createLease: defineOperation({
		description:
			'Take (or, with lease_nonce, refresh) an exclusive lease on a Machine',
		riskLevel: 'write',
		input: z.object({
			...target,
			ttl: z
				.number()
				.int()
				.positive()
				.optional()
				.describe('Seconds; defaults to 60'),
			description: z.string().min(1).optional(),
			lease_nonce: leaseNonce.optional(),
		}),
		output: z.object({ status: z.string().nullish(), data: lease.nullish() }),
		request: ({ app_name, machine_id, lease_nonce, ...body }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, '/lease'),
			body,
			headers: nonceHeader(lease_nonce),
		}),
	}),
	releaseLease: defineOperation({
		description: 'Release a lease you hold on a Machine',
		riskLevel: 'write',
		input: z.object({ ...target, lease_nonce: leaseNonce }),
		output: z.object({ status: z.string().nullish(), data: ok.nullish() }),
		request: ({ app_name, machine_id, lease_nonce }) => ({
			method: 'DELETE',
			path: machinePath({ app_name, machine_id }, '/lease'),
			headers: nonceHeader(lease_nonce),
		}),
	}),
	getMetadata: defineOperation({
		description: "Get a Machine's metadata key/value pairs",
		riskLevel: 'read',
		input: z.object(target),
		output: z.record(z.string(), z.string()),
		request: (args) => ({
			method: 'GET',
			path: machinePath(args, '/metadata'),
		}),
	}),
	getMetadataKey: defineOperation({
		description: 'Get one metadata value of a Machine',
		riskLevel: 'read',
		input: z.object({ ...target, key: nonEmpty }),
		output: z.object({ value: z.string() }),
		request: ({ app_name, machine_id, key }) => ({
			method: 'GET',
			path: machinePath({ app_name, machine_id }, `/metadata/${seg(key)}`),
		}),
	}),
	updateMetadata: defineOperation({
		description:
			'Set several metadata keys at once; an empty string removes a key. Keys not listed stay as they are.',
		riskLevel: 'write',
		input: z.object({
			...target,
			metadata: z
				.record(z.string().min(1), z.string())
				.refine(
					(value) => Object.keys(value).length > 0,
					'Give at least one key',
				),
			machine_version: z
				.string()
				.min(1)
				.optional()
				.describe('Only apply if this is still the current version'),
		}),
		// Fly answers 204 with no body.
		output: z.object({ updated: z.array(z.string()) }),
		request: ({ app_name, machine_id, ...body }) => ({
			method: 'PATCH',
			path: machinePath({ app_name, machine_id }, '/metadata'),
			body,
		}),
		transform: (_body, { metadata }) => ({ updated: Object.keys(metadata) }),
	}),
	setMetadataKey: defineOperation({
		description: 'Set one metadata key on a Machine',
		riskLevel: 'write',
		input: z.object({ ...target, key: nonEmpty, value: nonEmpty }),
		// Fly answers 204 with no body.
		output: z.object({ key: z.string(), value: z.string() }),
		request: ({ app_name, machine_id, key, value }) => ({
			method: 'POST',
			path: machinePath({ app_name, machine_id }, `/metadata/${seg(key)}`),
			body: { value },
		}),
		transform: (_body, { key, value }) => ({ key, value }),
	}),
	deleteMetadataKey: defineOperation({
		description: 'Delete one metadata key from a Machine',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object({ ...target, key: nonEmpty }),
		// Fly answers 204 with no body.
		output: z.object({ deleted: z.string() }),
		request: ({ app_name, machine_id, key }) => ({
			method: 'DELETE',
			path: machinePath({ app_name, machine_id }, `/metadata/${seg(key)}`),
		}),
		transform: (_body, { key }) => ({ deleted: key }),
	}),
	listEvents: defineOperation({
		description: "List a Machine's recent events, newest first",
		riskLevel: 'read',
		input: z.object({
			...target,
			limit: z
				.number()
				.int()
				.min(1)
				.max(50)
				.optional()
				.describe('Defaults to 20'),
		}),
		output: z.array(machineEvent),
		request: ({ app_name, machine_id, limit }) => ({
			method: 'GET',
			path: machinePath({ app_name, machine_id }, '/events'),
			query: { limit },
		}),
	}),
	listProcesses: defineOperation({
		description: 'List the processes running on a started Machine',
		riskLevel: 'read',
		input: z.object({
			...target,
			sort_by: z.enum(['cpu', 'pid', 'stime', 'rtime']).optional(),
			order: z.enum(['asc', 'desc']).optional(),
		}),
		output: z.array(processStat),
		request: ({ app_name, machine_id, ...query }) => ({
			method: 'GET',
			path: machinePath({ app_name, machine_id }, '/ps'),
			query,
		}),
	}),
	listVersions: defineOperation({
		description: "List a Machine's configuration versions",
		riskLevel: 'read',
		input: z.object(target),
		output: z.array(
			z.object({
				version: z.string(),
				// The config as sent in that create or update request; see machines.get.
				user_config: z.record(z.string(), z.unknown()).nullish(),
			}),
		),
		request: (args) => ({
			method: 'GET',
			path: machinePath(args, '/versions'),
		}),
	}),
};
