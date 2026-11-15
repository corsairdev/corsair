import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PrismicContext } from '..';
import type { PrismicCredentials, PrismicRequest } from '../client';
import { makePrismicRequest, PrismicAPIError } from '../client';
import { PrismicEndpointOutputSchemas } from './types';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/** A repository id is the first label of its host, so nothing else may pass. */
const REPOSITORY_ID = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Reads the repository id: the call's own override, else the plugin option, else
 * the one stored on the connected account (`repository`). Hub serves many
 * accounts from one plugin instance, so the account's value is the usual source.
 * The Content API host is built from it, so it is checked before any request.
 */
export async function resolveRepository(
	ctx: PrismicContext,
	override: string | undefined,
): Promise<string> {
	const repository = (
		override?.trim() ||
		ctx.options?.repository?.trim() ||
		(await ctx.keys?.get_repository?.())?.trim() ||
		''
	).toLowerCase();
	if (!repository) {
		throw new AuthMissingError(
			'prismic',
			'repository',
			'[auth-missing:prismic:repository]: a Prismic repository id is required, such as `my-repo` from `my-repo.prismic.io`. Store it on the account with keys.set_repository, or pass prismic({ repository }).',
		);
	}
	if (!REPOSITORY_ID.test(repository)) {
		throw new PrismicAPIError(
			'The Prismic repository id must be lowercase letters, digits and hyphens, such as `my-repo` from `my-repo.prismic.io`.',
		);
	}
	return repository;
}

/**
 * The private repository's access token: the plugin option, else the one stored
 * on the account (`access_token`). A public repository has none.
 */
async function resolveAccessToken(
	ctx: PrismicContext,
): Promise<string | undefined> {
	const token =
		ctx.options?.accessToken?.trim() ||
		(await ctx.keys?.get_access_token?.())?.trim();
	return token || undefined;
}

/** Helpers a request builder can use before the request is sent. */
export type RequestHelpers = {
	/** The repository's published `master` ref, read from repository metadata. */
	masterRef: () => Promise<string>;
};

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * Reads on a private repository carry the access token, and migration writes
 * carry the write token (`ctx.key`), both added by the client from the
 * credentials here.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PrismicContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (
		parsed: z.output<Input>,
		helpers: RequestHelpers,
	) => PrismicRequest | Promise<PrismicRequest>,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// Only the repository-info call takes an id, so the override is read from the
	// parsed input when that field exists.
	const override =
		parsed !== null &&
		typeof parsed === 'object' &&
		'repository' in parsed &&
		typeof (parsed as { repository?: string }).repository === 'string'
			? (parsed as { repository: string }).repository
			: undefined;
	const repository = await resolveRepository(ctx, override);

	const credentials: PrismicCredentials = {
		repository,
		// The write token is the account's key, resolved by the key builder.
		writeToken: ctx.key?.trim() || undefined,
		accessToken: await resolveAccessToken(ctx),
	};
	const helpers: RequestHelpers = {
		masterRef: async () => {
			const info = PrismicEndpointOutputSchemas.repositoryInfo.parse(
				await makePrismicRequest(credentials, {
					method: 'GET',
					api: 'content',
					url: '',
				}),
			);
			const master = info.refs.find((ref) => ref.isMasterRef)?.ref;
			if (!master) {
				throw new PrismicAPIError(
					'Prismic returned no master ref for this repository.',
				);
			}
			return master;
		},
	};
	const request = await toRequest(parsed, helpers);
	const raw = await makePrismicRequest(credentials, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`prismic.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
