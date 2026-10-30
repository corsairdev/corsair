import type { EndpointRiskLevel } from 'corsair/core';
import type {
	CanvasHttpMethod,
	CanvasOperation,
	CanvasOperationName,
} from './operations';
import { canvasOperations } from './operations';

/**
 * Workday-style flat route table derived from the Canvas operation registry.
 * Paths match Canvas LMS REST API docs: https://canvas.instructure.com/doc/api/
 */
export type CanvasRoute = {
	key: CanvasOperationName;
	method: CanvasHttpMethod;
	path: string;
	description: string;
	pathParams: readonly string[];
	riskLevel: EndpointRiskLevel;
	bodyless: boolean;
	graphql: boolean;
};

function pathParamsOf(path: string): readonly string[] {
	return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

function riskFor(
	method: CanvasHttpMethod,
	explicit?: 'read' | 'write' | 'destructive',
): EndpointRiskLevel {
	if (explicit) return explicit;
	if (method === 'DELETE') return 'destructive';
	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		return 'write';
	}
	return 'read';
}

export const canvasRoutes: readonly CanvasRoute[] = (
	Object.entries(canvasOperations) as [CanvasOperationName, CanvasOperation][]
).map(([key, op]) => ({
	key,
	method: op.method,
	path: op.path,
	description: op.description,
	pathParams: pathParamsOf(op.path),
	riskLevel: riskFor(op.method, op.riskLevel),
	bodyless: op.bodyless === true,
	graphql: op.path === '/api/graphql',
}));

export function getCanvasRoute(key: CanvasOperationName): CanvasRoute {
	const route = canvasRoutes.find((entry) => entry.key === key);
	if (!route) {
		throw new Error(`[canvas] Unknown operation: ${key}`);
	}
	return route;
}
