import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { StoryblokContext } from '..';
import type { StoryblokRegion } from '../client';
import { makeStoryblokRequest, spacePath, storyblokBase } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/** The regions the Management API documents a host for. */
const REGIONS: readonly StoryblokRegion[] = ['eu', 'us', 'ca', 'ap', 'cn'];

/**
 * The space and its region are account settings, not per-call arguments: every
 * route sits under `/spaces/:space_id`, and the host depends on where the space
 * is hosted. Reading them from `options` first means a script can pass them
 * inline; the account lookup is the stored form.
 */
export type StoryblokSpace = {
	spaceId: number;
	region: StoryblokRegion;
	/** The region root, for the routes above the space. */
	base: string;
	/** `/spaces/<id>`, the prefix space-scoped routes carry. */
	prefix: string;
};

/** The plugin option wins over the stored account value, as for the space. */
async function resolveRegion(ctx: StoryblokContext): Promise<StoryblokRegion> {
	const storedRegion = await ctx.keys?.get_region?.();
	return ctx.options.region ?? pickRegion(storedRegion) ?? 'eu';
}

export async function resolveSpace(
	ctx: StoryblokContext,
): Promise<StoryblokSpace> {
	const optionSpace = ctx.options.spaceId;
	const region = await resolveRegion(ctx);
	if (optionSpace !== undefined) {
		return {
			spaceId: optionSpace,
			region,
			base: storyblokBase(region),
			prefix: spacePath(optionSpace),
		};
	}

	const stored = await ctx.keys?.get_space_id?.();
	if (stored) {
		const spaceId = Number(stored);
		if (!Number.isFinite(spaceId)) {
			throw new Error(
				`[storyblok:space_id] The stored space_id is not a number: ${stored}`,
			);
		}
		return {
			spaceId,
			region,
			base: storyblokBase(region),
			prefix: spacePath(spaceId),
		};
	}

	throw new AuthMissingError(
		'storyblok',
		'api_key',
		'[auth-missing:storyblok:space_id] Set spaceId on the plugin or store space_id on the account; every Management API route is scoped to a space.',
	);
}

function pickRegion(
	value: string | null | undefined,
): StoryblokRegion | undefined {
	const candidate = value?.trim().toLowerCase();
	return REGIONS.find((region) => region === candidate);
}

/**
 * Validates the input, sends the request, and validates the response, then logs
 * the event. Story content is not logged: it holds unpublished copy and
 * sometimes personal data, so `log` picks ids and counts.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: StoryblokContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (
		parsed: z.output<Input>,
		space: StoryblokSpace,
	) => {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: UnknownJson; // unknown: already validated by the input schema
		/**
		 * How the path is resolved against the space prefix:
		 * - `scoped` (the default) puts it below the space, as `/stories`.
		 * - `space` is the space root itself, as `spaces.get`.
		 * - `root` sits above the space, as `spaces.list`.
		 */
		scope?: 'scoped' | 'space' | 'root';
	},
	options: {
		/**
		 * Turns the raw body into the documented output before it is validated:
		 * some routes answer a bodyless 204 or drop the record's wrapper key.
		 */
		shape?: (
			raw: unknown, // unknown: the response body, undefined on a 204
			parsed: z.output<Input>,
		) => unknown; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// `spaces.list` sits above every space and is how a caller finds a space
	// id, so a missing space only fails the routes that sit below one.
	let space: StoryblokSpace;
	let missingSpace: unknown; // unknown: the AuthMissingError, rethrown as is
	try {
		space = await resolveSpace(ctx);
	} catch (error) {
		if (!(error instanceof AuthMissingError)) throw error;
		missingSpace = error;
		const region = await resolveRegion(ctx);
		space = {
			spaceId: Number.NaN,
			region,
			base: storyblokBase(region),
			prefix: '',
		};
	}
	const {
		method,
		path,
		query,
		body,
		scope = 'scoped',
	} = toRequest(parsed, space);
	if (missingSpace !== undefined && scope !== 'root') throw missingSpace;
	const raw = await makeStoryblokRequest(ctx.key, space.base, {
		method,
		// The scope decides how the route meets the space prefix, so no endpoint
		// builds it by hand.
		path:
			scope === 'root'
				? path
				: scope === 'space'
					? space.prefix
					: `${space.prefix}${path}`,
		query,
		body,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`storyblok.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * True only for a response with no body, as a 204 arrives. A JSON body, even
 * `{}`, goes through output validation instead.
 */
export function isEmptyBody(
	raw: unknown, // unknown: whatever the route answered
): boolean {
	return raw === undefined || raw === null || raw === '';
}

/**
 * The result of a delete Storyblok answers with a bodyless 204. A body that
 * wraps the deleted record under `key` also confirms it; any other body is
 * not a confirmation, so it throws rather than report a delete that may not
 * have happened.
 */
export function confirmDeletion<Id extends string | number>(
	raw: unknown, // unknown: whatever the delete route answered
	key: string,
	id: Id,
): { id: Id; deleted: true } {
	const record =
		raw && typeof raw === 'object' && !Array.isArray(raw)
			? (raw as Record<string, unknown>)[key] // unknown: checked just below
			: undefined;
	if (
		isEmptyBody(raw) ||
		(record !== null && typeof record === 'object' && !Array.isArray(record))
	) {
		return { id, deleted: true as const };
	}
	throw new Error(
		`Storyblok answered the delete with an unexpected body, so it is not confirmed. Read the ${key} again before assuming it was removed.`,
	);
}

/**
 * The record under `key`. Storyblok wraps most records (`{ asset: {...} }`), but
 * GET and DELETE on a single asset answer the bare record, so a body without
 * the key is wrapped here.
 */
export function wrapRecord(
	key: string,
	raw: unknown, // unknown: a wrapped or bare record
): unknown {
	if (raw && typeof raw === 'object' && key in raw) return raw;
	return { [key]: raw };
}
