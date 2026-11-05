import type { ReplyioEndpointInputs, ReplyioEndpointOutputs } from './types';

/**
 * Minimal context required by Reply.io endpoint implementations.
 *
 * Endpoint functions only need the resolved API key plus the event-logging
 * capability (`$getAccountId`, used by `logEventFromContext`). Declaring this
 * narrow structural type — instead of the full `ReplyioContext` — keeps every
 * implementation and unit test free of type assertions. A plain function type
 * is used (rather than `CorsairEndpoint`, whose context parameter is
 * constrained to the full framework context) so the narrow context is
 * accepted; the resulting functions remain assignable to the plugin endpoint
 * tree, and at runtime the framework always passes a full context that
 * structurally contains these fields.
 */
export type ReplyioEndpointContext = {
	key: string;
	$getAccountId: () => Promise<string>;
};

export type ReplyioEndpoint<K extends keyof ReplyioEndpointOutputs> = (
	ctx: ReplyioEndpointContext,
	args: ReplyioEndpointInputs[K],
) => Promise<ReplyioEndpointOutputs[K]>;
