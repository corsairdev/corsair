import { z } from 'zod';
import type { ModalRuntime } from '../client';
import { toJsonValue } from '../codec';
import type { ModalFunction } from './shared';
import {
	appNameField,
	collectLogs,
	defineOperation,
	envField,
	environmentField,
	LogEntrySchema,
	limitField,
	logSourceField,
	resolveSecrets,
	secretNamesField,
} from './shared';

export const FunctionOptionsSchema = z
	.object({
		cpu: z.number().positive().optional(),
		cpuLimit: z.number().positive().optional(),
		memoryMiB: z.number().int().positive().optional(),
		memoryLimitMiB: z.number().int().positive().optional(),
		gpu: z.string().optional().describe('e.g. "T4", "A100-80GB:2".'),
		env: envField,
		secrets: secretNamesField,
		retries: z.number().int().min(0).optional(),
		maxContainers: z.number().int().positive().optional(),
		bufferContainers: z.number().int().min(0).optional(),
		scaledownWindowMs: z.number().int().positive().optional(),
		timeoutMs: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Per-input execution timeout on Modal.'),
		routingRegion: z.string().optional(),
	})
	.optional()
	.describe(
		'Override the deployed resources and settings for these calls (creates a variant of the function).',
	);

export type FunctionOptions = z.output<typeof FunctionOptionsSchema>;

export async function toSdkFunctionOptions(
	runtime: ModalRuntime,
	options: NonNullable<FunctionOptions>,
) {
	const { secrets, ...rest } = options;
	return { ...rest, secrets: await resolveSecrets(runtime, secrets) };
}

export const argsField = z
	.array(z.unknown())
	.default([])
	.describe('Positional arguments (JSON values, sent CBOR-encoded).');
export const kwargsField = z
	.record(z.string(), z.unknown())
	.default({})
	.describe('Keyword arguments.');

export const waitMsField = z
	.number()
	.int()
	.min(0)
	.max(600_000)
	.default(120_000)
	.describe(
		'How long to wait for the result. If the call is still running then, the result has status "pending" and functionCalls.get fetches it later.',
	);

export const CallResultSchema = z.object({
	functionCallId: z.string(),
	status: z.enum(['completed', 'pending']),
	result: z
		.unknown()
		.optional()
		.describe('Return value (bytes as { $bytes: base64 }).'),
});

/** Function target: by id, or by App and function name (checked at lookup). */
const FunctionTargetInput = z.object({
	environment: environmentField,
	functionId: z
		.string()
		.min(1)
		.optional()
		.describe('Function id (fu-...). Give this, or appName and name.'),
	appName: appNameField.optional(),
	name: z.string().min(1).optional().describe('Function name inside the App.'),
	version: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A specific deployed version of the App.'),
});

type FunctionTarget = z.output<typeof FunctionTargetInput>;

async function lookupFunction(
	runtime: ModalRuntime,
	target: FunctionTarget,
): Promise<ModalFunction> {
	const byName = Boolean(target.appName && target.name);
	if (Boolean(target.functionId) === byName) {
		throw new runtime.sdk.InvalidError(
			'Give either functionId, or appName and name.',
		);
	}
	if (target.functionId) {
		return runtime.client.functions.fromId(target.functionId);
	}
	return runtime.client.functions.fromName(
		target.appName as string,
		target.name as string,
		{ version: target.version },
	);
}

type FunctionCallLike = {
	functionCallId: string;
	get(params?: { timeoutMs?: number }): Promise<unknown>;
};

/** Wait up to waitMs for a call's result; a timeout leaves it running. */
export async function awaitCall(
	runtime: ModalRuntime,
	call: FunctionCallLike,
	waitMs: number,
) {
	try {
		const result = await call.get({ timeoutMs: waitMs });
		return {
			functionCallId: call.functionCallId,
			status: 'completed' as const,
			result: toJsonValue(result),
		};
	} catch (error) {
		if (error instanceof runtime.sdk.TimeoutError) {
			return {
				functionCallId: call.functionCallId,
				status: 'pending' as const,
			};
		}
		throw error;
	}
}

