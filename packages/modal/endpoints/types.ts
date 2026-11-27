import type { z } from 'zod';
import { modalOperations } from './operations';
import { operationKey } from './shared';

type Operations = (typeof modalOperations)[number];

type KeyOf<O> = O extends {
	group: infer G extends string;
	name: infer N extends string;
}
	? `${G}.${N}`
	: never;

/** Input schema per operation, keyed "group.name". */
export const ModalEndpointInputSchemas = Object.fromEntries(
	modalOperations.map((operation) => [
		operationKey(operation),
		operation.input,
	]),
) as Record<string, z.ZodType>;

/** Output schema per operation, keyed "group.name". */
export const ModalEndpointOutputSchemas = Object.fromEntries(
	modalOperations.map((operation) => [
		operationKey(operation),
		operation.output,
	]),
) as Record<string, z.ZodType>;

export type ModalOperationKey = KeyOf<Operations>;

export type ModalEndpointInputs = {
	[O in Operations as KeyOf<O>]: z.input<O['input']>;
};

export type ModalEndpointOutputs = {
	[O in Operations as KeyOf<O>]: z.output<O['output']>;
};

export type ModalEndpointInput<K extends ModalOperationKey> =
	ModalEndpointInputs[K];
export type ModalEndpointOutput<K extends ModalOperationKey> =
	ModalEndpointOutputs[K];
