import { z } from 'zod';
import type { ModalRuntime } from '../client';
import { toJsonValue } from '../codec';
import {
	collect,
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
	description: 'Add values (JSON) to the end of a Queue.',
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
		await queue.putMany(input.values, {
			partition: input.partition,
			partitionTtlMs: input.partitionTtlMs,
			timeoutMs: input.timeoutMs,
		});
		return { count: input.values.length };
	},
});

export const getQueue = defineOperation({
	group: 'queues',
	name: 'get',
	description:
		'Remove and return up to `count` values from the front of a Queue, waiting up to timeoutMs for one to arrive. Returns [] when it stays empty.',
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
		try {
			const values = await queue.getMany(input.count, {
				partition: input.partition,
				timeoutMs: input.timeoutMs,
			});
			return { values: values.map(toJsonValue) };
		} catch (error) {
			if (error instanceof runtime.sdk.QueueEmptyError) return { values: [] };
			throw error;
		}
	},
});

export const peekQueue = defineOperation({
	group: 'queues',
	name: 'peek',
	description: 'Read values from a Queue in order without removing them.',
	riskLevel: 'read',
	input: QueueInput.extend({
		partition: partitionField,
		limit: limitField(1000, 100),
	}),
	output: z.object({ values: z.array(z.unknown()), truncated: z.boolean() }),
	run: async (runtime, input) => {
		const queue = await lookupQueue(runtime, input.name);
		const { items, truncated } = await collect(
			queue.iterate({ partition: input.partition, itemPollTimeoutMs: 0 }),
			input.limit,
		);
		return { values: items.map(toJsonValue), truncated };
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
