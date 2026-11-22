import { logEventFromContext } from 'corsair/core';
import { makeZohoBooksRequest } from '../client';
import type { ZohoBooksContext } from '../index';
import { zohoBooksOperationContracts, zohoBooksOperations } from '../openapi';
import type {
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
} from '../schema/openapi-types';
import {
	parseZohoBooksInput,
	parseZohoBooksOutput,
	parseZohoBooksTypedInput,
	parseZohoBooksTypedOutput,
} from '../schema/openapi-validation';
import type {
	ZohoBooksOperationFor,
	ZohoBooksOperationId,
	ZohoBooksOperationInputFor,
	ZohoBooksOperationOutputFor,
} from '../schema/operation-types';
import { zohoBooksOperationId } from '../schema/operation-types';

export type ZohoBooksOperationContext = Pick<
	ZohoBooksContext,
	'key' | 'options' | '$getAccountId'
> & { database?: ZohoBooksContext['database'] };

export type ZohoBooksOperationEndpoint<
	Id extends ZohoBooksOperationId = ZohoBooksOperationId,
> = {
	(
		ctx: ZohoBooksOperationContext,
		input: ZohoBooksOperationInputFor<Id>,
	): Promise<ZohoBooksOperationOutputFor<Id>>;
	readonly [zohoBooksOperationId]: Id;
};

export type ZohoBooksRuntimeOperationEndpoint = (
	ctx: ZohoBooksOperationContext,
	input: ZohoBooksOperationInput,
) => Promise<ZohoBooksOperationOutput>;

export function createZohoBooksRuntimeOperationEndpoint(
	operationId: string,
): ZohoBooksRuntimeOperationEndpoint {
	const operation = zohoBooksOperations.find(
		(candidate) => candidate.id === operationId,
	);
	if (!operation)
		throw new Error(`Unknown Zoho Books operation: ${operationId}`);

	return async (ctx, input) => {
		const parsedInput = parseZohoBooksInput(operation, input);
		const response = await makeZohoBooksRequest(ctx, operation, parsedInput);
		const parsedOutput = parseZohoBooksOutput(operation, response);
		await logEventFromContext(
			ctx,
			`zohobooks.${operation.group}.${operation.name}`,
			{ method: operation.method, path: operation.path },
			'completed',
		);
		return parsedOutput;
	};
}

// One lookup table instead of a linear search per endpoint: 884 endpoints are created at import.
const contractsById: ReadonlyMap<
	string,
	(typeof zohoBooksOperationContracts)[number]
> = new Map(
	zohoBooksOperationContracts.map((operation) => [operation.id, operation]),
);

function getOperation<Id extends ZohoBooksOperationId>(
	operationId: Id,
): ZohoBooksOperationFor<Id> {
	const operation = contractsById.get(operationId);
	if (!operation || operation.id !== operationId)
		throw new Error(`Unknown Zoho Books operation: ${operationId}`);
	return operation as ZohoBooksOperationFor<Id>;
}

export function createZohoBooksOperationEndpoint<
	Id extends ZohoBooksOperationId,
>(operationId: Id): ZohoBooksOperationEndpoint<Id> {
	const operation = getOperation(operationId);

	const endpoint = async (
		ctx: ZohoBooksOperationContext,
		input: ZohoBooksOperationInputFor<Id>,
	) => {
		const parsedInput = parseZohoBooksTypedInput(operation, input);
		const response = await makeZohoBooksRequest(ctx, operation, parsedInput);
		const parsedOutput = parseZohoBooksTypedOutput(operation, response);
		await logEventFromContext(
			ctx,
			`zohobooks.${operation.group}.${operation.name}`,
			{ method: operation.method, path: operation.path },
			'completed',
		);
		return parsedOutput;
	};
	return Object.assign(endpoint, { [zohoBooksOperationId]: operationId });
}
