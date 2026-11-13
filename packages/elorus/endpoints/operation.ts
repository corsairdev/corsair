import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import { z } from 'zod';
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

export type ElorusRegisteredOperation<
	K extends ElorusOperationKey,
	I extends ZodType,
	O extends ZodType,
> = CorsairEndpoint<ElorusContext, z.input<I>, z.output<O>> & {
	// This entry point accepts external values and validates them with inputSchema before execution.
	invoke: (ctx: ElorusContext, input: unknown) => Promise<z.output<O>>;
	inputSchema: I;
	outputSchema: O;
	operationKey: K;
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

const responseSchemaCache = new WeakMap<ZodType, ZodType>();

// The generated schemas are strict for inputs and shared by outputs. A response field Elorus adds later must not
// fail a call that already succeeded (a create would report failure after the record exists), so responses are
// parsed with the same shapes but unknown object keys stripped instead of rejected.
export function acceptUnknownResponseFields(schema: ZodType): ZodType {
	const cached = responseSchemaCache.get(schema);
	if (cached) return cached;
	let relaxed: ZodType = schema;
	if (schema instanceof z.ZodObject) {
		const shape: Record<string, ZodType> = {};
		for (const [key, value] of Object.entries(schema.shape)) {
			shape[key] = acceptUnknownResponseFields(value as ZodType);
		}
		relaxed = z.object(shape);
	} else if (schema instanceof z.ZodOptional) {
		relaxed = acceptUnknownResponseFields(
			schema.unwrap() as ZodType,
		).optional();
	} else if (schema instanceof z.ZodNullable) {
		relaxed = acceptUnknownResponseFields(
			schema.unwrap() as ZodType,
		).nullable();
	} else if (schema instanceof z.ZodArray) {
		relaxed = z.array(acceptUnknownResponseFields(schema.element as ZodType));
	} else if (schema instanceof z.ZodRecord) {
		relaxed = z.record(
			schema.keyType as z.ZodString,
			acceptUnknownResponseFields(schema.valueType as ZodType),
		);
	}
	responseSchemaCache.set(schema, relaxed);
	return relaxed;
}

export function createElorusOperation<
	K extends ElorusOperationKey,
	I extends ZodType<ElorusOperationInput>,
	O extends ZodType,
>(
	operationKey: K,
	schemas: { input: I; output: O },
): ElorusRegisteredOperation<K, I, O> {
	const responseSchema = acceptUnknownResponseFields(schemas.output);
	const execute = async (
		ctx: ElorusContext,
		parsed: z.output<I>,
	): Promise<z.output<O>> => {
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
		const output = responseSchema.parse(response) as z.output<O>;
		await logEventFromContext(
			ctx,
			`elorus.${specification.version}.${specification.operationId}`,
			{ version: specification.version },
			'completed',
		);
		return output;
	};
	const endpoint: CorsairEndpoint<ElorusContext, z.input<I>, z.output<O>> = (
		ctx,
		input,
	) => execute(ctx, schemas.input.parse(input));
	const invoke = async (ctx: ElorusContext, input: unknown) =>
		execute(ctx, schemas.input.parse(input));
	return Object.assign(endpoint, {
		invoke,
		inputSchema: schemas.input,
		outputSchema: schemas.output,
		operationKey,
	});
}
