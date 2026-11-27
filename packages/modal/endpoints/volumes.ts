import { z } from 'zod';
import type { ModalRuntime } from '../client';
import {
	createdBeforeField,
	defineOperation,
	environmentField,
	isoFromSeconds,
	limitField,
	OkSchema,
	pagedList,
} from './shared';

const VolumeSchema = z.object({
	volumeId: z.string(),
	name: z.string().optional(),
});

const volumeNameField = z.string().min(1).describe('Volume name.');

// FileEntry.FileType in Modal's API.
const FILE_TYPES: Record<number, string> = {
	1: 'file',
	2: 'directory',
	3: 'symlink',
	4: 'fifo',
	5: 'socket',
};
const VOLUME_FS_VERSION_V2 = 2;

async function lookupVolumeMetadata(runtime: ModalRuntime, name: string) {
	try {
		const response = await runtime.client.cpClient.volumeGetOrCreate({
			deploymentName: name,
			environmentName: runtime.client.environmentName(),
			objectCreationType: 0, // lookup only
		});
		return {
			volumeId: response.volumeId,
			version: response.metadata?.version || response.version,
		};
	} catch (error) {
		if ((error as { code?: number }).code === 5) {
			throw new runtime.sdk.NotFoundError(`Volume '${name}' not found`);
		}
		throw error;
	}
}

export const getVolume = defineOperation({
	group: 'volumes',
	name: 'get',
	description:
		'Look up a Volume by name and return its id. 404 if it does not exist.',
	riskLevel: 'read',
	input: z.object({ environment: environmentField, name: volumeNameField }),
	output: VolumeSchema,
	run: async (runtime, input) => {
		const volume = await runtime.client.volumes.fromName(input.name);
		return { volumeId: volume.volumeId, name: volume.name ?? input.name };
	},
});

export const createVolume = defineOperation({
	group: 'volumes',
	name: 'create',
	description:
		'Get a Volume by name, creating it if it does not exist. Volumes are persistent network file systems for sandboxes and functions (storage is billed).',
	riskLevel: 'write',
	input: z.object({
		environment: environmentField,
		name: volumeNameField,
		version: z
			.union([z.literal(1), z.literal(2)])
			.optional()
			.describe(
				'File system version for a new Volume (2 is the newer, faster one).',
			),
	}),
	output: VolumeSchema,
	run: async (runtime, input) => {
		const volume = await runtime.client.volumes.fromName(input.name, {
			createIfMissing: true,
			version: input.version,
		});
		return { volumeId: volume.volumeId, name: volume.name ?? input.name };
	},
});

export const listVolumes = defineOperation({
	group: 'volumes',
	name: 'list',
	description: 'List the Volumes in an environment, newest first.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		limit: limitField(1000, 100),
		createdBefore: createdBeforeField,
	}),
	output: z.object({
		volumes: z.array(
			z.object({
				volumeId: z.string(),
				name: z.string(),
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
				version: z.number().optional(),
			}),
		),
		nextCreatedBefore: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const environmentName = runtime.client.environmentName();
		const { items, nextCreatedBefore } = await pagedList(
			async (pagination) =>
				(
					await runtime.client.cpClient.volumeList({
						environmentName,
						pagination,
					})
				).items,
			input.limit,
			input.createdBefore,
		);
		return {
			volumes: items.map((item) => ({
				volumeId: item.volumeId,
				name: item.label,
				createdAt: isoFromSeconds(item.createdAt),
				createdBy: item.metadata?.creationInfo?.createdBy || undefined,
				version: item.metadata?.version || undefined,
			})),
			nextCreatedBefore,
		};
	},
});

export const deleteVolume = defineOperation({
	group: 'volumes',
	name: 'delete',
	description:
		'Delete a Volume and all its files. Running Apps that mount it lose access. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({
		environment: environmentField,
		name: volumeNameField,
		allowMissing: z
			.boolean()
			.optional()
			.describe('Succeed even if the Volume does not exist.'),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.volumes.delete(input.name, {
			allowMissing: input.allowMissing,
		});
		return { ok: true as const };
	},
});

export const listVolumeFiles = defineOperation({
	group: 'volumes',
	name: 'listFiles',
	description: 'List files and directories in a Volume under a path.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		name: volumeNameField,
		path: z.string().default('/').describe('Directory inside the Volume.'),
		recursive: z.boolean().optional(),
		limit: limitField(10_000, 1000),
	}),
	output: z.object({
		entries: z.array(
			z.object({
				path: z.string(),
				type: z.string(),
				size: z.number(),
				mtime: z.string().optional(),
			}),
		),
		truncated: z.boolean(),
	}),
	run: async (runtime, input) => {
		const { volumeId, version } = await lookupVolumeMetadata(
			runtime,
			input.name,
		);
		const request = {
			volumeId,
			path: input.path,
			recursive: input.recursive ?? false,
			maxEntries: input.limit + 1,
		};
		const stream =
			version === VOLUME_FS_VERSION_V2
				? runtime.client.cpClient.volumeListFiles2(request)
				: runtime.client.cpClient.volumeListFiles(request);
		const entries = [];
		for await (const batch of stream) {
			for (const entry of batch.entries) {
				entries.push({
					path: entry.path,
					type: FILE_TYPES[entry.type] ?? 'unknown',
					size: Number(entry.size),
					mtime: isoFromSeconds(Number(entry.mtime)),
				});
			}
			if (entries.length > input.limit) break;
		}
		return {
			entries: entries.slice(0, input.limit),
			truncated: entries.length > input.limit,
		};
	},
});

export const removeVolumeFile = defineOperation({
	group: 'volumes',
	name: 'removeFile',
	description:
		'Delete a file, or with recursive a directory, from a Volume. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({
		environment: environmentField,
		name: volumeNameField,
		path: z.string().min(1),
		recursive: z.boolean().optional(),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const { volumeId, version } = await lookupVolumeMetadata(
			runtime,
			input.name,
		);
		const request = {
			volumeId,
			path: input.path,
			recursive: input.recursive ?? false,
		};
		if (version === VOLUME_FS_VERSION_V2) {
			await runtime.client.cpClient.volumeRemoveFile2(request);
		} else {
			await runtime.client.cpClient.volumeRemoveFile(request);
		}
		return { ok: true as const };
	},
});

export const volumesOperations = [
	getVolume,
	createVolume,
	listVolumes,
	deleteVolume,
	listVolumeFiles,
	removeVolumeFile,
] as const;
