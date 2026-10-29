import type {
	CorsairEndpoint,
	EndpointMetaEntry,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { ApifyMcpContext } from '../index';
import { makeApifyRequest } from '../rest-client';
import type {
	ApifyOperationDefinition,
	ApifyOperationTree,
} from './operations';
import { apifyOperations } from './operations';
import type { ApifyOperationInput, ApifyOperationOutput } from './rest-types';
import { ApifyOperationOutputSchema } from './rest-types';

type ApifyEndpoint = CorsairEndpoint<
	ApifyMcpContext,
	ApifyOperationInput,
	ApifyOperationOutput
>;

export type ApifyEndpointTree<T extends ApifyOperationTree> = {
	[K in keyof T]: T[K] extends ApifyOperationDefinition
		? ApifyEndpoint
		: T[K] extends ApifyOperationTree
			? ApifyEndpointTree<T[K]>
			: never;
};

function isOperationDefinition(
	value: ApifyOperationDefinition | ApifyOperationTree,
): value is ApifyOperationDefinition {
	return 'method' in value && 'path' in value;
}

function buildEndpointTree<T extends ApifyOperationTree>(
	tree: T,
	segments: string[] = [],
): ApifyEndpointTree<T> {
	// Accumulator holds mixed endpoint fns / nested trees before the final cast.
	const endpoints: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(tree)) {
		if (isOperationDefinition(value)) {
			const operationPath = [...segments, key].join('.');
			endpoints[key] = async (
				ctx: ApifyMcpContext,
				input: ApifyOperationInput,
			) => {
				const response = await makeApifyRequest(value, ctx.key, input ?? {});
				try {
					await logEventFromContext(
						ctx,
						`apify.${operationPath}`,
						{
							method: value.method,
							path: value.path,
						},
						'completed',
					);
				} catch {}
				return response;
			};
		} else {
			endpoints[key] = buildEndpointTree(value, [...segments, key]);
		}
	}

	return endpoints as ApifyEndpointTree<T>;
}

function createOperationInputSchema(operation: ApifyOperationDefinition) {
	const shape: Record<string, z.ZodTypeAny> = {
		// Apify request bodies differ per endpoint and are passed through as-is.
		body: z.unknown().optional(),
		// Query values are endpoint-specific and not shared across operations.
		query: z.record(z.string(), z.unknown()).optional(),
		// Custom headers are forwarded without a fixed provider-wide shape.
		headers: z.record(z.string(), z.unknown()).optional(),
		contentType: z.string().optional(),
		mediaType: z.string().optional(),
	};

	for (const param of operation.pathParams) {
		shape[param] = z.union([z.string(), z.number()]);
	}

	for (const param of operation.queryParams ?? []) {
		// Query metadata names the param but does not constrain its value type.
		shape[param] = z.unknown().optional();
	}

	return z.object(shape).loose();
}

export function buildApifyEndpointSchemas<T extends ApifyOperationTree>(
	tree: T,
	segments: string[] = [],
): RequiredPluginEndpointSchemas<ApifyEndpointTree<T>> {
	// Schema map is keyed by dotted path before the typed cast.
	const schemas: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(tree)) {
		if (isOperationDefinition(value)) {
			schemas[[...segments, key].join('.')] = {
				input: createOperationInputSchema(value),
				output: ApifyOperationOutputSchema,
			};
		} else {
			Object.assign(
				schemas,
				buildApifyEndpointSchemas(value, [...segments, key]),
			);
		}
	}

	return schemas as RequiredPluginEndpointSchemas<ApifyEndpointTree<T>>;
}

export function buildApifyEndpointMeta<T extends ApifyOperationTree>(
	tree: T,
	segments: string[] = [],
): RequiredPluginEndpointMeta<ApifyEndpointTree<T>> {
	const meta: Record<string, EndpointMetaEntry> = {};

	for (const [key, value] of Object.entries(tree)) {
		if (isOperationDefinition(value)) {
			meta[[...segments, key].join('.')] = {
				riskLevel: value.riskLevel,
				irreversible: value.irreversible,
				description: value.description,
			};
		} else {
			Object.assign(meta, buildApifyEndpointMeta(value, [...segments, key]));
		}
	}

	return meta as RequiredPluginEndpointMeta<ApifyEndpointTree<T>>;
}

export const ApifyRestEndpoints = buildEndpointTree(apifyOperations);

export * from './operations';
