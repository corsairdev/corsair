import { z } from 'zod';
import type { ModalRuntime } from '../client';
import { encodePickle, pickleToJson } from '../codec';
import {
	createdBeforeField,
	defineOperation,
	environmentField,
	isoFromSeconds,
	limitField,
	OkSchema,
	pagedList,
} from './shared';

const queueNameField = z.string().min(1).describe('Queue name.');
const partitionField = z
	.string()
	.min(1)
	.max(64)
	.optional()
	.describe('Partition key (1-64 bytes); omit for the default partition.');

const QueueInput = z.object({
	environment: environmentField,
	name: queueNameField,
});

function lookupQueue(runtime: ModalRuntime, name: string) {
	return runtime.client.queues.fromName(name);
}

// put, get and peek call the gRPC methods behind the SDK's Queue directly,
// with the plugin's own pickler: the SDK's pickler truncates integers beyond
// 32 bits and cannot read Python tuples, sets or big ints (see codec.ts).
// The loops mirror the SDK's Queue.put/getMany/iterate.

function partitionKey(partition: string | undefined): Uint8Array {
	if (!partition) return new Uint8Array();
	const key = new TextEncoder().encode(partition);
	if (key.length > 64) {
		throw new Error('[modal] queue partition key must be 1 to 64 bytes');
	}
	return key;
}

const RESOURCE_EXHAUSTED = 8;
const DEFAULT_PARTITION_TTL_MS = 24 * 3600 * 1000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createQueue = defineOperation({
	group: 'queues',
	name: 'create',
	description:
		'Get a named Queue, creating it if it does not exist. Values are pickled, so Python code reads them as ordinary objects.',
	riskLevel: 'write',
	input: QueueInput,
	output: z.object({ queueId: z.string(), name: z.string() }),
	run: async (runtime, input) => {
		const queue = await runtime.client.queues.fromName(input.name, {
			createIfMissing: true,
		});
		return { queueId: queue.queueId, name: input.name };
	},
});

export const listQueues = defineOperation({
	group: 'queues',
	name: 'list',
	description:
		'List the named Queues in an environment with their partition count and size.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		limit: limitField(1000, 100),
		createdBefore: createdBeforeField,
	}),
	output: z.object({
		queues: z.array(
			z.object({
				queueId: z.string(),
				name: z.string(),
				numPartitions: z.number(),
				totalSize: z.number(),
				createdAt: z.string().optional(),
			}),
		),
		nextCreatedBefore: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const environmentName = runtime.client.environmentName();
		const { items, nextCreatedBefore } = await pagedList(
			async (pagination) =>
				(
					await runtime.client.cpClient.queueList({
						environmentName,
						totalSizeLimit: 100_001,
						pagination,
					})
				).queues,
			input.limit,
			input.createdBefore,
		);
		return {
			queues: items.map((item) => ({
				queueId: item.queueId,
				name: item.name,
				numPartitions: item.numPartitions,
				totalSize: item.totalSize,
				createdAt: isoFromSeconds(item.createdAt),
			})),
			nextCreatedBefore,
		};
	},
});

export const deleteQueue = defineOperation({
	group: 'queues',
	name: 'delete',
	description: 'Delete a Queue and everything in it. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: QueueInput.extend({ allowMissing: z.boolean().optional() }),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.queues.delete(input.name, {
			allowMissing: input.allowMissing,
		});
		return { ok: true as const };
	},
});

