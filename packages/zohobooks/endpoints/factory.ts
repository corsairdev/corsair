import { logEventFromContext } from 'corsair/core';
import { makeZohoBooksRequest } from '../client';
import type { ZohoBooksContext } from '../index';
import { zohoBooksOperations } from '../openapi';
import type {
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
} from '../schema/openapi-types';
import {
	parseZohoBooksInput,
	parseZohoBooksOutput,
} from '../schema/openapi-validation';

export type ZohoBooksOperationContext = Pick<
	ZohoBooksContext,
	'key' | 'options' | '$getAccountId'
> & { database?: ZohoBooksContext['database'] };

export type ZohoBooksOperationEndpoint = (
	ctx: ZohoBooksOperationContext,
	input: ZohoBooksOperationInput,
) => Promise<ZohoBooksOperationOutput>;

export function createZohoBooksOperationEndpoint(
	operationId: string,
): ZohoBooksOperationEndpoint {
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
