import { z } from 'zod';
import type { ModalRuntime } from '../client';
import {
	argsField,
	awaitCall,
	CallResultSchema,
	FunctionOptionsSchema,
	kwargsField,
	toSdkFunctionOptions,
	waitMsField,
} from './functions';
import { appNameField, defineOperation, environmentField } from './shared';

const ClassMethodInput = z.object({
	environment: environmentField,
	appName: appNameField,
	className: z
		.string()
		.min(1)
		.describe('Name of the deployed class (modal.Cls).'),
	method: z.string().min(1).describe('Method to run.'),
	parameters: z
		.record(z.string(), z.unknown())
		.optional()
		.describe("Values for the class's modal.parameter() fields."),
	version: z.number().int().positive().optional(),
	args: argsField,
	kwargs: kwargsField,
	options: FunctionOptionsSchema,
});

async function spawnMethod(
	runtime: ModalRuntime,
	input: z.output<typeof ClassMethodInput>,
) {
	let cls = await runtime.client.cls.fromName(input.appName, input.className, {
		version: input.version,
	});
	if (input.options) {
		cls = cls.withOptions(await toSdkFunctionOptions(runtime, input.options));
	}
	const instance = await cls.instance(input.parameters);
	return instance.method(input.method).spawn(input.args, input.kwargs);
}

export const callClassMethod = defineOperation({
	group: 'classes',
	name: 'call',
	description:
		'Run a method of a deployed class and wait for its result (billed for the compute it uses).',
	riskLevel: 'destructive',
	input: ClassMethodInput.extend({ waitMs: waitMsField }),
	output: CallResultSchema,
	run: async (runtime, input) =>
		awaitCall(runtime, await spawnMethod(runtime, input), input.waitMs),
});

export const spawnClassMethod = defineOperation({
	group: 'classes',
	name: 'spawn',
	description:
		'Start a method of a deployed class without waiting; returns a function call id.',
	riskLevel: 'destructive',
	input: ClassMethodInput,
	output: z.object({ functionCallId: z.string() }),
	run: async (runtime, input) => {
		const call = await spawnMethod(runtime, input);
		return { functionCallId: call.functionCallId };
	},
});

export const classesOperations = [callClassMethod, spawnClassMethod] as const;
