import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodType, z } from 'zod';
import { makeElorusRequest } from '../client';
import type { ElorusContext } from '../index';
import { elorusOperationSpecs } from './specs';
import type { ElorusOperationKey, elorusOperationSchemas } from './types';

type ElorusOperationInput = {
	path?: Record<string, string | number>;
	// Query fields differ by endpoint and were parsed against the generated OpenAPI schema.
	query?: Record<string, unknown>;
	// Every body is endpoint-specific and was parsed against its generated OpenAPI schema.
	body?: unknown;
	form?: Record<string, string | number | boolean | Blob | undefined>;
	demo?: boolean;
};

export type ElorusOperationInputs = {
	[K in ElorusOperationKey]: z.input<
		(typeof elorusOperationSchemas)[K]['input']
	>;
};

export type ElorusOperationOutputs = {
	[K in ElorusOperationKey]: z.output<
		(typeof elorusOperationSchemas)[K]['output']
	>;
};

export function createElorusOperation<
	I extends ZodType<ElorusOperationInput>,
	O extends ZodType,
>(
	operationKey: ElorusOperationKey,
	schemas: { input: I; output: O },
): CorsairEndpoint<ElorusContext, z.input<I>, z.output<O>> {
	return async (ctx, input) => {
		const parsed = schemas.input.parse(input);
		const specification = elorusOperationSpecs[operationKey];
		const organizationId =
			ctx.options.organizationId ?? (await ctx.keys.get_organization_id());
		if (!organizationId) {
			throw new Error('Elorus requires an organization ID for every request.');
		}
		const response = await makeElorusRequest(specification.route, ctx.key, {
			method: specification.method,
			path: parsed.path,
			query: parsed.query,
			body: parsed.body,
			form: parsed.form,
			organizationId,
			demo: parsed.demo ?? ctx.options.demo,
			mode: specification.mode,
		});
		const output = schemas.output.parse(response);
		await logEventFromContext(
			ctx,
			`elorus.${specification.version}.${specification.operationId}`,
			{ version: specification.version },
			'completed',
		);
		return output;
	};
}
