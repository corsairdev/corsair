import type {
	CorsairEndpoint,
	EndpointMetaEntry,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeApifyRequest } from '../client';
import type { ApifyContext } from '../index';
import type {
	ApifyOperationDefinition,
	ApifyOperationTree,
} from './operations';
import { apifyOperations } from './operations';
import type { ApifyOperationInput, ApifyOperationOutput } from './types';
import { ApifyOperationOutputSchema } from './types';

type ApifyEndpoint = CorsairEndpoint<
	ApifyContext,
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
	// The recursive builder accumulates heterogeneous endpoint functions before the final typed tree cast.
	const endpoints: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(tree)) {
		if (isOperationDefinition(value)) {
			const operationPath = [...segments, key].join('.');
			endpoints[key] = async (
				ctx: ApifyContext,
				input: ApifyOperationInput,
			) => {
				const response = await makeApifyRequest(value, ctx.key, input ?? {});
				await logEventFromContext(
					ctx,
					`apify.${operationPath}`,
					{
						method: value.method,
						path: value.path,
					},
					'completed',
				);
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
		// Apify operation bodies vary per endpoint and can include arbitrary JSON payloads.
		body: z.unknown().optional(),
		// Query values are endpoint-specific primitives preserved by the generic operation router.
		query: z.record(z.string(), z.unknown()).optional(),
		// Custom headers are passed through to Apify without a stable provider-wide shape.
		headers: z.record(z.string(), z.unknown()).optional(),
		contentType: z.string().optional(),
		mediaType: z.string().optional(),
	};

	for (const param of operation.pathParams) {
		shape[param] = z.union([z.string(), z.number()]);
	}

	for (const param of operation.queryParams ?? []) {
		// Generated query metadata names the parameter but does not constrain its provider-specific value type.
		shape[param] = z.unknown().optional();
	}

	return z.object(shape).loose();
}

export function buildApifyEndpointSchemas<T extends ApifyOperationTree>(
	tree: T,
	segments: string[] = [],
): RequiredPluginEndpointSchemas<ApifyEndpointTree<T>> {
	// Schema entries are accumulated by dotted operation path before the typed schema-map cast.
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

export const ApifyEndpoints = buildEndpointTree(apifyOperations);

export * from './operations';
export * from './types';
