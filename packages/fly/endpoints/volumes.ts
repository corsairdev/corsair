import { z } from 'zod';
import { seg } from '../client';
import { defineOperation } from './define';
import {
	appName,
	orgSlug,
	orgVolume,
	volume,
	volumeId,
	volumeSnapshot,
} from './schemas';

type Target = { app_name: string; volume_id: string };
const target = { app_name: appName, volume_id: volumeId };
// What the live API returned on 2026-11-16 (the spec documents an empty body).
const snapshotAccepted = z.object({
	Msg: z.object({
		backup: z.object({ graph_id: z.string().min(1), state: z.string() }),
	}),
});
const volumePath = ({ app_name, volume_id }: Target, suffix = '') =>
	`/v1/apps/${seg(app_name)}/volumes/${seg(volume_id)}${suffix}`;

export const volumes = {
	list: defineOperation({
		description:
			"List an app's volumes (all of them; use listForOrg to page through an organization)",
		riskLevel: 'read',
		input: z.object({
			app_name: appName,
			summary: z.boolean().optional().describe('Omit block and size details'),
		}),
		output: z.array(volume),
		request: ({ app_name, summary }) => ({
			method: 'GET',
			path: `/v1/apps/${seg(app_name)}/volumes`,
			query: { summary },
		}),
	}),
	listForOrg: defineOperation({
		description:
			'List the volumes of every app in an organization, page by page with next_cursor',
		riskLevel: 'read',
		input: z.object({
			org_slug: orgSlug,
			include_deleted: z.boolean().optional(),
			region: z.string().min(1).optional(),
			state: z
				.string()
				.min(1)
				.optional()
				.describe('Comma-separated volume states, such as created'),
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
			volumes: z.array(orgVolume),
			next_cursor: z.string().nullish(),
			last_volume_id: z.string().nullish(),
			last_updated_at: z.string().nullish(),
		}),
		request: ({ org_slug, ...query }) => ({
			method: 'GET',
			path: `/v1/orgs/${seg(org_slug)}/volumes`,
			query,
		}),
	}),
	create: defineOperation({
		description:
			'Create a volume, empty or restored from a snapshot or another volume. Fly bills it by size.',
		riskLevel: 'destructive',
		input: z.object({
			app_name: appName,
			name: z
				.string()
				.regex(
					/^[a-z0-9_]{1,30}$/,
					'At most 30 lowercase letters, digits and underscores',
				),
			size_gb: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Required unless source_volume_id is set'),
			region: z.string().min(1).optional(),
			encrypted: z.boolean().optional(),
			fstype: z.enum(['ext4', 'raw']).optional(),
			snapshot_id: z.string().min(1).optional(),
			source_volume_id: z.string().min(1).optional(),
			snapshot_retention: z.number().int().min(1).max(60).optional(),
			auto_backup_enabled: z.boolean().optional(),
			require_unique_zone: z.boolean().optional(),
			unique_zone_app_wide: z.boolean().optional(),
			compute: z
				.object({
					cpu_kind: z.enum(['shared', 'performance']).optional(),
					cpus: z.number().int().positive().optional(),
					memory_mb: z.number().int().positive().optional(),
					host_dedication_id: z.string().optional(),
					required_host_features: z.array(z.string()).optional(),
				})
				.strict()
				.optional()
				.describe('Size of the Machine that will mount it, for placement'),
		}),
		output: volume,
		request: ({ app_name, ...body }) => ({
			method: 'POST',
			path: `/v1/apps/${seg(app_name)}/volumes`,
			body,
		}),
	}),
	get: defineOperation({
		description: 'Get a volume',
		riskLevel: 'read',
		input: z.object(target),
		output: volume,
		request: (args) => ({ method: 'GET', path: volumePath(args) }),
	}),
	update: defineOperation({
		description:
			"Change a volume's automatic snapshots and their retention. More snapshots kept means more billed snapshot storage.",
		riskLevel: 'destructive',
		input: z.object({
			...target,
			auto_backup_enabled: z.boolean().optional(),
			snapshot_retention: z.number().int().min(1).max(60).optional(),
		}),
		output: volume,
		request: ({ app_name, volume_id, ...body }) => ({
			method: 'PUT',
			path: volumePath({ app_name, volume_id }),
			body,
		}),
	}),
	delete: defineOperation({
		description: 'Permanently destroy a volume and its data',
		riskLevel: 'destructive',
		irreversible: true,
		input: z.object(target),
		output: volume,
		request: (args) => ({ method: 'DELETE', path: volumePath(args) }),
	}),
	extend: defineOperation({
		description:
			'Grow a volume to a larger size. Volumes cannot shrink, and Fly bills the new size.',
		riskLevel: 'destructive',
		input: z.object({ ...target, size_gb: z.number().int().min(2) }),
		output: z.object({ volume, needs_restart: z.boolean().nullish() }),
		request: ({ app_name, volume_id, size_gb }) => ({
			method: 'PUT',
			path: volumePath({ app_name, volume_id }, '/extend'),
			body: { size_gb },
		}),
	}),
	listSnapshots: defineOperation({
		description: "List a volume's snapshots",
		riskLevel: 'read',
		input: z.object(target),
		output: z.array(volumeSnapshot),
		request: (args) => ({
			method: 'GET',
			path: volumePath(args, '/snapshots'),
		}),
	}),
	createSnapshot: defineOperation({
		description:
			'Take a snapshot of a volume now. Fly bills snapshot storage beyond the free allowance.',
		riskLevel: 'destructive',
		input: z.object(target),
		output: z.object({
			volume_id: z.string(),
			/** Same ID listSnapshots shows once the snapshot is under way. */
			snapshot_id: z.string().nullable(),
			state: z.string().nullable(),
		}),
		request: (args) => ({
			method: 'POST',
			path: volumePath(args, '/snapshots'),
		}),
		// An empty body is the documented reply; any other body must have the
		// live shape, and a malformed one fails parsing instead of reading as success.
		transform: (body, { volume_id }) => {
			if (body === undefined) {
				return { volume_id, snapshot_id: null, state: null };
			}
			const { backup } = snapshotAccepted.parse(body).Msg;
			return { volume_id, snapshot_id: backup.graph_id, state: backup.state };
		},
	}),
};