export const getFunction = defineOperation({
	group: 'functions',
	name: 'get',
	description:
		'Look up a deployed function by App and name (or by id) and return its id and web URL, if it has one.',
	riskLevel: 'read',
	input: FunctionTargetInput,
	output: z.object({
		functionId: z.string(),
		webUrl: z.string().optional(),
	}),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return { functionId: fn.functionId, webUrl: await fn.getWebUrl() };
	},
});

export const getFunctionInfo = defineOperation({
	group: 'functions',
	name: 'info',
	description:
		"A deployed function's configuration: CPU, memory, GPUs, image, timeouts, retries, regions, schedule, volumes, secrets, web endpoint and class methods.",
	riskLevel: 'read',
	input: FunctionTargetInput,
	output: z.record(z.string(), z.unknown()),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return toJsonValue(await fn.info({ refresh: true }));
	},
});

export const callFunction = defineOperation({
	group: 'functions',
	name: 'call',
	description:
		'Run a deployed function with arguments and wait for its result (billed for the compute it uses). The function must accept CBOR input (Modal 1.2+ deployments).',
	riskLevel: 'destructive',
	input: FunctionTargetInput.extend({
		args: argsField,
		kwargs: kwargsField,
		options: FunctionOptionsSchema,
		waitMs: waitMsField,
	}),
	output: CallResultSchema,
	run: async (runtime, input) => {
		let fn = await lookupFunction(runtime, input);
		if (input.options) {
			// withOptions only records the overrides; instance() binds them into
			// the variant that spawn() runs.
			fn = await fn
				.withOptions(await toSdkFunctionOptions(runtime, input.options))
				.instance();
		}
		const call = await fn.spawn(input.args, input.kwargs);
		return awaitCall(runtime, call, input.waitMs);
	},
});

export const spawnFunction = defineOperation({
	group: 'functions',
	name: 'spawn',
	description:
		'Start a deployed function without waiting; returns a function call id for functionCalls.get or functionCalls.cancel.',
	riskLevel: 'destructive',
	input: FunctionTargetInput.extend({
		args: argsField,
		kwargs: kwargsField,
		options: FunctionOptionsSchema,
	}),
	output: z.object({ functionCallId: z.string() }),
	run: async (runtime, input) => {
		let fn = await lookupFunction(runtime, input);
		if (input.options) {
			// withOptions only records the overrides; instance() binds them into
			// the variant that spawn() runs.
			fn = await fn
				.withOptions(await toSdkFunctionOptions(runtime, input.options))
				.instance();
		}
		const call = await fn.spawn(input.args, input.kwargs);
		return { functionCallId: call.functionCallId };
	},
});

export const getFunctionStats = defineOperation({
	group: 'functions',
	name: 'stats',
	description:
		'Input and container counts and latency percentiles for a function over a time window.',
	riskLevel: 'read',
	input: FunctionTargetInput.extend({
		since: z.iso.datetime().optional(),
		until: z.iso.datetime().optional(),
		allVariants: z
			.boolean()
			.optional()
			.describe('Include variants made with options overrides.'),
	}),
	output: z.record(z.string(), z.unknown()),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return toJsonValue(
			await fn.stats({
				since: input.since ? new Date(input.since) : undefined,
				until: input.until ? new Date(input.until) : undefined,
				allVariants: input.allVariants,
			}),
		);
	},
});

export const getFunctionCurrentStats = defineOperation({
	group: 'functions',
	name: 'currentStats',
	description:
		'Current backlog (queued inputs) and number of running containers.',
	riskLevel: 'read',
	input: FunctionTargetInput,
	output: z.object({ backlog: z.number(), numTotalRunners: z.number() }),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		const stats = await fn.getCurrentStats();
		return { backlog: stats.backlog, numTotalRunners: stats.numTotalRunners };
	},
});

