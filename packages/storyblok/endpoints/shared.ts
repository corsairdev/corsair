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

export async function resolveSpace(
	ctx: StoryblokContext,
): Promise<StoryblokSpace> {
	const optionSpace = ctx.options.spaceId;
	const optionRegion = ctx.options.region;
	const storedRegion = await ctx.keys?.get_region?.();
	// The plugin option wins over the stored account value, as for the space.
	const region = optionRegion ?? pickRegion(storedRegion) ?? 'eu';
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
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const space = await resolveSpace(ctx);
	const {
		method,
		path,
		query,
		body,
		scope = 'scoped',
	} = toRequest(parsed, space);
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
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`storyblok.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
