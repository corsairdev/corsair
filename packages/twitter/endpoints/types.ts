import type { z } from 'zod';
import { twitterInputSchemas, twitterOutputSchemas } from './openapi-schema';
import type {
	TwitterOperationInputs,
	TwitterOperationOutputs,
} from './operation-types';
import type {
	TweetsCreateInput,
	TweetsCreateReplyInput,
	TweetsCreateReplyResponse,
	TweetsCreateResponse,
} from './tweets';
import {
	TweetsCreateInputSchema,
	TweetsCreateReplyInputSchema,
	TweetsCreateReplyResponseSchema,
	TweetsCreateResponseSchema,
} from './tweets';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`posts.search.recent`, `users.me`), plus the two legacy tweets.* endpoints.

export type TwitterEndpointInputs = TwitterOperationInputs & {
	'tweets.create': TweetsCreateInput;
	'tweets.createReply': TweetsCreateReplyInput;
	/** @deprecated The key before 0.2; use `'tweets.create'`. */
	tweetsCreate: TweetsCreateInput;
	/** @deprecated The key before 0.2; use `'tweets.createReply'`. */
	tweetsCreateReply: TweetsCreateReplyInput;
};
export type TwitterEndpointOutputs = TwitterOperationOutputs & {
	'tweets.create': TweetsCreateResponse;
	'tweets.createReply': TweetsCreateReplyResponse;
	/** @deprecated The key before 0.2; use `'tweets.create'`. */
	tweetsCreate: TweetsCreateResponse;
	/** @deprecated The key before 0.2; use `'tweets.createReply'`. */
	tweetsCreateReply: TweetsCreateReplyResponse;
};

export type {
	TwitterJsonValue,
	TwitterOperationId,
} from './operation-types';
export type {
	TweetsCreateInput,
	TweetsCreateReplyInput,
	TweetsCreateReplyResponse,
	TweetsCreateResponse,
} from './tweets';

/**
 * Copies the lazy getters of the generated schema record (reading a
 * descriptor doesn't build a schema) and adds the hand-written ones.
 */
function withExtra(
	base: Readonly<Record<string, z.ZodType>>,
	extra: Record<string, z.ZodType>,
): Readonly<Record<string, z.ZodType>> {
	return Object.defineProperties(
		{},
		{
			...Object.getOwnPropertyDescriptors(base),
			...Object.getOwnPropertyDescriptors(extra),
		},
	);
}

/**
 * Every operation's zod schemas by id. Each generated key is a getter that
 * builds its schema on first read (see endpoints/openapi-schema.ts); the
 * legacy tweets.* endpoints are listed under their dotted ids and, as before
 * 0.2, as `tweetsCreate` and `tweetsCreateReply`.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperties adds. schema.test.ts checks every id is present.
export const TwitterEndpointInputSchemas = withExtra(twitterInputSchemas, {
	'tweets.create': TweetsCreateInputSchema,
	'tweets.createReply': TweetsCreateReplyInputSchema,
	tweetsCreate: TweetsCreateInputSchema,
	tweetsCreateReply: TweetsCreateReplyInputSchema,
}) as unknown as Readonly<Record<keyof TwitterEndpointInputs, z.ZodType>>;

export const TwitterEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperties adds (see above).
	withExtra(twitterOutputSchemas, {
		'tweets.create': TweetsCreateResponseSchema,
		'tweets.createReply': TweetsCreateReplyResponseSchema,
		tweetsCreate: TweetsCreateResponseSchema,
		tweetsCreateReply: TweetsCreateReplyResponseSchema,
	}) as unknown as Readonly<Record<keyof TwitterEndpointOutputs, z.ZodType>>;
