import { z } from 'zod';
import type { CanvasOperation, CanvasOperationName } from './operations';
import { canvasOperations } from './operations';
import type { CanvasEndpointOutputs } from './response-schemas';
import { CanvasEndpointOutputSchemas } from './response-schemas';

export type {
	CanvasAccount,
	CanvasAssignment,
	CanvasConversation,
	CanvasCourse,
	CanvasDiscussionTopic,
	CanvasEndpointOutputs,
	CanvasEnrollment,
	CanvasEntity,
	CanvasFile,
	CanvasGraphqlResponse,
	CanvasGroup,
	CanvasModule,
	CanvasPage,
	CanvasPermissions,
	CanvasQuiz,
	CanvasUnreadCount,
	CanvasUser,
} from './response-schemas';
export {
	CanvasEndpointOutputSchemas,
	createResponseSchema,
	expectsListResponse,
} from './response-schemas';

type ExtractPathParams<Path extends string> =
	Path extends `${string}{${infer Param}}${infer Rest}`
		? Param | ExtractPathParams<Rest>
		: never;

type HasPathParams<Path extends string> = [ExtractPathParams<Path>] extends [
	never,
]
	? false
	: true;

type PathParamsFor<Path extends string> = HasPathParams<Path> extends true
	? { [K in ExtractPathParams<Path>]: string }
	: Record<string, string>;

type IsMutationMethod<M extends string> = M extends 'POST' | 'PUT' | 'PATCH'
	? true
	: false;

type RequiresBody<K extends CanvasOperationName> = IsMutationMethod<
	(typeof canvasOperations)[K]['method']
> extends true
	? (typeof canvasOperations)[K] extends { bodyless: true }
		? false
		: true
	: false;

type CanvasRequestFieldsBase = {
	/** Query string parameters (array values become `key[]` for Canvas). */
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/** Shared request shape used by the factory; pathParams required when the path has placeholders. */
export type CanvasRequestInput = CanvasRequestFieldsBase & {
	pathParams?: Record<string, string>;
	body?: Record<string, unknown>;
};

/** @deprecated Prefer CanvasEndpointOutputs[K] — kept for callers that need a wide union. */
export type CanvasResponse = CanvasEndpointOutputs[CanvasOperationName];

export type CanvasEndpointInputs = {
	[K in CanvasOperationName]: CanvasRequestFieldsBase &
		(HasPathParams<(typeof canvasOperations)[K]['path']> extends true
			? { pathParams: PathParamsFor<(typeof canvasOperations)[K]['path']> }
			: { pathParams?: Record<string, string> }) &
		(RequiresBody<K> extends true
			? { body: Record<string, unknown> }
			: { body?: Record<string, unknown> });
};

const queryValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
]);

const querySchema = z.record(z.string(), queryValueSchema.optional());
const bodySchema = z.record(z.string(), z.unknown());

function pathParamNames(path: string): string[] {
	return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

function createRequestInputSchema(operation: CanvasOperation): z.ZodTypeAny {
	const method: string = operation.method;
	const isMutation =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const names = pathParamNames(operation.path);

	const requiredPathParams = Object.fromEntries(
		names.map((name) => [name, z.string().min(1)]),
	) as Record<string, z.ZodString>;

	const pathParamsSchema =
		names.length === 0
			? z.record(z.string(), z.string().min(1)).optional()
			: z.object(requiredPathParams).passthrough();

	const base = {
		pathParams: pathParamsSchema,
		query: querySchema.optional(),
	};

	if (!isMutation) {
		return z.object({
			...base,
			body: bodySchema.optional(),
		});
	}

	if (operation.bodyless === true) {
		return z.object({
			...base,
			body: bodySchema.optional().default({}),
		});
	}

	return z.object({
		...base,
		body: bodySchema.refine(
			(value) => Object.keys(value).length > 0,
			'Request body is required for this Canvas mutation',
		),
	});
}

export const CanvasEndpointInputSchemas = Object.fromEntries(
	Object.entries(canvasOperations).map(([name, operation]) => [
		name,
		createRequestInputSchema(operation),
	]),
) as { [K in CanvasOperationName]: z.ZodTypeAny };

// CanvasEndpointOutputSchemas is re-exported from ./response-schemas above.
