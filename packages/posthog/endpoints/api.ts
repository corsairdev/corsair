import { logEventFromContext } from 'corsair/core';
import type { PostHogApiOptions } from '../client';
import { makePostHogApiRequest, unpackPostHogCredentials } from '../client';
import type { PostHogEndpoints } from '../index';
import type { PostHogEndpointInputs } from './types';
import {
	PostHogEndpointInputSchemas,
	PostHogEndpointOutputSchemas,
} from './types';

type CaptureEndpointKey =
	| 'aliasCreate'
	| 'eventCreate'
	| 'identityCreate'
	| 'trackPage'
	| 'trackScreen';

/** Endpoints that call PostHog's private API with a personal key. */
export type ApiEndpointKey = Exclude<
	keyof PostHogEndpoints,
	CaptureEndpointKey
>;

type QueryValue = string | number | boolean | string[] | undefined;

/** What one private-API endpoint sends, built from its input. */
export type ApiRequest = {
	path: string;
	method?: PostHogApiOptions['method'];
	query?: Record<string, QueryValue>;
	// JSON request body; built from input the endpoint's schema has already checked.
	body?: Record<string, unknown>;
	/** Small payload for the event log: ids and filters, never results. */
	log?: Record<string, unknown>;
	/**
	 * Turns PostHog's answer into the endpoint's output (e.g. empty 204s).
	 * `unknown` in and out: the output schema checks the result afterwards.
	 */
	transform?: (response: unknown) => unknown;
};

/** The endpoint's input without the per-call `project_id` override. */
export type ScopedInput<K extends ApiEndpointKey> = Omit<
	PostHogEndpointInputs[K],
	'project_id'
>;

export const PROJECT = '/api/projects/{project_id}';
export const ENVIRONMENT = '/api/environments/{project_id}';

export function pathId(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Drops undefined values so they never reach the query string or body. */
export function compact<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, v]) => v !== undefined),
	) as T;
}

/**
 * Builds a private-API endpoint. Every input may carry `project_id`, which
 * overrides the connected project for that call; it never reaches PostHog as
 * a parameter.
 */
export function defineApiEndpoint<K extends ApiEndpointKey>(
	key: K,
	eventType: string,
	build: (input: ScopedInput<K>) => ApiRequest,
): PostHogEndpoints[K] {
	const inputSchema = PostHogEndpointInputSchemas[key];
	const outputSchema = PostHogEndpointOutputSchemas[key];

	const endpoint = async (
		ctx: Parameters<PostHogEndpoints[K]>[0],
		rawInput: PostHogEndpointInputs[K],
	) => {
		// Validates and strips keys the schema doesn't know (e.g. a start_date
		// sent to experiments.create), whatever the caller passed in.
		const input = inputSchema.parse(rawInput) as PostHogEndpointInputs[K] & {
			project_id?: string | number;
		};
		const { project_id, ...rest } = input;
		const request = build(rest as ScopedInput<K>);
		// Unknown until the output schema checks it below.
		const response = await makePostHogApiRequest<unknown>(
			unpackPostHogCredentials(ctx.key),
			request.path,
			{
				method: request.method,
				query: request.query ? compact(request.query) : undefined,
				body: request.body ? compact(request.body) : undefined,
				projectId: project_id,
			},
		);
		const result = request.transform ? request.transform(response) : response;
		const parsed = outputSchema.safeParse(result);
		if (!parsed.success) {
			const issue = parsed.error.issues[0];
			throw new Error(
				`[posthog] ${eventType}: response did not match the schema at ${issue?.path.join('.') || '(root)'}: ${issue?.message}`,
			);
		}
		await logEventFromContext(
			ctx,
			eventType,
			{ ...(request.log ?? {}), ...(project_id ? { project_id } : {}) },
			'completed',
		);
		return parsed.data;
	};
	// The handler's parameter and return types come from the zod schemas for
	// key K; TypeScript can't relate them to PostHogEndpoints[K] generically,
	// so the cast goes through unknown.
	return endpoint as unknown as PostHogEndpoints[K];
}
