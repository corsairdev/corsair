import type { z } from 'zod';
import {
	deployHQOperationKeys,
	deployHQOperations,
} from './openapi-operations';

// Every operation schema originates in the official OpenAPI document.
export const DeployHQEndpointInputSchemas: Record<string, z.ZodType> =
	Object.fromEntries(
		deployHQOperationKeys.map((key) => [
			key,
			deployHQOperations[key].inputSchema,
		]),
	);

export const DeployHQEndpointOutputSchemas: Record<string, z.ZodType> =
	Object.fromEntries(
		deployHQOperationKeys.map((key) => [
			key,
			deployHQOperations[key].outputSchema,
		]),
	);