export const putQueue = defineOperation({
	group: 'queues',
	name: 'put',
	description:
		'Add values (JSON) to the end of a Queue. { $bytes: base64 } is stored as Python bytes.',
	riskLevel: 'write',
	input: QueueInput.extend({
		values: z.array(z.unknown()).min(1).max(5000),
		partition: partitionField,
		partitionTtlMs: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'How long the partition lives without writes (default 24 hours).',
			),
		timeoutMs: z
			.number()
			.int()
			.positive()
			.max(120_000)
			.default(10_000)
			.describe('How long to retry while the Queue is full.'),
	}),
	output: z.object({ count: z.number() }),
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		const request = {
			queueId: queue.queueId,
			values: input.values.map(encodePickle),
			partitionKey: partitionKey(input.partition),
			partitionTtlSeconds:
				(input.partitionTtlMs ?? DEFAULT_PARTITION_TTL_MS) / 1000,
		};
		const deadline = Date.now() + input.timeoutMs;
		let delay = 100;
		while (true) {
			try {
				await runtime.client.cpClient.queuePut(request);
				return { count: input.values.length };
			} catch (error) {
				// A full Queue answers RESOURCE_EXHAUSTED: back off until timeoutMs.
				const full = (error as { code?: unknown })?.code === RESOURCE_EXHAUSTED;
				const remaining = deadline - Date.now();
				if (!full || remaining <= 0) throw error;
				delay = Math.min(delay * 2, 30_000, remaining);
				await sleep(delay);
			}
		}
	},
});

export const getQueue = defineOperation({
	group: 'queues',
	name: 'get',
	description:
		'Remove and return up to `count` values from the front of a Queue, waiting up to timeoutMs for one to arrive. Returns [] when it stays empty. Python tuples and sets come back as arrays, bytes as { $bytes }, other objects as { $pickle: base64 }.',
	riskLevel: 'write',
	input: QueueInput.extend({
		count: z.number().int().min(1).max(1000).default(1),
		partition: partitionField,
		timeoutMs: z
			.number()
			.int()
			.min(0)
			.max(60_000)
			.default(0)
			.describe('How long to wait for a value (0 = do not wait).'),
	}),
	output: z.object({ values: z.array(z.unknown()) }),
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		const key = partitionKey(input.partition);
		const deadline = Date.now() + input.timeoutMs;
		while (true) {
			const remaining = Math.max(0, deadline - Date.now());
			const response = await runtime.client.cpClient.queueGet({
				queueId: queue.queueId,
				partitionKey: key,
				timeout: Math.min(50_000, remaining) / 1000,
				nValues: input.count,
			});
			if (response.values?.length) {
				return { values: response.values.map(pickleToJson) };
			}
			if (Date.now() >= deadline) return { values: [] };
		}
	},
});

export const peekQueue = defineOperation({
	group: 'queues',
	name: 'peek',
	description:
		'Read values from a Queue in order without removing them (decoded as in queues.get).',
	riskLevel: 'read',
	input: QueueInput.extend({
		partition: partitionField,
		limit: limitField(1000, 100),
	}),
	output: z.object({ values: z.array(z.unknown()), truncated: z.boolean() }),
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		const key = partitionKey(input.partition);
		const values: unknown[] = [];
		let lastEntryId = '';
		while (true) {
			const response = await runtime.client.cpClient.queueNextItems({
				queueId: queue.queueId,
				partitionKey: key,
				itemPollTimeout: 0,
				lastEntryId,
			});
			if (!response.items?.length) return { values, truncated: false };
			for (const item of response.items) {
				if (values.length >= input.limit) return { values, truncated: true };
				values.push(pickleToJson(item.value));
				lastEntryId = item.entryId;
			}
		}
	},
});

export const lenQueue = defineOperation({
	group: 'queues',
	name: 'len',
	description:
		'Number of values in a Queue partition, or in all partitions with total.',
	riskLevel: 'read',
	input: QueueInput.extend({
		partition: partitionField,
		total: z.boolean().optional().describe('Count all partitions.'),
	}),
	output: z.object({ length: z.number() }),
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		return {
			length: await queue.len({
				partition: input.partition,
				total: input.total,
			}),
		};
	},
});

export const clearQueue = defineOperation({
	group: 'queues',
	name: 'clear',
	description:
		'Remove every value from a Queue partition, or from all partitions with all. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: QueueInput.extend({
		partition: partitionField,
		all: z.boolean().optional().describe('Clear every partition.'),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		await queue.clear({ partition: input.partition, all: input.all });
		return { ok: true as const };
	},
});

export const queuesOperations = [
	createQueue,
	listQueues,
	deleteQueue,
	putQueue,
	getQueue,
	peekQueue,
	lenQueue,
	clearQueue,
] as const;
