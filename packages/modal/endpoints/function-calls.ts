import { z } from 'zod';
import { awaitCall, CallResultSchema } from './functions';
import {
	collectLogs,
	defineOperation,
	LogEntrySchema,
	logSourceField,
	OkSchema,
} from './shared';

const functionCallIdField = z
	.string()
	.min(1)
	.describe(
		'Function call id (fc-...), from functions.spawn or a pending call.',
	);

export const getFunctionCall = defineOperation({
	group: 'functionCalls',
	name: 'get',
	description:
		'The result of a spawned call, waiting up to waitMs; status "pending" if it is still running.',
	riskLevel: 'read',
	input: z.object({
		functionCallId: functionCallIdField,
		waitMs: z
			.number()
			.int()
			.min(0)
			.max(600_000)
			.default(0)
			.describe('How long to wait for it to finish (0 = check once).'),
	}),
	output: CallResultSchema,
	run: async (runtime, input) => {
		const call = await runtime.client.functionCalls.fromId(
			input.functionCallId,
		);
		return awaitCall(runtime, call, input.waitMs);
	},
});

export const cancelFunctionCall = defineOperation({
	group: 'functionCalls',
	name: 'cancel',
	description:
		'Cancel a spawned call. With terminateContainers the containers running it are stopped too.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({
		functionCallId: functionCallIdField,
		terminateContainers: z.boolean().optional(),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const call = await runtime.client.functionCalls.fromId(
			input.functionCallId,
		);
		await call.cancel({ terminateContainers: input.terminateContainers });
		return { ok: true as const };
	},
});

export const tailFunctionCallLogs = defineOperation({
	group: 'functionCalls',
	name: 'logs',
	description: 'The most recent log lines of one function call.',
	riskLevel: 'read',
	input: z.object({
		functionCallId: functionCallIdField,
		entries: z.number().int().min(1).max(1000).default(100),
		source: logSourceField,
	}),
	output: z.object({ entries: z.array(LogEntrySchema) }),
	run: async (runtime, input) => {
		const call = await runtime.client.functionCalls.fromId(
			input.functionCallId,
		);
		return {
			entries: await collectLogs(
				call.logs.tail({ entries: input.entries, source: input.source }),
				input.entries,
			),
		};
	},
});

export const functionCallsOperations = [
	getFunctionCall,
	cancelFunctionCall,
	tailFunctionCallLogs,
] as const;