export const updateFunctionAutoscaler = defineOperation({
	group: 'functions',
	name: 'updateAutoscaler',
	description:
		'Change min/max/buffer containers and the scale-down window of a deployed function. Warm containers (minContainers, bufferContainers) are billed while idle.',
	riskLevel: 'destructive',
	input: FunctionTargetInput.extend({
		minContainers: z.number().int().min(0).optional(),
		maxContainers: z.number().int().min(0).optional(),
		bufferContainers: z.number().int().min(0).optional(),
		scaledownWindowMs: z.number().int().positive().optional(),
	}),
	output: z.object({
		minContainers: z.number().optional(),
		maxContainers: z.number().optional(),
		bufferContainers: z.number().optional(),
		scaledownWindowMs: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return fn.updateAutoscaler({
			minContainers: input.minContainers,
			maxContainers: input.maxContainers,
			bufferContainers: input.bufferContainers,
			scaledownWindowMs: input.scaledownWindowMs,
		});
	},
});

export const tailFunctionLogs = defineOperation({
	group: 'functions',
	name: 'logs',
	description: 'The most recent log lines of a function.',
	riskLevel: 'read',
	input: FunctionTargetInput.extend({
		entries: z.number().int().min(1).max(1000).default(100),
		source: logSourceField,
	}),
	output: z.object({ entries: z.array(LogEntrySchema) }),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return {
			entries: await collectLogs(
				fn.logs.tail({ entries: input.entries, source: input.source }),
				input.entries,
			),
		};
	},
});

export const fetchFunctionLogs = defineOperation({
	group: 'functions',
	name: 'fetchLogs',
	description:
		"A function's logs over a time range, with optional text search.",
	riskLevel: 'read',
	input: FunctionTargetInput.extend({
		since: z.iso.datetime(),
		until: z.iso.datetime().optional(),
		source: logSourceField,
		searchText: z.string().optional(),
		limit: limitField(5000, 500),
	}),
	output: z.object({ entries: z.array(LogEntrySchema) }),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return {
			entries: await collectLogs(
				fn.logs.fetch({
					since: new Date(input.since),
					until: input.until ? new Date(input.until) : undefined,
					source: input.source,
					searchText: input.searchText,
				}),
				input.limit,
			),
		};
	},
});

export const exportFunctionMetrics = defineOperation({
	group: 'functions',
	name: 'metrics',
	description:
		'Time series metrics for a function (see functions.metricsSchema for the available groups and names).',
	riskLevel: 'read',
	input: FunctionTargetInput.extend({
		groups: z.array(z.string()).optional(),
		since: z.iso.datetime().optional(),
		until: z.iso.datetime().optional(),
		bucketSizeSecs: z.number().int().positive().optional(),
		allVariants: z.boolean().optional(),
	}),
	output: z.record(z.string(), z.unknown()),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return toJsonValue(
			await fn.metrics.export({
				groups: input.groups,
				since: input.since ? new Date(input.since) : undefined,
				until: input.until ? new Date(input.until) : undefined,
				bucketSizeSecs: input.bucketSizeSecs,
				allVariants: input.allVariants,
			}),
		);
	},
});

export const getFunctionMetricsSchema = defineOperation({
	group: 'functions',
	name: 'metricsSchema',
	description:
		'The metric groups and definitions functions.metrics can export.',
	riskLevel: 'read',
	input: FunctionTargetInput.extend({ groups: z.array(z.string()).optional() }),
	output: z.record(z.string(), z.unknown()),
	run: async (runtime, input) => {
		const fn = await lookupFunction(runtime, input);
		return toJsonValue(await fn.metrics.schema({ groups: input.groups }));
	},
});

export const functionsOperations = [
	getFunction,
	getFunctionInfo,
	callFunction,
	spawnFunction,
	getFunctionStats,
	getFunctionCurrentStats,
	updateFunctionAutoscaler,
	tailFunctionLogs,
	fetchFunctionLogs,
	exportFunctionMetrics,
	getFunctionMetricsSchema,
] as const;
