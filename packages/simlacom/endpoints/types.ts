import { operationData } from '../operation-data';
import type {
	SimlaComEndpointInputs,
	SimlaComEndpointOutputs,
} from './operation-io-types';
import type { JsonSchema, SimlaComOperation } from './operation-types';

export type {
	SimlaComEndpointInputs,
	SimlaComEndpointOutputs,
	SimlaComOperationId,
} from './operation-io-types';
export type {
	JsonSchema,
	JsonValue,
	OperationData,
	SimlaComOperation,
} from './operation-types';

export {
	SIMLACOM_INPUT_SCHEMAS as SimlaComEndpointInputSchemas,
	SIMLACOM_OUTPUT_SCHEMAS as SimlaComEndpointOutputSchemas,
} from './schemas';

export type SimlaComEndpointInput =
	SimlaComEndpointInputs[keyof SimlaComEndpointInputs];
export type SimlaComEndpointOutput =
	SimlaComEndpointOutputs[keyof SimlaComEndpointOutputs];

export const SIMLACOM_OPERATIONS: readonly SimlaComOperation[] =
	operationData.operations;

export function getSimlaComOperation(id: string): SimlaComOperation {
	const operation = SIMLACOM_OPERATIONS.find(
		(candidate) => candidate.id === id,
	);
	if (!operation) throw new Error(`Unknown Simla.com operation: ${id}`);
	return operation;
}

export const SIMLACOM_OPENAPI_SCHEMAS = new Map<string, JsonSchema>(
	Object.entries(operationData.schemas),
);
