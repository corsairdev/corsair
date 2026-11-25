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

// Inputs and outputs of every operation, keyed by its Corsair name
// (`posts.search.recent`, `users.me`), plus the two legacy tweets.* endpoints.

export type TwitterEndpointInputs = TwitterOperationInputs & {
	'tweets.create': TweetsCreateInput;
	'tweets.createReply': TweetsCreateReplyInput;
};
export type TwitterEndpointOutputs = TwitterOperationOutputs & {
	'tweets.create': TweetsCreateResponse;
	'tweets.createReply': TweetsCreateReplyResponse;
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
 * Every generated operation's zod schemas by id. Each key is a getter that
 * builds its schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const TwitterEndpointInputSchemas =
	twitterInputSchemas as unknown as Readonly<
		Record<keyof TwitterOperationInputs, z.ZodType>
	>;

export const TwitterEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	twitterOutputSchemas as unknown as Readonly<
		Record<keyof TwitterOperationOutputs, z.ZodType>
	>;
