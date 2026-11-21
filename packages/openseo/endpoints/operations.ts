import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { callOpenseoTool } from '../client';
import type { OpenseoContext } from '../index';
import {
	getOpenseoInputSchema,
	getOpenseoOutputSchema,
	openseoOperationFor,
} from './json-schema';
import type {
	OpenseoOperationId,
	OpenseoOperationInputs,
	OpenseoOperationOutputs,
} from './operation-types';

export type OpenseoOperationEndpoint<Id extends OpenseoOperationId> =
	CorsairEndpoint<
		OpenseoContext,
		OpenseoOperationInputs[Id],
		OpenseoOperationOutputs[Id]
	>;

/**
 * One endpoint per OpenSEO MCP tool: validate the arguments against the tool's
 * input schema, call the tool, and parse its structured result with the
 * tool's output schema.
 */
export function createOpenseoOperation<Id extends OpenseoOperationId>(
	id: Id,
): OpenseoOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = openseoOperationFor(id);
		// Send what was validated, not the caller's object.
		const args = getOpenseoInputSchema(id).parse(input ?? {});

		const result = await callOpenseoTool(operation.tool, args, ctx.key);

		// The output schema is the tool's published one; a result that doesn't
		// match it is an error, never replaced with a default.
		const parsed = getOpenseoOutputSchema(id).parse(
			result,
		) as OpenseoOperationOutputs[Id];

		// Keywords, domains and project data are user content: log only which operation ran.
		await logEventFromContext(
			ctx,
			'openseo.operation',
			{ operationId: id },
			'completed',
		);
		return parsed;
	};
}
